import moment from 'moment';
import serverJob from '../../queue/job';
import db from '../../db/db';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import paraChecker from '../../util/paraChecker';
import { sequelize, dnnUser as User, schedule as Schedule, container as Container, image as Image, machine as Machine } from '../../models/index';

const BOOKMAXIMUN = 100;

const instantUpdateContainer = async (schedule, times) => {
  let tryTimes = times;
  if (tryTimes > 0) {
    let result = await serverJob.updateASchedule(schedule);
    if (!result) {
      setTimeout(() => {
        instantUpdateContainer(schedule, tryTimes - 1);
      }, 10000);
    }

  }
};

const instantCreateContainer = async (schedule, times) => {
  let tryTimes = times;
  if (tryTimes > 0) {
    console.log(`Start to create container ${schedule.id}`);
    let result = await serverJob.startASchedule(schedule);
    if (result) {
      setTimeout(() => {
        instantUpdateContainer(schedule, 3);
      }, 5000);
    } else {
      setTimeout(() => {
        instantCreateContainer(schedule, tryTimes - 1);
      }, 5000);
    }
  }
};

const schedule = {};

schedule.getASchedule = asyncWrap(async (req, res, next) => {
  let scheduleId = req.params.schedule_id;
  let userId = req.user.id;
  let schedule = await db.getDetailScheduleById(scheduleId);

  if (schedule.userId !== userId) throw new CdError(401, 'You don\'t have permission!');

  res.json(schedule);
});

schedule.get = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;

  let [schedules, historySchedules] = await Promise.all([
    db.getUserReservedSchedules(userId),
    db.getUserHistorySchedules(userId)]
  );
  res.json({
    schedules: schedules,
    historySchedules: historySchedules
  });
});

schedule.getHistory = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let schedules = await db.getUserHistorySchedules(userId);
  res.json({
    historySchedules: schedules
  });
});

schedule.getReserved = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let schedules = await db.getUserReservedSchedules(userId);
  res.json({
    schedules: schedules
  });
});

schedule.create = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let username = req.user.itriId;
  let startQuery = req.query.start || (req.body && req.body.start);
  let endQuery = req.query.end || (req.body && req.body.end);
  let imageIdQuery = req.query.image_id || (req.body && req.body.imageId);
  let customMachineId = req.query.machine_id || (req.body && req.body.machineId);
  let customGpu = req.query.gpu_type || (req.body && req.body.gpuType);
  let customGpuAmount = req.query.gpu_amount || (req.body && req.body.gpuAmount) || 1;

  if (!startQuery || !endQuery || !imageIdQuery) throw new CdError(401, 'Lack of parameter');

  let startDate = moment(startQuery);
  let endDate = moment(endQuery);

  if (!startDate.isValid() || !endDate.isValid()) throw new CdError(401, 'Wrong date format');

  startDate = startDate.startOf('day');
  endDate = endDate.endOf('day');

  if (startDate > endDate) throw new CdError(401, 'End date must greater then start date');
  else if (endDate < moment()) throw new CdError(401, 'End date must greater then now');
  else if (startDate < moment().startOf('day')) throw new CdError(401, 'Start date must greater then today');
  else if (moment(startDate).add(31, 'days') < endDate) throw new CdError(401, 'Period must smaller then 30 days');

  let start = startDate.format();
  let end = endDate.format();

  let timeOptions = {
    start: start,
    end: end
  };

  let machineOptions = {};
  if (!customMachineId) {
    if (customGpu) machineOptions.gpuType = customGpu;
    if (customGpuAmount) machineOptions.gpuAmount = customGpuAmount;
  }


  let [bookedSchedules, machines, images, overlapSchedules] =
    await Promise.all([
      db.getUserReservedSchedulesIds(userId),
      db.getAllMachineIds(machineOptions),
      db.getAllImageIds(),
      db.getAllRunningSchedules(start, end)
    ]);

  if (bookedSchedules.length > BOOKMAXIMUN) {
    throw new CdError(401, 'schedule reservations exceed maximum number');
  }

  if (!images.indexOf(imageIdQuery)) {
    throw new CdError(401, 'image not exist');
  }

  let machineSet = await new Set(
    machines.map(machine => machine.id)
  );

  let availableSet = await overlapSchedules.reduce((set, schedule) => {
    let machineId = schedule.machine.id;
    if (set.has(machineId)) set.delete(machineId);
    return set;
  }, machineSet);

  if (availableSet.size === 0) throw new CdError('401', 'No available machine');
  if (customMachineId && !availableSet.has(customMachineId)) throw new CdError('401', 'No specific machine or is occupied');

 // let username = `user${userId}`;
  let randomPassword = Math.random().toString(36).slice(-8);
  let machineArray = [...machineSet];

  let schedule = await Schedule.scope('detail').create({
    startedAt: start,
    endedAt: end,
    statusId: 1,
    machineId: customMachineId || machineArray[Math.floor(Math.random() * machineArray.length)],
    username: username,
    password: randomPassword,
    imageId: imageIdQuery,
    userId: userId,
    container: {
      serviceIp: undefined,
      podIp: undefined,
      sshPort: undefined
    },
  }, {
    include: [Container],
  });

  if (!schedule) throw new CdError(401, 'create fail');

  let resSchedule = await Schedule.scope('detail').findById(schedule.id);

  // 如果啟動時間是現在或之前的話立即啟動Container
  if (startDate <= moment()) {
    instantCreateContainer(resSchedule, 3);
  }
  
  return res.json(resSchedule);

});

schedule.update = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;
  let end = req.query.end || (req.body && req.body.end);

  if (!scheduleId) throw new CdError('401', 'without schedule id');

  let setting = {
    projectCode: req.query.project_code
  };

  let getScheduleById = id => Schedule.scope('detail').findOne({ where: { id: id } });

  let schedule = await getScheduleById(scheduleId);
  if (!schedule) throw new CdError('401', 'No such schedule');
  else if (schedule.userId !== userId) throw new CdError('401', 'Not owner');

  let machineId = schedule.machine.id;
  let oldStartDate = moment(schedule.startedAt);
  let oldEndDate = moment(schedule.endedAt);
  let extendableEndDate = moment.max(moment(oldStartDate), moment()).add(30, 'days').endOf('d');

  if (end) {
    let newEndedAt = moment(end);
    if (!newEndedAt.isValid()) throw new CdError(401, 'Date format error');
    else if (newEndedAt < moment()) throw new CdError(401, 'End date should greater then current date');
    else if (newEndedAt < oldStartDate) throw new CdError(401, 'End date should greater then start date');
    else if (newEndedAt > extendableEndDate) throw new CdError(401, 'End date exceeds quota');

    let schedules = await db.getScheduleByMachineId(
      machineId,
      oldEndDate.format(),
      newEndedAt.format());

    schedules = await schedules.filter((schedule) => {
      return schedule.id !== scheduleId;
    });
    if (schedules.length > 0) throw new CdError(401, 'Target period already used');
    setting.endedAt = newEndedAt.format();
  }

  let [affectedCount, affectedRows] = await Schedule.update(setting, {
    where: {
      id: scheduleId,
      userId: userId
    },
    returning: true,
    raw: true
  });

  if (affectedCount === 0) throw new CdError(401, 'Update schedule fail');

  let resSchedule = await Schedule.scope('detail').findById(affectedRows[0].id);

  res.json(resSchedule);

});

schedule.restart = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;

  if (!scheduleId) throw new CdError('401', 'Without schedule id');

  let schedule = await Schedule.scope('detail').findById(scheduleId);

  if (!schedule) throw new CdError(401, 'Schedule not exist');
  else if (schedule.userId !== userId) throw new CdError(401, 'Have no auth');
  else if (schedule.statusId === 1) throw new CdError(401, 'Schedule hasn\'t running');
  else if (schedule.statusId === 4 || schedule.statusId === 5) throw new CdError(401, 'Schedule have been deleted');
  else if (schedule.statusId === 6) throw new CdError(401, 'Schedule have been canceled');

  if (moment(schedule.startDate) <= moment() && moment(schedule.endDate) <= moment()) {
    await serverJob.deleteASchedule(schedule);
    await schedule.updateAttributes({
      statusId: 1
    });
    instantCreateContainer(schedule, 3);
  }

  res.json('restart');

});

schedule.delete = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;

  if (!scheduleId) throw new CdError('401', 'without schedule id');

  let schedule = await Schedule.scope('detail').findById(scheduleId);

  if (!schedule) throw new CdError(401, 'schedule not exist');
  else if (schedule.userId !== userId) throw new CdError(401, 'Not owner!');
  else if (schedule.statusId === 4 || schedule.statusId === 5) throw new CdError(401, 'Schedule have been deleted');
  else if (schedule.statusId === 6) throw new CdError(401, 'Schedule have been canceled');

  console.log(`delete schedule's status:${schedule.statusId}`);

  if (schedule.statusId === 2 || schedule.statusId === 3) {
    await serverJob.deleteASchedule(schedule);
  } else {
    await schedule.updateAttributes({ statusId: 6 });
  }

  res.json(schedule);

});


schedule.getExtendableDate = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;

  if (!scheduleId) throw new CdError('401', 'Eithout schedule id');

  let getScheduleById = id => Schedule.scope('normal').findOne({ where: { id: id } });

  let schedule = await getScheduleById(scheduleId);
  if (!schedule) throw new CdError('401', 'No such schedule');
  else if (schedule.userId !== userId) throw new CdError('401', 'Not owner');

  let machineId = schedule.machineId;
  let oldStartDate = moment(schedule.startedAt);
  let oldEndDate = moment(schedule.endedAt);
  let extendableEndDate = moment.max(oldStartDate, moment()).add(30, 'days').endOf('d');
 // let reducibleEndDate = moment.max(oldStartDate.add(1, 'days').startOf('day'),
  // moment().add(1, 'days').startOf('day'));
  let schedules = await db.getScheduleByMachineId(
    machineId,
    oldEndDate.format(),
    extendableEndDate.format());
  schedules = await schedules.filter((schedule) => {
    return schedule.id !== scheduleId;
  });
  let ended = await schedules.reduce((minDate, schedule) => {
    let maxableEndDate = moment(schedule.startedAt).subtract(1, 'days').endOf('day');
    return moment.min(minDate, maxableEndDate);
  }, extendableEndDate);

  extendableEndDate = moment.max([oldEndDate, ended]);
  res.json({
    // reducibleLatesDate: reducibleEndDate,
    extendableLatestDate: extendableEndDate
  });

});

export default schedule;

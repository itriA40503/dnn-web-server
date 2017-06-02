import express from 'express';
import moment from 'moment';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import paraChecker from '../../util/paraChecker';
import { sequelize, dnnUser as User, schedule as Schedule, instance as Instance, image as Image, machine as Machine } from '../../models';

const schedule = {};

schedule.get = asyncWrap(async (req, res, next) => {
  let mode = (req.query && req.query.mode) || 'all';
  let dateNow = moment();

  let where = {
    userId: req.user.id
  };

  let resJson = {
    schedules: [],
    historySchedules: []
  };

  if (mode === 'booked') {
    where.endedAt = {
      $gte: dateNow.format()
    };
    delete resJson.historySchedules;
  } else if (mode === 'history') {
    where.endedAt = {
      $lte: dateNow.format()
    };
    delete resJson.schedules;
  }

  let schedules = await Schedule.scope('detail').findAll({
    where: where
  });

  resJson = await schedules.reduce((json, schedule) => {
    if (schedule.endedAt <= dateNow) {
      json.historySchedules.push(schedule);
    } else {
      json.schedules.push(schedule);
    }
    return json;
  }, resJson);

  res.json(resJson);
  return;
});

schedule.create = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let startQuery = req.query.start || (req.body && req.body.start);
  let endQuery = req.query.end || (req.body && req.body.end);
  let imageIdQuery = req.query.image_id || (req.body && req.body.image_id) || 666;

  if (!startQuery || !endQuery) throw new CdError(401, 'lack of parameter');

  let startDate = moment(startQuery);
  let endDate = moment(endQuery);

  if (!startDate.isValid() || !endDate.isValid()) throw new CdError(401, 'wrong date format');

  startDate = startDate.startOf('day');
  endDate = endDate.endOf('day');

  if (startDate > endDate) throw new CdError(401, 'end date must greateeer then start date');
  else if (startDate < moment().endOf('day')) throw new CdError(401, 'start date must greater then today');
  else if (moment(startDate).add(31, 'days') < endDate) throw new CdError(401, 'period must smaller then 30 days');

  let getUserBookedSchedules = () => {
    return Schedule.findAll({
      where: {
        userId: req.user.id,
        endedAt: {
          $gte: new Date()
        }
      },
      attributes: ['id'],
      raw: true
    });
  };

  let getAllMachines = () => {
    return Machine.findAll({ attributes: ['id'], raw: true });
  };

  let getAllImages = () => {
    return Image.findAll({ attributes: ['id'], raw: true });
  };

  let getSchedulesOverlapPeriod = (start, end, other) => {
    let date = new Date();
    let options = {
      start: start,
      end: end
    };
    return Schedule.scope('normal', { method: ['timeOverlap', options] }).findAll(other);
  };

  let start = startDate.format();
  let end = endDate.format();

  let [bookedSchedules, machines, images, overlapSchedules] =
    await Promise.all([
      getUserBookedSchedules(),
      getAllMachines(),
      getAllImages(),
      getSchedulesOverlapPeriod(start, end)
    ]);

  if (bookedSchedules.length > 100) {
    throw new CdError('401', 'schedules exceed three');
  }

  if (!images.indexOf(imageIdQuery)) {
    throw new CdError(401, 'image not exist');
  }

  let machineSet = await new Set(
    machines.map(machine => machine.id)
  );

  let availableSet = await overlapSchedules.reduce((set, schedule) => {
    let machineId = schedule.instance.machine.id;
    if (set.has(machineId)) set.delete(machineId);
    return set;
  }, machineSet);

  if (availableSet.size === 0) {
    throw new CdError('401', 'no machine');
  }

  let username = `user${userId}`;
  let randomPassword = Math.random().toString(36).slice(-8);
  let machineArray = [...machineSet];

  let schedule = await Schedule.scope('detail').create({
    startedAt: start,
    endedAt: end,
    statusId: 1,
    instance: {
      machineId: machineArray[Math.floor(Math.random() * machineArray.length)],
      ip: '255.255.255.255',
      port: 55555,
      username: username,
      password: randomPassword,
      statusId: 1,
      imageId: imageIdQuery
    },
    userId: userId
  }, {
    include: [Instance.scope('detail')],
  });

  if (!schedule) throw new CdError(401, 'create fail');

  let resSchedule = await Schedule.scope('detail').findById(schedule.id);

  res.json(resSchedule);

});

schedule.update = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;

  if (!scheduleId) throw new CdError('401', 'without schedule id');

  let end = req.query.end || (req.body && req.body.end);

  let setting = {
    projectCode: req.query.project_code
  };

  let getScheduleById = id => Schedule.scope('normal').findOne({ where: { id: id } });
  let machineInPeriod = (start, end, machineId) => {
    let options = {
      start: start,
      end: end
    };
    return Schedule.scope('onlyTime',
      { method: ['timeOverlap', options] },
      { method: ['instanceScope', ['id', { method: ['whichMachine', machineId] }]] }
    );
  };

  let schedule = await getScheduleById(scheduleId);
  if (!schedule) throw new CdError('401', 'no such schedule');
  else if (schedule.userId !== userId) throw new CdError('401', 'not owner');

  let machineId = schedule.instance.machine.id;
  let oldStartDate = moment(schedule.startedAt);
  let oldEndDate = moment(schedule.endedAt);
  let extendableEndDate = moment.max(moment(oldStartDate), moment()).add(30, 'days');

  if (end) {
    let newEndedAt = moment(end);
    console.log(newEndedAt);
    if (!newEndedAt.isValid()) throw new CdError(401, 'date format error');
    else if (newEndedAt < moment()) throw new CdError(401, 'end date should greater then current date');
    else if (newEndedAt < oldStartDate) throw new CdError(401, 'end date should greater then start date');
    else if (newEndedAt > extendableEndDate) throw new CdError(401, 'end date exceeds quota');

    let schedules = await machineInPeriod(oldEndDate.format(), newEndedAt.format(), machineId)
      .findAll({
        where: {
          id: {
            $ne: scheduleId
          }
        }
      });
    console.log(schedules);
    if (schedules.length > 0) throw new CdError(401, 'extend period already used');
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

  if (affectedCount === 0) throw new CdError(401, 'update schedule fail');

  let resSchedule = await Schedule.scope('detail').findById(affectedRows[0].id);

  res.json(resSchedule);

});

schedule.delete = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;

  if (!scheduleId) throw new CdError('401', 'without schedule id');

  let schedule = await Schedule.scope('detail').findById(scheduleId);

  if (!schedule) throw new CdError(401, 'schedule not exist');
  else if (schedule.userId !== userId) throw new CdError(401, 'have no auth');

  let t = await sequelize.transaction();

  try {
    let instance = schedule.instance;
    await schedule.destroy({ transaction: t });
    await instance.destroy({ transaction: t });
    await t.commit();
    res.json('success');
  } catch (err) {
    t.rollback();
    throw err;
  }
});


schedule.getExtendableDate = asyncWrap(async (req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.params.schedule_id;

  if (!scheduleId) throw new CdError('401', 'without schedule id');

  let getScheduleById = id => Schedule.scope('normal').findOne({ where: { id: id } });
  let machineInPeriod = (start, end, machineId) => {
    let options = {
      start: start,
      end: end
    };
    return Schedule.scope('onlyTime',
      { method: ['timeOverlap', options] },
      { method: ['instanceScope', ['id', { method: ['whichMachine', machineId] }]] }
    );
  };

  let schedule = await getScheduleById(scheduleId);
  if (!schedule) throw new CdError('401', 'no such schedule');
  else if (schedule.userId !== userId) throw new CdError('401', 'not owner');

  let machineId = schedule.instance.machine.id;
  let oldStartDate = moment(schedule.startedAt);
  let oldEndDate = moment(schedule.endedAt);
  let extendableEndDate = moment.max(oldStartDate, moment()).add(30, 'days').endOf('d');
 // let reducibleEndDate = moment.max(oldStartDate.add(1, 'days').startOf('day'),
  // moment().add(1, 'days').startOf('day'));
  let schedules = await machineInPeriod(oldEndDate.format(),
    extendableEndDate.format(),
    machineId)
    .findAll({
      where: {
        id: {
          $ne: scheduleId
        }
      }
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

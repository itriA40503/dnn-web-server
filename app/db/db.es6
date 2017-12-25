import moment from 'moment';
import { availableRes as AvailableRes, dnnUser as User, schedule as Schedule, port as Port, machine as Machine, image as Image, resInfo as ResInfo } from '../models/index';

const sequelize = Schedule.sequelize;

/* Todo: put functions to models separately */

const db = {};

db.getSchedules = (options) => {
  let timeOptions = {
    start: options.start,
    end: options.end
  };
  return Schedule.scope('normal',
    { method: ['timeOverlap', timeOptions] })
    .findAll();
};

db.getDetailScheduleById = (id) => {
  return Schedule.scope(
    'detail',
  ).findById(id);
};


db.getDetailSchedules = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('detail',
    { method: ['timeOverlap', options] }
  ).findAll();
};

db.getUserReservedSchedulesIds = (userId) => {
  return Schedule.scope(
    'id',
    'thoseOccupiedSchedule',
    { method: ['byUser', userId] }
  ).findAll();
};

db.getUserReservedSchedules = (userId) => {
  return Schedule.scope(
    'detail',
    'thoseOccupiedSchedule',
    { method: ['byUser', userId] },
  ).findAll();
};

db.getUserHistorySchedules = (userId) => {
  return Schedule.scope(
    'detail',
    'thoseBeingAncient',
    { method: ['byUser', userId] },
  ).findAll();
};

db.getShouldStartSchedule = () => {
  return Schedule.scope(
    'detail',
    'thoseShouldStart'
  ).findAll();
};

db.getShouldUpdateSchedule = () => {
  return Schedule.scope(
    'detail',
    'thoseShouldUpdate'
  ).findAll();
};

db.getShouldExpireSchedules = () => {
  return Schedule.scope(
    'detail',
    'thoseWillExpire'
  ).findAll();
};

db.getAllOccupiedSchedules = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope(
    'detail',
    'thoseOccupiedSchedule',
    { method: ['timeOverlap', options] }
  ).findAll();
};

db.getMachineAllOccupiedSchedule = (machineId, now) => {
  let options = {
    start: now,
    end: now
  };
  return Schedule.scope(
    'detail',
    'thoseOccupiedSchedule',
    { method: ['timeOverlap', options] },
    { method: ['byMachine', machineId] }
  ).findAll();
};

db.getMachinesOccupiedSchedules = (machineId, start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope(
    'onlyTime',
    'thoseOccupiedSchedule',
    { method: ['timeOverlap', options] },
    { method: ['byMachine', machineId] }
  ).findAll();
};

db.getMachinesCurrentOccupiedSchedules = (machineId) => {
  let options = {
    start: moment().format(),
  };
  return Schedule.scope(
    'detail',
    'thoseOccupiedSchedule',
    { method: ['timeOverlap', options] },
    { method: ['byMachine', machineId] }
  ).findOne();
};

db.getMachineCurrentUseResouce = (resId) => {
  return Machine.scope(
    'normal',
    'thoseExist',
    { method: ['byResId', resId] }
  ).findAll();
};

db.destoryAllPortsBySchedule = (scheduleId) => {
  return Port.destroy({
    where: {
      containerId: scheduleId
    },
    force: true
  });
};

db.getMachineById = (id) => {
  return Machine.scope('normal').findById(id);
};

db.getAllExistMachines = () => {
  return Machine.scope('detail', 'thoseExist').findAll();
};

db.getExistMachineById = (id) => {
  return Machine.scope('normal',
    'thoseExist',
    ).findById(id);
};

db.getMachineByLabel = (label) => {
  return Machine.scope('normal',
    { method: ['byLabel', label] }
  ).findOne();
};

db.getExistMachineByLabel = (label) => {
  return Machine.scope('normal',
    'thoseExist',
    { method: ['byLabel', label] }
  ).findOne();
};

db.getAllMachineNormal = (options) => {
  return Machine.scope(
    'normal',
    'statusNormal'
  ).findAll({
    where: options
  });
};

db.getAllMachineIds = (options) => {
  return Machine.scope(
    'id',
    'statusNormal'
  ).findAll({
    where: options
  });
};

db.getAllImage = () => {
  return Image.findAll();
};

db.getAllImageIds = () => {
  return Image.scope('id').findAll();
};

db.getLatestImage = () => {         // simply add order num of createdAt group by name as 'sort'
  return Image.scope('latest').findAll();
};

db.getImageById = (id) => {
  return Image.findById(id);
};

db.getImageByIdOrDigest = (id) => {
  return Image.scope({ method: ['byIdOrDigest', id] }).findOne();
};

db.updateImage = (id, options) => {
  return Image.scope({ method: ['byIdOrDigest', id] })
    .update({
      where: options
    });
};

/* db.getUserBookedScheduleIds = (userId) => {
  return Schedule.scope('id').findAll({
    where: {
      userId: userId,
      endedAt: {
        $gte: new Date()
      }
    }
  });
}; */

/* db.findOrCreateImageTag = (imageTag) => {
  let [name, label] = imageTag.split(':');
  return Image.findOrCreate({
    where: {
      name: name,
      label: label
    }
  });
}; */

db.findOrCreateImageTag = (image) => {
  return Image.findOrCreate({
    where: {
      name: image.name,
      label: image.label
    },
    defaults: {
      digest: image.digest
    }
  });
};

db.getResourceInfo = () => {
  return ResInfo.scope('normal', 'notDelete').findAll();
};

db.findResourceInfoById = (id) => {
  return ResInfo.scope('normal', 'notDelete').findById(id);
};

db.getUserList = () => {
  return User.scope('detail', 'notDelete').findAll();
};

db.checkUserExistById = (userId) => {
  return User.findById(userId);
};


export default db;

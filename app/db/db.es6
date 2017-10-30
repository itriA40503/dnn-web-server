import moment from 'moment';
import { schedule as Schedule, machine as Machine, image as Image } from '../models/index';

const sequelize = Schedule.sequelize;

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
    'statusNormal',
    { method: ['user', userId] }
  ).findAll();
};

db.getUserReservedSchedules = (userId) => {
  return Schedule.scope(
    'detail',
    { method: ['user', userId] },
    'statusNormal'
  ).findAll();
};

db.getUserHistorySchedules = (userId) => {
  return Schedule.scope('detail',
    { method: ['user', userId] },
    'statusHistory'
  ).findAll();
};

db.getShouldStartSchedule = () => {
  return Schedule.scope(
    'detail',
    'statusShouldStart'
  ).findAll();
};

db.getShouldUpdateSchedule = () => {
  return Schedule.scope(
    'detail',
    'shouldUpdate'
  ).findAll();
};


db.getShouldEndSchedule = () => {
  return Schedule.scope(
    'detail',
    'shouldEnd'
  ).findAll();
};

db.getAllRunningSchedules = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope(
    'detail',
    'statusNormal',
    { method: ['timeOverlap', options] }
  ).findAll();
};

db.getScheduleByMachineId = (machineId, start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('onlyTime',
    'statusNormal',
    { method: ['timeOverlap', options] },
    { method: ['whichMachine', machineId] }
  ).findAll();
};

db.getMachineById = (id) => {
  return Machine.scope('normal').findById(id);
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

db.updateImage = (id, options) => {
  return Image.update(
    options,
    {
      where: {
        $or: [
          { id: id },
          { digest: id }
        ]
      }
    }
  );
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

db.findOrCreateImageTag = (imageTag) => {
  let [name, label] = imageTag.split(':');
  return Image.findOrCreate({
    where: {
      name: name,
      label: label
    }
  });
};

export default db;

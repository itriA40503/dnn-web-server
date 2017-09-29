import moment from 'moment';
import { schedule as Schedule, machine as Machine, image as Image } from '../models/index';

const sequelize = Schedule.sequelize;

const db = {};

db.getSchedules = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('normal', { method: ['timeOverlap', options] });
};

db.getDetailSchedules = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('detail', { method: ['timeOverlap', options] });
};

db.getShouldStartSchedule = () => {
  return Schedule.scope(
    'detail',
    'statusShouldStart').findAll();
};

db.getShouldUpdateSchedule = () => {
  return Schedule.scope(
    'detail',
    'shouldUpdate').findAll();
};


db.getShouldEndSchedule = () => {
  return Schedule.scope(
    'detail',
    'shouldEnd').findAll();
};

db.getAllRunningSchedules = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('detail', 'statusNormal', { method: ['timeOverlap', options] });
};

db.getUserBookedSchedule = (userId) => {
  return Schedule.scope(
      'id',
      'statusNormal',
      { method: ['user', userId] }
    );
};

db.getScheduleOfMachineId = (machineId, start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('onlyTime',
    'statusNormal',
    { method: ['timeOverlap', options] },
    { method: ['whichMachine', machineId] }
  );
};

db.getMachineById = (id) => {
  return Machine.scope('normal',
    { method: ['whichId', id] });
};

db.getAllMachineNormal = () => {
  return Machine.scope('normal', 'statusNormal');
};

db.getAllMachineIds = () => {
  return Machine.scope('id', 'statusNormal');
};

db.getAllMachineIdsWithGPU = (gpuType) => {
  return Machine.scope('id', 'statusNormal',
    { method: ['whichGpu', gpuType] });
};

db.getAllImageIds = () => {
  return Image.scope('id');
};

db.getLatestImage = () => {         // simply add order num of createdAt group by name as 'sort'
  return Image.scope('latest');
};


db.getUserBookedScheduleIds = (userId) => {
  return Schedule.scope('id').findAll({
    where: {
      userId: userId,
      endedAt: {
        $gte: new Date()
      }
    }
  });
};

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
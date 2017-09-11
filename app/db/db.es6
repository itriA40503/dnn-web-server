import { schedule as Schedule, machine as Machine, image as Image } from '../models';

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
    { method: ['instanceScope', [
      'id',
      { method: ['whichMachine', machineId] }]]
    }
  );
};

db.getAllMachineNormal = () => {
  return Machine.scope('normal');
};

db.getAllMachineIds = () => {
  return Machine.scope('id');
};

db.getAllMachineIdsWithGPU = (gpuType) => {
  return Machine.scope('id',
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

export default db;
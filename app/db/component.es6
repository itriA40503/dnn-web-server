import { schedule as Schedule, machine as Machine } from '../models';

let getTimeOverlapSchedules = (start, end, other) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('normal', { method: ['timeOverlap', options] }).findAll(other);
};

let getAllMachineIds = () => {
  return Machine.findAll({ attributes: ['id'], raw: true });
};

let getAllImageIds = () => {
  return Image.findAll({ attributes: ['id'], raw: true });
};

let getAllSchedules = (start, end, other) => {
  return Schedule.scope(
    'normal',
    { method: ['timeOverlap', { start: start, end: end }] }
  ).findAll(other);
};

let getUserBookedScheduleIds = (userId) => {
  return Schedule.scope('id').findAll({
    where: {
      userId: userId,
      endedAt: {
        $gte: new Date()
      }
    }
  });
};
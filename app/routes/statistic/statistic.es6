import moment from 'moment';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import db from '../../db/db';
import { sequelize, dnnUser as User, schedule as Schedule, instance as Instance, image as Image, machine as Machine } from '../../models/index';

const statisic = {};


let getAllScheduleDetail = () => {
  return Schedule.scope('detail').findAll();
};

let getAllImage = () => {
  return Image.scope('normal').findAll();
};

statisic.imageTotalUsed = asyncWrap(async (req, res, next) => {
  let schedules = await db.getDetailSchedules().findAll();
  let listMap = {};
  // 應該可以用sql command取代
  schedules.forEach((schedule) => {
    let imageName = schedule.image.name;
    if (!listMap[imageName]) listMap[imageName] = 0;
    listMap[imageName] += 1;
  });

  res.json(listMap);

});

export default statisic;

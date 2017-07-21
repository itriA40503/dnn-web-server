import moment from 'moment';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import { sequelize, dnnUser as User, schedule as Schedule, instance as Instance, image as Image, machine as Machine } from '../../models/index';

const statisic = {};


let getAllScheduleDetail = () => {
  return Schedule.scope('detail').findAll();
};

let getAllImage = () => {
  return Image.scope('normal').findAll();
}

statisic.image = asyncWrap(async (req, res, next) => {
  let schedules = await getAllScheduleDetail();

});
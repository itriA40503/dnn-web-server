import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import validator from 'validator';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sequelize, usageLog as UsageLog, availableRes as AvailableRes, transaction as Transaction } from '../../models/index';

momentDurationFormat(moment);

const resourceAPI = {};

const checkResourceExist = async (id) => {
  const res = await db.findResourceInfoById(id);
  if (!res) throw new CdError(401, 'Resource(id) not exist or has been deleted.');
  return res;
};

resourceAPI.get = asyncWrap(async (req, res, next) => {
  const user = req.user;
  const userAvailableRes = await db.getAvailableResByUserId(user.id);

  res.json(userAvailableRes);

});

resourceAPI.remind = asyncWrap(async (req, res, next) => {

  const user = req.user;
  const resId = (req.query && req.query.resId) || (req.body && req.body.resId);
  const amount = (req.query && req.query.amount) || (req.body && req.body.amount);  

  if (!resId) throw new CdError(401, 'resId not input');
  const resource = await checkResourceExist(resId);   
  
  if (!amount) throw new CdError(401, 'Amount not input');    
  if (!validator.isNumeric(amount)) throw new CdError(401, 'Amount is not a number');    

  const checkAvailable = await db.findAvailableResByUserIdAndResId(user.id, resId);

  if (!checkAvailable) {
    throw new CdError(401, 'User can not use this resource');
  } else {
    if (checkAvailable.amount < amount) throw new CdError(401, 'User can not use this amount');
  }

  const userTransValue = await db.getTransactionSumByUserId(user.id);  
  const userUsageValue = await db.getUsageSumByUserId(user.id);
  const values = resource.value * amount; 

  const unitValue = Math.floor((userTransValue + userUsageValue) / (values));
  
  if (unitValue === 0) throw new CdError(401, 'Point is not enough to use');

  const availableDays = moment.duration(unitValue, resource.valueUnit).format('d [days]');

  res.json(availableDays);  

});

resourceAPI.getCalendar = asyncWrap(async (req, res, next) => {

  const user = req.user;
  const resId = (req.query && req.query.resId) || (req.body && req.body.resId);
  const amount = (req.query && req.query.amount) || (req.body && req.body.amount);  

  if (!resId) throw new CdError(401, 'resId not input');
  const resource = await checkResourceExist(resId);   
  
  if (!amount) throw new CdError(401, 'Amount not input');    
  if (!validator.isNumeric(amount)) throw new CdError(401, 'Amount is not a number');    
  const checkAvailable = await db.findAvailableResByUserIdAndResId(user.id, resId);

  if (!checkAvailable) {
    throw new CdError(401, 'User can not use this resource');
  } else {
    if (checkAvailable.amount < amount) throw new CdError(401, 'User can not use this amount');
  }

  const userTransValue = await db.getTransactionSumByUserId(user.id);  
  const userUsageValue = await db.getUsageSumByUserId(user.id);
  const values = resource.value * amount; 

  const unitValue = Math.floor((userTransValue + userUsageValue) / (values));
  
  if (unitValue === 0) throw new CdError(401, 'Point is not enough to use');

  // availableDays
  const availableDays = moment.duration(unitValue, resource.valueUnit).format('d');
  const PERIOD = parseInt(availableDays, 10);
  /* let date = new Date();
  date.setHours(0, 0, 0, 0);*/

  const start = moment();
  const end = moment().add('d', PERIOD);
  
  const machineWhere = {
    resId: resId,
    gpuAmount: amount
  };  

  let [machines, schedules] = await Promise.all([
    db.getAllMachineNormal(machineWhere),
    db.getAllOccupiedSchedules(start.format(), end.format())
  ]);
  
  let machineSet = await machines.reduce((set, machine) => {
    set.add(machine.id);
    return set;
  }, new Set());
  console.log(machineSet);
  let calendar = await [...Array(PERIOD).keys()].map((i) => {

    let startedDate = moment(start).add('days', i); // new Date(date.getTime() + (1000 * 86400 * i));  
    let endedDate = moment(startedDate).endOf('days'); // new Date(startedDate.getTime() + (1000 * 86399));
    let usedSet = schedules.reduce((set, schedule) => {
      if (moment(schedule.startedAt) <= endedDate && moment(schedule.endedAt) >= startedDate) {
        set.add(schedule.machine.id);
      }
      return set;
    }, new Set());

    let availables = [...machineSet].filter(x => !usedSet.has(x));

    return {
      date: startedDate,
      available: availables,
      availableNum: availables.length
    };

  });

  res.json({ availableCalendar: calendar });

});

export default resourceAPI;

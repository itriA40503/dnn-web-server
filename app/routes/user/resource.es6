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

  const userTransValue = await db.getTransactionSumByUserId(user.id);  
  const userUsageValue = await db.getUsageSumByUserId(user.id);
  const values = resource.value * amount; 

  const unitValue = Math.floor((userTransValue + userUsageValue) / (values));
  
  if (unitValue === 0) throw new CdError(401, 'Point is not enough to use');

  const availableDays = moment.duration(unitValue, resource.valueUnit).format('d [days]');

  res.json(availableDays);
  

});

export default resourceAPI;

import moment from 'moment';
import validator from 'validator';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sequelize, availableRes as AvailableRes, transaction as Transaction } from '../../models/index';

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

  const userTransTotal = await db.getTransactionSumByUserId(user.id);

  if (!resId) throw new CdError(401, 'resId not input');
  const resource = await checkResourceExist(resId);   
  
  if (!amount) throw new CdError(401, 'Amount not input');    
  if (!validator.isNumeric(amount)) throw new CdError(401, 'Amount is not a number');    

  let values = resource.value * amount;

  res.json(userTransTotal);
  

});

export default resourceAPI;

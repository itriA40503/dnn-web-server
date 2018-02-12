import moment from 'moment';
import validator from 'validator';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sequelize, dnnUser as DnnUser, availableRes as AvailableRes, transaction as Transaction } from '../../models/index';
import { CheckAmount } from '../../util/Checker';

const userAPI = {};

userAPI.getUserList = asyncWrap(async (req, res, next) => {
  let currentUserList = await db.getUserList();
  res.json(currentUserList);
});

userAPI.getAvailableRes = asyncWrap(async (req, res, next) => {
  let userId = req.params.userId; 
  if (userId) {
    const user = await db.checkUserExistById(userId);
    if (!user) throw new CdError(401, 'the user not exist.');
  }

  const userAvailableRes = await db.getAvailableResByUserId(userId);

  res.json(userAvailableRes);

});

userAPI.createAvailableRes = asyncWrap(async (req, res, next) => {
  let userId = req.params.userId; 
  let amount = (req.query && req.query.amount) || (req.body && req.body.amount);
  let resId = (req.query && req.query.resId) || (req.body && req.body.resId);  
    
  if (userId) {
    const user = await db.checkUserExistById(userId);
    if (!user) throw new CdError(400, 'the user not exist.');
  }

  await CheckAmount(amount);
  
  if (resId) {
    const resource = await db.findResourceInfoById(resId);
    if (!resource) throw new CdError(400, 'the resource (id) not exist');
    const repeateRes = await db.findAvailableRes(userId, resId, amount);    
    if (repeateRes) throw new CdError(400, 'the number of resource has been set');
  } else {
    throw new CdError(400, 'the resource (id) not input', 40001);
  }
  let ResAttr = {
    userId,
    amount,
    resId
  };
  const newRes = await AvailableRes.create(ResAttr);
  res.json(newRes);
});

userAPI.modifyAvailableRes = asyncWrap(async (req, res, next) => {
  let userId = req.params.userId; 
  let resId = req.params.resId; // the user's availableRes ID
  let amount = (req.query && req.query.amount) || (req.body && req.body.amount);
  let newResId = (req.query && req.query.resId) || (req.body && req.body.resId);  
    
  let ResAttr = {};

  if (userId) {
    const user = await db.checkUserExistById(userId);
    if (!user) throw new CdError(400, 'the user not exist.');
  }  

  if (newResId) {
    const resource = await db.findResourceInfoById(newResId);
    if (!resource) throw new CdError(400, 'the update resource (id) not exist');
    ResAttr.resId = newResId;
  } else {
    throw new CdError(400, 'the resource (id) is not input', 40001);
  }

  if (!amount) throw new CdError(400, 'the amount of resource is not input', 40001);
  ResAttr.amount = amount;

  ResAttr.updateAt = moment().format();

  const getModifyRes = await AvailableRes.scope('notDelete').findById(resId);
  if (!getModifyRes) throw new CdError(400, 'the available resource (id) not exist or has been deleted');

  const repeateRes = await await db.findAvailableRes(userId, newResId, amount);
  if (repeateRes) throw new CdError(400, 'the number of resource has been exist');

  const updatedRes = await getModifyRes.updateAttributes(ResAttr);
  
  res.json(updatedRes);
});

userAPI.deleteAvailableRes = asyncWrap(async (req, res, next) => {
  let userId = req.params.userId; 
  let resId = req.params.resId; // the user's availableRes ID
  
  if (userId) {
    const user = await db.checkUserExistById(userId);
    if (!user) throw new CdError(401, 'the user not exist.');
  }

  const getModifyRes = await AvailableRes.findById(resId);
  if (!getModifyRes) throw new CdError(401, 'the available resource (id) not exist');  
  if (getModifyRes.deletedAt !== null) throw new CdError(401, 'the available resource has been deleted');  

  const deletedRes = await getModifyRes.updateAttributes({ deletedAt: moment().format() });
  
  res.json(deletedRes);

});

userAPI.createUser = asyncWrap(async (req, res, next) => {
  let itriId = (req.query && req.query.itriId) || (req.body && req.body.itriId);
  if (!itriId) throw new CdError(400, 'itriId not input.', 40001);
  itriId = itriId.toUpperCase();
  const userCheck = await DnnUser.scope({ method: ['byItriId', itriId] }).findOne();
  if (userCheck) throw new CdError(400, 'the user already exist.');

  const userAttr = {
    itriId
  };
  const user = await DnnUser.create(userAttr);

  res.json(user);

});

userAPI.createTrans = asyncWrap(async (req, res, next) => {
  const userId = req.params.userId;
  const addValue = (req.query && req.query.addValue) || (req.body && req.body.addValue);
  const info = (req.query && req.query.info) || (req.body && req.body.info) || 'add value';  

  if (userId) {
    const user = await db.checkUserExistById(userId);
    if (!user) throw new CdError(400, 'the user not exist.');
  }

  if (!addValue) {
    throw new CdError(400, 'the value not input.', 40001);
  } else {
    if (!validator.isNumeric(`${addValue}`)) throw new CdError(400, 'the value should be number.', 40002);
  }

  const transAttr = {
    userId,
    addValue,
    info
  };

  const newTransaction = await Transaction.create(transAttr);

  res.json(newTransaction);

});

export default userAPI;

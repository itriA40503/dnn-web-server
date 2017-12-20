import moment from 'moment';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sequelize, resInfo as ResInfo } from '../../models/index';
import validator from 'validator';

const resourceAPI = {};

const timeFormat = ['Y', 'M', 'D', 'h', 'm', 's'];

const checkResourceExist = async (id) => {
  let res = await db.findResourceInfoById(id);
  if (!res) throw new CdError(401, 'Resource(id) not exist!!');
  return res;
};

resourceAPI.createResource = asyncWrap(async (req, res, next) => {
  let gpuType = (req.query && req.query.gpuType) || (req.body && req.body.gpuType);
  let machineType = (req.query && req.query.machineType) || (req.body && req.body.machineType);
  let valueUnit = (req.query && req.query.valueUnit) || (req.body && req.body.valueUnit);
  let value = (req.query && req.query.value) || (req.body && req.body.value);
  
  if (!gpuType) throw new CdError(401, 'gpyType not input');
  if (!machineType) throw new CdError(401, 'machineType not input');
  if (!valueUnit) {
    throw new CdError(401, 'valueUnit not input');    
  } else {
    if (!timeFormat.find(elm => elm === valueUnit)) throw new CdError(401, 'valueUnit is worng, should be one of Y,M,D,h,m,s .');
  }

  if (!value) { 
    throw new CdError(401, 'value not input');
  } else {    
    if (!validator.isFloat(value)) throw new CdError(401, 'value is not a number(Integer, float)');
  }  

  let ResAttr = {
    gpuType,
    machineType,
    valueUnit,
    value: Number.parseFloat(value)
  };
  let resource = await ResInfo.scope('normal').create(ResAttr);
  res.json(resource);

});

resourceAPI.getResource = asyncWrap(async (req, res, next) => {
  let resources = await db.getResourceInfo();
  res.json(resources);
});

resourceAPI.updateResource = asyncWrap(async (req, res, next) => {
  let gpuType = (req.query && req.query.gpuType) || (req.body && req.body.gpuType);
  let machineType = (req.query && req.query.machineType) || (req.body && req.body.machineType);
  let valueUnit = (req.query && req.query.valueUnit) || (req.body && req.body.valueUnit);
  let value = (req.query && req.query.value) || (req.body && req.body.value);


  if (valueUnit) {
    if (!timeFormat.find(elm => elm === valueUnit)) throw new CdError(401, 'valueUnit is worng, should be one of Y,M,D,h,m,s .');
  }

  if (value) { 
    if (!validator.isFloat(value)) throw new CdError(401, 'value is not a number(Integer, float)');
  }

});

export default resourceAPI;

import moment from 'moment';
import validator from 'validator';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sequelize, resInfo as ResInfo } from '../../models/index';


const resourceAPI = {};

const timeFormat = ['y', 'years', 'M', 'months', 'w', 'weeks', 'd', 'days'];

const checkResourceExist = async (id) => {
  let res = await db.findResourceInfoById(id);
  if (!res) throw new CdError(401, 'Resource(id) not exist or has been deleted.');
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
    if (!timeFormat.find(elm => elm === valueUnit)) throw new CdError(401, 'valueUnit is worng, should be one of Y,M,w,d .');
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

resourceAPI.modifyResource = asyncWrap(async (req, res, next) => {
  let resId = req.params.resId;  
  let gpuType = (req.query && req.query.gpuType) || (req.body && req.body.gpuType);
  let machineType = (req.query && req.query.machineType) || (req.body && req.body.machineType);
  let valueUnit = (req.query && req.query.valueUnit) || (req.body && req.body.valueUnit);
  let value = (req.query && req.query.value) || (req.body && req.body.value);

  let updateAttr = {};

  if (!resId) throw new CdError(401, 'resId not input');

  if (gpuType) updateAttr.gpuType = gpuType;

  if (machineType) updateAttr.machineType = machineType;

  if (valueUnit) {
    if (!timeFormat.find(elm => elm === valueUnit)) throw new CdError(401, 'valueUnit is worng, should be one of Y,M,D,h,m,s .');
    updateAttr.valueUnit = valueUnit;
  }

  if (value) { 
    if (!validator.isFloat(value)) throw new CdError(401, 'value is not a number(Integer, float)');
    updateAttr.value = value;
  }

  let resource = await checkResourceExist(resId);

  let currentMachineUseThisResource = await db.getMachineCurrentUseResouce(resId);

  if (currentMachineUseThisResource.length > 0) throw new CdError(401, 'This resource has been used.');

  resource.updateAttributes(updateAttr);

  res.json(resource);
});

resourceAPI.deleteResource = asyncWrap(async (req, res, next) => {
  let resId = req.params.resId;
  
  if (!resId) throw new CdError(401, 'resId not input');
  
  let resource = await checkResourceExist(resId);

  resource.updateAttributes({ deletedAt: moment().format() });  

  res.json(resource);

});

export default resourceAPI;

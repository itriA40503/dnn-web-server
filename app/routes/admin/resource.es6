import moment from 'moment';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sequelize, resource as Resource } from '../../models/index';

let resourceAPI = {};

const timeFormat = ['Y', 'M', 'D', 'h', 'm', 's'];

resourceAPI.createResource = asyncWrap(async (req, res, next) => {
  let gpuType = (req.query && req.query.gpuType) || (req.body && req.body.gpuType);
  let machineType = (req.query && req.query.machineType) || (req.body && req.body.machineType);
  let valueUnit = (req.query && req.query.valueUnit) || (req.body && req.body.valueUnit) || 'DD';
  let value = (req.query && req.query.value) || (req.body && req.body.value) || 1;
  
  if (!gpuType) throw new CdError(401, 'gpyType not input');
  if (!machineType) throw new CdError(401, 'machineType not input');
  if (valueUnit) {
    if (!timeFormat.find(elm => elm === valueUnit)) throw new CdError(401, 'valueUnit is worng, should be one of \'Y\', \'M\', \'D\', \'h\', \'m\', \'s\'.');
  } else {
    throw new CdError(401, 'valueUnit not input');
  }
  if (Number.parseFloat(value) === 'NaN') throw new CdError(401, 'value is not a number(Integer or float)');

  let ResAttr = {
    gpuType,
    machineType,
    valueUnit,
    value
  };
  let resource = await Resource.scope('normal').create(ResAttr);
  res.json(resource);

});

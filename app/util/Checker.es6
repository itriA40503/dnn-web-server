import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import db from '../db/db';
import CdError from './CdError';

momentDurationFormat(moment);

/**
 * Check point is enough for user selected resource
 * @param {string} userId - Id of user
 * @param {string} values - value of resource
 * @return {integer} unitValue
 */
export const checkPoint = async (userId, values) => {

  const userTransValue = await db.getTransactionSumByUserId(userId);  
  const userUsageValue = await db.getUsageSumByUserId(userId);  

  const unitValue = Math.floor((userTransValue + userUsageValue) / (values));
  
  // console.log(userTransValue, userUsageValue, values, unitValue);

  if (unitValue === 0) throw new CdError(401, 'Point is not enough to use');

  return unitValue;
};

/**
 * Check Date range is enough.
 * @param {string} userId - Id of user
 * @param {string} values - value of resource
 * @param {string} valueUnit - unit of value
 * @param {moment} startDate - start of date
 * @param {moment} endDate - end of date
 * @return {object} queryDays&availableDays
 */
export const checkDateRange = async (userId, values, valueUnit, startDate, endDate) => {
  const unitValue = await checkPoint(userId, values);  
  // availableDays
  const availableDays = parseInt(moment.duration(unitValue, valueUnit).format('d'), 10);  
  const queryDays = startDate.diff(endDate, 'd') + 1;
  console.log(unitValue, valueUnit, availableDays, queryDays);
  if (queryDays > availableDays) throw new CdError('401', 'Date range too large (point not enough)');

  return { queryDays, availableDays };
};

/**
 * Check available resource
 * @param {integer} userId - user id
 * @param {integer} resId - resource id
 * @param {integer} amount - amount of resource
 */
export const checkAvailableResource = async (userId, resId, amount) => {  
  const checkAvailable = await db.findAvailableResByUserIdAndResId(userId, resId);

  if (!checkAvailable) {
    throw new CdError(401, 'User can not use this resource');
  } else {
    if (checkAvailable.amount < amount) throw new CdError(401, 'User can not use this amount');
  }  
};

/**
 * Get available days for the user
 * @param {integer} userId - user id
 * @param {resource} resource - resource
 * @param {integer} amount - amount of resource
 * @return {string} 
 */
export const getAvailableDays = async (userId, resource, amount) => {
  const userTransValue = await db.getTransactionSumByUserId(userId);  
  const userUsageValue = await db.getUsageSumByUserId(userId);
  const values = resource.value * amount; 

  const unitValue = Math.floor((userTransValue + userUsageValue) / (values));
  
  if (unitValue === 0) throw new CdError(401, 'Point is not enough to use');

  const availableDays = moment.duration(unitValue, resource.valueUnit).format('d');

  return availableDays;
};


import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import db from '../db/db';
import CdError from './CdError';

momentDurationFormat(moment);

export const checkPoint = async (userId, values) => {

  const userTransValue = await db.getTransactionSumByUserId(userId);  
  const userUsageValue = await db.getUsageSumByUserId(userId);  

  const unitValue = Math.floor((userTransValue + userUsageValue) / (values));
  
  // console.log(userTransValue, userUsageValue, values, unitValue);

  if (unitValue === 0) throw new CdError(401, 'Point is not enough to use');

  return unitValue;
};

export const checkDateRange = async (userId, values, valueUnit, startDate, endDate) => {
  const unitValue = await checkPoint(userId, values);  
  // availableDays
  const availableDays = parseInt(moment.duration(unitValue, valueUnit).format('d'), 10);  
  const queryDays = startDate.diff(endDate, 'd') + 1;
  console.log(unitValue, valueUnit, availableDays, queryDays);
  if (queryDays > availableDays) throw new CdError('401', 'Date range too large');

  return { queryDays, availableDays };
};

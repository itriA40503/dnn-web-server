import moment from 'moment';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { schedule as Schedule } from '../../models/index';

const schedule = {};

schedule.getAllSchedule = asyncWrap(async (req, res, next) => {
  let start = req.body.start || req.query.start;
  let end = req.body.end || req.query.end;
  let options = {};
  if (start && end) {
    let startDate = moment(start);
    let endDate = moment(end);

    console.log(endDate);
    if (!startDate.isValid() || !endDate.isValid()) throw new CdError(401, 'wrong date format');

    startDate = startDate.startOf('day');
    endDate = endDate.endOf('day');

    if (startDate > endDate) throw new CdError(401, 'end date must greater then start date');

    options = {
      start: startDate.format(),
      end: endDate.format()
    };
  }

  let schedules = await Schedule.scope(
    'normal',
    { method: ['timeOverlap', options] }
  ).findAll();

  res.json(schedules);
});

export default schedule;

import moment from 'moment';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import db from '../../db/db';
import serverJob from '../../queue/job';

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

  let schedules = await db.getSchedules(options);

  res.json(schedules);
});


/* for testing */
schedule.removeAll = asyncWrap(async (req, res, next) => {
  let result = await serverJob.removeAllSchedule();
  res.json(result);
});


export default schedule;

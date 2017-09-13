import db from '../../db/db';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import { report as Report } from '../../models';

const report = {};

export default asyncWrap((req, res, next) => {
  let userId = req.user.id;
  let scheduleId = req.query.schedule_id || (req.body && req.body.schedule_id);
  let description = req.query.description || (req.body && req.body.description);

  let report = Report.create({
    userId: userId,
    scheduleId: scheduleId,
    description: description
  });

  res.json(report);

});
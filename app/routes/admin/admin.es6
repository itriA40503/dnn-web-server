import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';

const admin = {};


admin.getAllSchedules = asyncWrap(async (req, res, next) => {
});

admin.updateSchedule = asyncWrap(async (req, res, next) => {
  let updateStatus = (req.body) && (req.body.status_id);
});

admin.deleteSchedule = asyncWrap(async (req, res, next) => {

});

import moment from 'moment';
import validator from 'validator';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';

const resourceAPI = {};

resourceAPI.get = asyncWrap(async (req, res, next) => {
  const user = req.user;
  const userAvailableRes = await db.getAvailableResByUserId(user.id);

  res.json(userAvailableRes);

});

export default resourceAPI;

import jwt from 'jwt-simple';
import asyncWrap from '../util/asyncWrap';
import CdError from '../util/CdError';
import { dnnUser as User } from '../models';

const sequelize = User.sequelize;

const jwtAuth = asyncWrap(async (req, res, next) => {
  let token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];

  if (!token) {
    throw new CdError(401, 'lack of access-token', 40100);
  }

  let decoded = jwt.decode(token, req.app.get('jwtsecretkey'));

  if (!decoded.expires || decoded.expires < ((new Date()).getTime() / 1000)) {
    throw new CdError(401, 'token expired', 40101);
  }

  let user = await User.findOne({
    where: {
      id: decoded.uid,
      itriId: decoded.itriId
    }
  });


  if (user) {
    req.user = user;
    next();
  } else {
    throw new CdError(401, 'cant find user', 40102);
  }

});

export default jwtAuth;

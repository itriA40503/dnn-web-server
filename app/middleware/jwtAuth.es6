import jwt from 'jwt-simple';
import CdError from '../util/CdError';
import { dnnUser as User } from '../models';

const sequelize = User.sequelize;

const jwtAuth = (req, res, next) => {
  let token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];

  if (!token) {
    throw new CdError(401, 'lack of access-token', 40100);
  }

  try {
    let decoded = jwt.decode(token, req.app.get('jwtsecretkey'));

    if (!decoded.expires || decoded.expires < ((new Date()).getTime() / 1000)) {
      throw new CdError(401, 'token expired', 40101);
    }

    User.findOne({
      where: {
        id: decoded.uid,
        itriId: decoded.itriId
      }
    })
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          throw new CdError(401,'cant find user', 40102);
        }
      })
      .catch((err) => {
        next(err);
      });

  } catch (err) {
    if (err instanceof CdError) {
      next(err);
    } else {
      throw new CdError(401, err.message, 40100);
    }
  }


};

export default jwtAuth;
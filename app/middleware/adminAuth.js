import asyncWrap from '../util/asyncWrap';
import CdError from '../util/CdError';


const adminAuth = asyncWrap((req, res, next) => {
  if (req.user && req.user.typeId === 2) {
    next();
  } else {
    throw CdError(401, 'Not enough authority!');
  }
});

export default adminAuth;
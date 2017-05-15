import express from 'express';
import jwt from 'jwt-simple';
import crypto from 'crypto';
import moment from 'moment';
import userSchedule from './user/schedule';
import LdapAuth from 'ldapauth-fork';
import jwtAuth from '../middleware/jwtAuth';
import CdError from '../util/CdError';
import paraChecker from '../util/paraChecker';
import { dnnUser as User, schedule as Schedule, instance as Instance, image as Image, machine as Machine } from '../models';

const sequelize = User.sequelize;

const router = express.Router();

router.get('/signin', (req, res, next) => {

  let username = (req.body && req.body.username) || (req.query && req.query.username) || req.headers['x-username'];
  let password = (req.body && req.body.password) || (req.query && req.query.password) || req.headers['x-password'];

  if (!(username && password)) throw new CdError(401, 'missing parameter', 40000);

  username = username.replace(/[^\w]+/g, '');
  password = password.replace(/[^\w]+/g, '');

  /*let ldapOptions = {
    url: 'ldap://itri.ds',
    bindDn: `CN=${username},CN=Users,DC=ITRI,DC=DS`,
    bindCredentials: `${password}`,
    searchBase: 'CN=Users,DC=ITRI,DC=DS',
    searchFilter: `(CN=${username})`
  };

  const ldapAuth = new LdapAuth(ldapOptions);
  ldapAuth.on('error', (err) => {
  });*/

  console.log();
  const afterLdapAuthSuccess = async (itriId) => {
    try {
      let [user, created] = await User.findOrCreate({
        where: { itriId: itriId },
        defaults: {
          salt: crypto.randomBytes(16).toString('hex')
        }
      });
      console.log(created);
      let token = jwt.encode({
        uid: user.id,
        itriId: user.itriId,
        expires: ((new Date()).getTime() / 1000) + ( 86400 * 100 )
      }, req.app.get('jwtsecretkey'));

      res.json({
        token: token
      });

    } catch (err) {
      next(err);
    }
    return;
  };

/*  ldapAuth.authenticate(username, password, (err, user) => {
    if (err) {
      next(new CdError(401, err.message, 12345));
      return;
    }
    afterLdapAuthSuccess(username);
    // res.json(user);
  });
  */
  afterLdapAuthSuccess(username);


});

router.use('/schedule', jwtAuth, userSchedule);

export default router;

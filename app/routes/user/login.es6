import jwt from 'jwt-simple';
import request from 'request-promise-native';
import crypto from 'crypto';
import moment from 'moment';
import LdapAuth from 'ldapauth-fork';
import k8sAPI from '../../k8s/k8sAPI';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import config from '../../config';
import { sequelize, dnnUser as User, schedule as Schedule, instance as Instance, image as Image, machine as Machine } from '../../models/index';

export default asyncWrap(async (req, res, next) => {
  let username = (req.body && req.body.username) || (req.query && req.query.username) || req.headers['x-username'];
  /* Todo: encrypt password between server and client */
  let password = (req.body && req.body.password) || (req.query && req.query.password) || req.headers['x-password'];

  if ((!username || !password)) throw new CdError(401, 'missing username or password', 40100);

  let reg = /^[A-Za-z0-9]+$/; // there's bug with g

  if (!reg.test(username)) throw new CdError(401, 'username or password format error', 40101);
  
  username = username.toUpperCase();
  
  // username = username.replace(/[^\w]+/g, '');
  // password = password.replace(/[^\w]+/g, '');

  let ldapOptions = {
    url: 'ldap://itri.ds',
    bindDn: `CN=${username},CN=Users,DC=ITRI,DC=DS`,
    bindCredentials: `${password}`,
    searchBase: 'CN=Users,DC=ITRI,DC=DS',
    searchFilter: `(CN=${username})`
  };

  const ldapAuth = new LdapAuth(ldapOptions);
  ldapAuth.on('error', (err) => {
  });

  const afterLdapAuthSuccess = async (itriId) => {
    try {
      let [user, created] = await User.scope('notDelete').findOrCreate({
        where: { itriId: itriId },
        defaults: {
          salt: crypto.randomBytes(16).toString('hex')
        }
      });

      /* Todo: add createdVolume column in user table to check whether or not to call the API  */
      k8sAPI.createUserVolumeUsingITRIID(itriId);

      let token = jwt.encode({
        uid: user.id,
        itriId: user.itriId,
        expires: ((new Date()).getTime() / 1000) + (86400 * 100),
        authority: user.typeId
      }, req.app.get('jwtsecretkey'));

      res.json({
        token: token,
        type: user.typeId
      });

    } catch (err) {
      next(err);
    }
    return;
  };


  const env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    afterLdapAuthSuccess(username);
  } else {
    ldapAuth.authenticate(username, password, (err, user) => {
      if (err) {
        next(new CdError(401, err.message, 401));
        return;
      }
      afterLdapAuthSuccess(username);
      // res.json(user);
    });
  }


});

import jwt from 'jwt-simple';
import request from 'request-promise-native';
import crypto from 'crypto';
import moment from 'moment';
import LdapAuth from 'ldapauth-fork';
import asyncWrap from '../../util/asyncWrap';
import CdError from '../../util/CdError';
import paraChecker from '../../util/paraChecker';
import { sequelize, dnnUser as User, schedule as Schedule, instance as Instance, image as Image, machine as Machine } from '../../models/index';

const kubeUrl = 'http://140.96.27.42:30554/kubeGpu';
const cVolumnAPI = `${kubeUrl}/volumn`;

export default asyncWrap(async (req, res, next) => {
  let username = (req.body && req.body.username) || (req.query && req.query.username) || req.headers['x-username'];
  let password = (req.body && req.body.password) || (req.query && req.query.password) || req.headers['x-password'];

  if ((!username || !password)) throw new CdError(401, 'missing username or password', 40100);

  let reg = /^[A-Za-z0-9]+$/; // there's bug with g

  if (!reg.test(username)) throw new CdError(401, 'username or password format error', 40101);

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
      let [user, created] = await User.findOrCreate({
        where: { itriId: itriId },
        defaults: {
          salt: crypto.randomBytes(16).toString('hex')
        }
      });
      console.log(created);

      let options = {
        method: 'POST',
        url: cVolumnAPI,
        body: {
          account: itriId
        },
        timeout: 5000,
        json: true,
        resolveWithFullResponse: true
      };
      request(options);
      let token = jwt.encode({
        uid: user.id,
        itriId: user.itriId,
        expires: ((new Date()).getTime() / 1000) + (86400 * 100),
        authority: user.typeId
      }, req.app.get('jwtsecretkey'));

      res.json({
        token: token
      });

    } catch (err) {
      next(err);
    }
    return;
  };

  /* ldapAuth.authenticate(username, password, (err, user) => {
    if (err) {
      next(new CdError(401, err.message, 12345));
      return;
    }
    afterLdapAuthSuccess(username);
    // res.json(user);
  });*/
  afterLdapAuthSuccess(username);

});

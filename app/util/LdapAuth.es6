import assert from 'assert';
import ldap from 'ldapjs';
import bcrypt from 'bcryptjs';

class LdapAuth {
  constructor(options) {
    this.options = Object.assign({},
      {
        searchScope: 'sub',
        bindProperty: 'dn',
        groupSearchScope: 'sub',
        groupDnProperty: 'dn'
      },
      options
      );

    this.ldapClientOptions = {
      url: this.options.url,
      connectTimeout: this.options.connectTimeout,
      timeout: this.options.timeout,
      idleTimeout: this.options.idleTimeout,
      queueDisable: this.options.queueDisable,
      tlsOptions: this.options.tlsOptions,
      bindDn: this.options.bindDn,
      bindCredentials: this.options.bindCredentials,
      reconnect: this.options.reconnect
    };
    this.mLdapClient = ldap.createClient(this.ldapClientOptions);
    this.mSalt = bcrypt.genSaltSync();
  }
  close(callback) {
    return new Promise((resolve, reject) => {
      this.mLdapClient.unbind((err) => {
        reject(err);
      });
    });

  }
}
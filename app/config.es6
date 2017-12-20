const config = {
  development: {
    server: {
      httpPort: '80',
      httpsPort: '443'
    },
    database: {
      host: process.env.DNNDB_HOST || '13.115.57.99',
      port: process.env.DNNDB_PORT || '5432',
      dialect: 'postgres',
      db: process.env.DNNDB_DBNAME || 'dnn',
      username: process.env.DNNDB_USERNAME || 'postgres',
      password: process.env.DNNDB_PASS || 'cditripost',
      timeZone: '+08:00',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false
    },
    kuber: {
      url: process.env.K8S_API || 'http://100.86.2.12:30554/kubeGpu'
    },
    mailer: {
      smtpSetting: {
        host: process.env.MAIL_SERVER_HOST || 'smtpx.itri.org.tw',
        port: process.env.MAIL_SERVER_PORT || 25,
        auth: {
          user: process.env.MAIL_SERVER_USERNAME || '533022',
          pass: process.env.MAIL_SERVER_PASS || '022passw'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      alarmMailOptions: {
        from: 'kevin7674@itri.org.tw',
        to: 'bakaking@itri.org.tw',
        subject: 'alarm',
        text: 'alarm text'
      },
      kue: {
        prefix: 'q',
        redis: {
          port: process.env.KUE_PORT || 6379,
          host: process.env.KUE_HOST || 'localhost',
          auth: 'password',
          options: {
          }
        }
      }
    }
  },
  production: {
    server: {
      httpPort: '80',
      httpsPort: '443'
    },
    database: {
      host: process.env.DNNDB_HOST || '13.115.57.99',
      port: process.env.DNNDB_PORT || '5432',
      dialect: 'postgres',
      db: process.env.DNNDB_DBNAME || 'dnn',
      username: process.env.DNNDB_USERNAME || 'postgres',
      password: process.env.DNNDB_PASS || 'cditripost',
      timeZone: '+08:00',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false
    },
    kuber: {
      url: process.env.k8S_API || 'http://100.86.2.12:30554/kubeGpu'
    },
    mailer: {
      smtpSetting: {
        host: process.env.MAIL_SERVER_HOST || 'smtpx.itri.org.tw',
        port: process.env.MAIL_SERVER_PORT || 25,
        auth: {
          user: process.env.MAIL_SERVER_USERNAME || '533022',
          pass: process.env.MAIL_SERVER_PASS || '022passw'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      alarmMailOptions: {
        from: 'kevin7674@itri.org.tw',
        to: 'bakaking@itri.org.tw',
        subject: 'alarm',
        text: 'alarm text'
      },
      kue: {
        prefix: 'q',
        redis: {
          port: process.env.KUE_PORT || 6379,
          host: process.env.KUE_HOST || 'localhost',
          auth: 'password',
          options: {
          }
        }
      }
    }
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];

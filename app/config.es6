const config = {
  development: {
    server: {
      httpPort: '80',
      httpsPort: '443'
    },
    database: {
      host: '13.115.57.99',
      port: '5432',
      dialect: 'postgres',
      db: 'dnn',
      username: 'postgres',
      password: 'cditripost',
      timeZone: '+08:00',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: true
    },
    kuber: {
      url: 'http://100.86.2.12:30554/kubeGpu'
    },
    mailer: {
      smtpSetting: {
        host: 'localhost',
        port: 25,
        auth: {
          user: 'admin',
          pass: 'pass'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      alarmMailOptions: {
        from: 'kaban@japaripark.com',
        to: 'bakaking@iri.org.tw',
        subject: 'alarm',
        text: 'alarm text'
      }
    }
  },
  production: {
    server: {
      httpPort: '80',
      httpsPort: '443'
    },
    database: {
      host: '13.115.57.99',
      port: '5432',
      dialect: 'postgres',
      db: 'dnn',
      username: 'postgres',
      password: 'cditripost',
      timeZone: '+08:00',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: true
    },
    kuber: {
      url: 'http://100.86.2.12:30554/kubeGpu'
    },
    mailer: {
      smtpSetting: {
        host: 'localhost',
        port: 25,
        auth: {
          user: 'admin',
          pass: 'pass'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      alarmMailOptions: {
        from: 'kaban@japaripark.com',
        to: 'bakaking@iri.org.tw',
        subject: 'alarm',
        text: 'alarm text'
      }
    }
  }
};

module.exports = config;

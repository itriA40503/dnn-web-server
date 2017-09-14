const config = {
  development: {
    server: {
      httpPort: '80',
      httpsPort: '443'
    },
    database: {
      host: '54.238.152.54',
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
    }
  },
  production: {
    server: {
      httpPort: '80',
      httpsPort: '443'
    },
    database: {
      host: '54.238.152.54',
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
    }
  }
};

module.exports = config;

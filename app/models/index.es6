import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env].database;

dbConfig.host = process.env.DNNSQL_HOSTNAME || dbConfig.host;

const sequelize = new Sequelize(dbConfig.db, dbConfig.username, dbConfig.password, dbConfig);
const db = {};

sequelize
  .authenticate()
  .then((err) => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js' && file !== 'index.es6');
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    console.log(model);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

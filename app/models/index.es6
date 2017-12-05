import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';

const dbConfig = config.database;

// dbConfig.host = process.env.DNNDB_HOST || dbConfig.host;

const sequelize = new Sequelize(dbConfig.db, dbConfig.username, dbConfig.password, dbConfig);
const db = {};
/* Connect to database */
sequelize
  .authenticate()
  .then((err) => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
/* Import models */
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js' && file !== 'index.es6');
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    console.log(`Import model: ${model.name}`);
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

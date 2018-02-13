import userR from './user'; // will into index.es6 in /user folder if there is no user.js
import imageR from './image';
import machineR from './machine';
import scheduleR from './schedule';
import adminR from './admin';
import statisticR from './statistic';

export default (app) => {
  app.use('/', userR);
  // app.use('/', scheduleR);
  app.use('/', machineR);
  app.use('/', imageR);
  app.use('/', adminR);
  // app.use('/', statisticR);
};

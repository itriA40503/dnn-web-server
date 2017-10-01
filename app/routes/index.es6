import userR from './user'; // will into index.es6 in /user folder if there is no user.js
import imageR from './image';
import machineR from './machine';
import scheduleR from './schedule';
import adminR from './admin';
import statisticR from './statistic';

export default (app) => {
  app.use('/user', userR);
  app.use('/schedule', scheduleR);
  app.use('/machine', machineR);
  app.use('/image', imageR);
  app.use('/admin', adminR);
  app.use('/statistic', statisticR);
};

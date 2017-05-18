import userR from './user';
import imageR from './image';
import machineR from './machine';
import scheduleR from './schedule';


export default (app) => {
  app.use('/user', userR);
  app.use('/schedule', scheduleR);
  app.use('/machine', machineR);
  app.use('/image', imageR);
};
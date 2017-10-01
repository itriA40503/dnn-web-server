import moment from 'moment';
import kue from 'kue';
import debug from 'debug';
import db from '../db/db';
import kuberAPI from '../k8s/k8sAPI';
import K8SError from '../util/K8SError';
import { schedule as Schedule, container as Container, machine as Machine, image as Image, port as Port } from '../models/index';

const TIME_START_SCHEDULES = 'time start schedules';
const TIME_UPDATE_SCHEDULES = 'time udpate schedules';
const TIME_DELETE_SCHEDULES = 'time delete schedules';
const START_A_SCHEDULE = 'start a schedule';
const UPDATE_A_SCHEDULE = 'update a schedule';
const DELETE_A_SCHEDULE = 'delete a schedule';

/* Jobs should be call in queue not in routers
   PM2 should use gracefulReload for kue.js when restart server */

const queue = kue.createQueue();

const serverJob = {};

serverJob.startASchedule = async (schedule) => {

  try {
    await schedule.updateAttributes({ statusId: 8 });
    let scheduleP = await schedule.get({ plain: true });
    let response = await kuberAPI.createContainerUsingSchedule(scheduleP);
    let pod = response.body[0];
    let service = response.body[1];
    let ports = service.spec.ports.map((port) => {
      let newPort = Object.assign({}, port);
      newPort.containerId = schedule.container.id;
      return newPort;
    });
    let portN = Port.bulkCreate(ports);
    await schedule.updateAttributes({ statusId: 2 });
    return true;
  } catch (err) {
    if (err instanceof K8SError) {
      schedule.updateAttributes({ statusId: 7 });
    }
    console.log(err.message);
  }
  return false;
};

serverJob.updateASchedule = async (schedule) => {

  try {
    let scheduleP = await schedule.get({ plain: true });
    let response = await kuberAPI.updateContainerUsingSchedule(scheduleP);
    let pod = response.body[0];
    let service = response.body[1];
    if (pod.status.phase !== 'Running') {
      // 這裡加入判斷有沒有超過五分鐘沒有更新
      if (moment(schedule.startedAt) > moment().add(5, 'minute')) {
        schedule.updateAttributes({
          statusId: 7
        });
      }
      return false;
    }
    let containerN = await schedule.container.updateAttributes({
      podIp: pod.status.hostIP,
      sshPort: service.spec.ports[0].nodePort
    });
    if (!containerN) return false;
    await schedule.updateAttributes({ statusId: 3 });
    return true;
  } catch (err) {
    console.log(err.message);
  }
  return false;
};


serverJob.deleteASchedule = async (schedule) => {
  try {
    await schedule.updateAttributes({ statusId: 4 });
    let scheduleP = await schedule.get({ plain: true });
    let response = await kuberAPI.deleteContainerFromSchedule(scheduleP);
    await schedule.updateAttributes({
      statusId: 5,
      endedAt: moment().format()    // 以後改用deletedAt然後model不check deletedAt
    });
    return true;
  } catch (err) {
    console.log(err.message);
  }
  return false;
};


serverJob.terminalASchedule = async (schedule) => {
  try {
    let scheduleP = await schedule.get({ plain: true });
    let response = kuberAPI.deleteContainerFromSchedule(scheduleP);
    await schedule.updateAttributes({
      statusId: 9
    });
    return true;
  } catch (err) {
    console.log(err.message);
  }
  return false;
};


serverJob.startSchedules = async () => {
  console.log('Cron Start Schedules');
  let schedules = await db.getShouldStartSchedule();
  await Promise.all(schedules.map(this.startASchedule));
};


serverJob.updateSchedules = async () => {
  debug('Cron Update Schedules');
  let schedules = await db.getShouldUpdateSchedule();
  await Promise.all(schedules.map(this.updateASchedule));
};

serverJob.terminateSchedules = async () => {
  debug('Cron terminal Schedules');
  let schedules = await db.getShouldEndSchedule();
  console.log(schedules);
  let containersUpdate = schedules.map((schedule) => {
    if (schedule.statusId === 2 || schedule.statusId === 3) {
      this.terminalASchedule(schedule);
    } else if (schedule.statusId === 1 || schedule.statusId === 7) {
      schedule.updateAttributes({ statusId: 9 });
    }
    return true;
  });
};

serverJob.removeAllSchedule = async () => {
  try {
    let response = kuberAPI.removeAllContainers();

    await Port.destroy({
      force: true,
      where: {}
    });
    await Container.destroy({
      force: true,
      where: {}
    });

    await Schedule.destroy({
      force: true,
      where: {}
    });
    return true;
  } catch (err) {
    console.log(`${err.message}`);
  }
  return false;
};

serverJob.updateImageList = async () => {
  try {
    let response = kuberAPI.getAllImages();
    let images = response.body.images;
    images.map(db.findOrCreateImageTag);
    return true;
  } catch (err) {
    console.log(err.message);
  }
  return false;
};

const queueInit = () => {
  queue.process(START_A_SCHEDULE, (job, done) => {
    let result = serverJob.startASchedule(job.data);
    if (!result) done(new Error('queue start schedule error'));
    done();

  });
  queue.process(UPDATE_A_SCHEDULE, (job, done) => {
    let result = serverJob.updateASchedule(job.data);
    if (!result) done(new Error('queue start schedule error'));
    done();
  });
  queue.process(DELETE_A_SCHEDULE, (job, done) => {
    let result = serverJob.deleteASchedule(job.data);
    if (!result) done(new Error('queue start schedule error'));
    done();
  });
};


export default serverJob;

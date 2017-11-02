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

/* In future
   Jobs should be call in queue not in routers
   PM2 should use gracefulReload for kue.js when restart server */

// const queue = kue.createQueue();

const serverJob = {};

serverJob.startASchedule = async (schedule) => {
  console.log(`Start schedule:${schedule.id} Machine:${schedule.machine.id}`);
  try {
    if ([1, 2, 3, 7].includes(schedule.statusId)) {
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
      await db.destoryAllPortsBySchedule(schedule.id);
      schedule.updateAttributes({ statusId: 2 });
      schedule.container.updateAttributes({
        createdAt: moment().format()
      });
      Port.bulkCreate(ports);
    } else {
      throw new Error('This kind schedules are not able to be started!');
    }
    return true;
  } catch (err) {
    console.log(err.message);
    schedule.updateAttributes({ statusId: 7 });
  }
  return false;
};

serverJob.updateASchedule = async (schedule) => {
  console.log(`Update schedule:${schedule.id} Machine:${schedule.machine.id}`);
  try {
    if ([2, 3].includes(schedule.statusId)) {
      let scheduleP = await schedule.get({ plain: true });
      let response = await kuberAPI.updateContainerUsingSchedule(scheduleP);
      let pod = response.body[0];
      let service = response.body[1];
      let phase = pod.status.phase;
      let reason = (pod.status.containerStatuses
        && pod.status.containerStatuses.state
        && pod.status.containerStatuses.state.reason);
      if (phase === 'Pending') {
        /* if (reason !== 'ContainerCreating' ) {
          throw new K8SError(reason);
        } */
        if (moment(schedule.container.createdAt).add('m', 5) < moment().format()) {
          throw new K8SError('timeout');
        }
        return false;
      } else if (phase !== 'Running') {
        throw new K8SError(phase);
      }
      let updateAttr = {
        podIp: pod.status.hostIP,
        sshPort: service.spec.ports[0].nodePort,
        phase: phase
      };
      schedule.container.updateAttributes(updateAttr);
      schedule.updateAttributes({ statusId: 3 });

    } else {
      throw new Error('This kind schedules are not necessary to be updated!');
    }
    return true;

  } catch (err) {
    console.log(err.message);
    if (err instanceof K8SError) {
      schedule.container.updateAttributes({
        message: err.message
      });
      schedule.updateAttributes({ statusId: 7 });
    }
  }
  return false;
};

serverJob.deleteASchedule = async (schedule, isExpired) => {
  console.log(`delete schedule:${schedule.id} Machine:${schedule.machine.id}`);
  try {
    let scheduleP = await schedule.get({ plain: true });
    if (schedule.statusId === 2 || schedule.statusId === 3) {
      await schedule.updateAttributes({ statusId: 4 });
      let response = await kuberAPI.deleteContainerFromSchedule(scheduleP);
    } else if (schedule.statusId !== 1 && schedule.statusId !== 7 && schedule.statusId !== 8) {
      throw new Error('This kind schedule can\'t be delete manually');
    }

    let updateAttr = { statusId: 5 };
    let deleteAtType = (schedule.statusId === 1) ? 'canceledAt' : 'deletedAt';
    deleteAtType = (isExpired) ? 'expiredAt' : deleteAtType;
    updateAttr[deleteAtType] = moment().format();
    await schedule.updateAttributes(updateAttr);

    if (schedule.statusId === 7 || schedule.statusId === 8) {
      kuberAPI.deleteContainerFromSchedule(scheduleP);
    }

    return true;
  } catch (err) {
    console.log(err.message);
    if (err instanceof K8SError) {
      schedule.updateAttributes({
        statusId: 10,
        deletedAt: moment().format()
      });
    }
  }
  return false;
};

serverJob.startSchedules = async () => {
  console.log('Cron Start Schedules');
  let schedules = await db.getShouldStartSchedule();
  await Promise.all(schedules.map(serverJob.startASchedule));
};


serverJob.updateSchedules = async () => {
  console.log('Cron Update Schedules');
  let schedules = await db.getShouldUpdateSchedule();
  await Promise.all(schedules.map(serverJob.updateASchedule));
};

serverJob.expireSchedules = async () => {
  console.log('Cron expire Schedules');
  let schedules = await db.getShouldExpireSchedules();
  await Promise.all(
    schedules.map(schedule => serverJob.deleteASchedule(schedule, true))
  );
};

serverJob.removeAllSchedule = async () => {
  try {
    let response = await kuberAPI.removeAllContainers();

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
    console.log(err.message);
  }
  return false;
};

serverJob.updateImageList = async () => {
  try {
    let response = await kuberAPI.getAllImages();
    let images = response.body.images;
    images.map(db.findOrCreateImageTag);
    return true;
  } catch (err) {
    console.log(err.message);
  }
  return false;
};

/* const queueInit = () => {
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
};  */


export default serverJob;

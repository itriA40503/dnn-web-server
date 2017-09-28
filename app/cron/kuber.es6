import request from 'request-promise-native';
import moment from 'moment';
import Debug from 'debug';
import asyncWrap from '../util/asyncWrap';
import db from '../db/db';
import config from '../config';
import { schedule as Schedule, container as Container, machine as Machine, image as Image, port as Port } from '../models/index';

const debug = Debug('kuber-api');
const kubeConfig = config.kuber;
const kubeUrl = kubeConfig.url;
// const kubeUrl2 = ' http://140.96.27.42:30554/kubeGpu';
const conAPI = `${kubeUrl}/container`;
const consAPI = `${kubeUrl}/containers`;
const imageAPI = `${kubeUrl}/image`;
const imagesAPI = `${kubeUrl}/images`;

const createContainerUsingSchedule = async (schedule) => {
  try {

    let scheduleP = await schedule.get({ plain: true });
    let options = {
      method: 'POST',
      url: conAPI,
      body: {
        machineId: scheduleP.machine.label,
        gpuType: scheduleP.machine.gpuType,
        imgTag: `${scheduleP.image.name}:${scheduleP.image.label}`,
        account: schedule.username,
        pwd: schedule.password
      },
      timeout: 5000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    return response;
  } catch (err) {
    console.log(`schedule${schedule.id}: create fail with kubernetes`);
    console.log(`${err.message}`);
    /* 這裡寄信 */
  }
  return false;
};

const startASchedule = async (schedule) => {
  await schedule.updateAttributes({ statusId: 8 });
  let response = await createContainerUsingSchedule(schedule);
  if (!response || response.statusCode !== 200) {
    schedule.updateAttributes({ statusId: 7 });
    return false;
  }
  try {
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
    console.log('Error when save schedule update');
  }
  return false;
};

const updateContainerUsingSchedule = async (schedule) => {
  try {
    let scheduleP = await schedule.get({ plain: true });
    let options = {
      method: 'GET',
      url: `${conAPI}/${scheduleP.machine.label}`,
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    return response;
  } catch (err) {
    console.log(`schedule${schedule.id}: update fail with kubernetes`);
  }
  return false;
};

const updateASchedule = async (schedule) => {
  let response = await updateContainerUsingSchedule(schedule);
  if (!response || response.statusCode !== 200) return false;
  try {
    let pod = response.body[0];
    let service = response.body[1];
    if (pod.status.phase !== 'Running') return false;

    let containerN = await schedule.container.updateAttributes({
      podIp: pod.status.hostIP,
      sshPort: service.spec.ports[0].nodePort
    });
    if (!containerN) return false;
    await schedule.updateAttributes({ statusId: 3 });
    return true;
  } catch (err) {
    console.log('Error when save schedule update');
  }
  return false;
};

const deleteContainerFromSchedule = async (schedule) => {
  try {
    let scheduleP = await schedule.get({ plain: true });
    let options = {
      method: 'DELETE',
      url: `${conAPI}/${scheduleP.machine.label}`,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    return response;

  } catch (err) {
    console.log(`schedule${schedule.id}: delete fail with kubernetes`);
    console.log(`${err.message}`);
  }
  return false;
};

const deleteASchedule = async (schedule) => {
  let response = await deleteContainerFromSchedule(schedule);
  if (!response || response.statusCode !== 200) return false;
  try {
    await schedule.updateAttributes({
      statusId: 5,
      endedAt: moment().format()
    });
    return true;
  } catch (err) {
    console.log('Error when save schedule update');
  }
  return false;
};

const terminalASchedule = async (schedule) => {
  let response = deleteContainerFromSchedule(schedule);
  if (!response || response.statusCode !== 200) return false;
  try {
    await schedule.updateAttributes({
      statusId: 9
    });
    return true;
  } catch (err) {
    console.log('Error when save schedule update');
  }
  return false;
};

const removeAllContainers = async () => {
  try {
    let options = {
      method: 'DELETE',
      url: consAPI,
      resolveWithFullResponse: true
    };
    let response = await request(options);
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

const startSchedules = async () => {
  console.log('Cron Start Schedules');
  let timeOptions = {
    start: moment().format()
  };
  let schedules = await db.getShouldStartSchedule.findAll(timeOptions);
  schedules.map(startASchedule);
};


const updateSchedules = async () => {
  debug('Cron Update Schedules');
  let schedules = await Schedule.scope(
    'detail',
    { method: ['scheduleStatusWhere', 2] }
  ).findAll();
  schedules.map(updateASchedule);
};

const terminateSchedules = async () => {
  debug('Cron terminal Schedules');
  let schedules = await db.getShouldEndSchedule().findAll();

  let containersUpdate = schedules.map((schedule) => {
    if (schedule.statusId === 2 || schedule.statusId === 3) {
      terminalASchedule(schedule);
    } else if (schedule.statusId === 1 || schedule.statusId === 7) {
      schedule.updateAttributes({ statusId: 9 });
    }
    return true;
  });
};


const handleAnImageTag = async (imageTag) => {
  debug('Find or Create Image Tag');
  let [name, label] = imageTag.split(':');
  let [image, created] = await Image.findOrCreate({
    where: {
      name: name,
      label: label
    }
  });
  return image;
};

const getAllImages = async () => {
  debug('Get All Images\' tags from repository');
  try {
    let options = {
      method: 'GET',
      url: imagesAPI,
      timeout: 5000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    let images = response.body.images;
    images.map(handleAnImageTag);
    return true;

  } catch (err) {
    console.log('Get image tags from repository fail');
    console.log(`${err.message}`);
  }
  return false;
};

export { startASchedule,
  updateASchedule,
  deleteASchedule,
  removeAllContainers,
  startSchedules,
  updateSchedules,
  terminateSchedules,
  getAllImages
};

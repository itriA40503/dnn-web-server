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

const createContainerFromSchedule = async (schedule) => {
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
   // if (response.statusCode === 200) {
    let pod = response.body[0];
    let service = response.body[1];
    let ports = service.spec.ports.map((port) => {
      let newPort = Object.assign({}, port);
      newPort.containerId = schedule.container.id;
      return newPort;
    });
    let portN = Port.bulkCreate(ports);
    let sch = await schedule.updateAttributes({ statusId: 2 });
    return sch;
   // }
  } catch (err) {
    console.log(`schedule${schedule.id}: create fail with kubernetes`);
    console.log(`${err.message}`);
    /* 這裡寄信 */
  }
  return false;
};

const updateContainerFromSchedule = async (schedule) => {
  try {
    let scheduleP = await schedule.get({ plain: true });
    let options = {
      method: 'GET',
      url: `${conAPI}/${scheduleP.machine.label}`,
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    if (response.statusCode === 200) {
      let pod = response.body[0];
      let service = response.body[1];
      if (pod.status.phase !== 'Running') return false;

      let containerN = await schedule.container.updateAttributes({
        podIp: pod.status.hostIP,
        sshPort: service.spec.ports[0].nodePort
      });
      if (!containerN) return false;


      let scheduleN = await schedule.updateAttributes({ statusId: 3 });
      return (scheduleN) ? true : false;

    }
  } catch (err) {
    debug(err);
    console.log(`schedule${schedule.id}: update fail with kubernetes`);
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
    await schedule.updateAttributes({ statusId: 5, endedAt: moment().format() });
    return true;

  } catch (err) {
    console.log(`schedule${schedule.id}: delete fail with kubernetes`);
    console.log(`${err.message}`);
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

const startSchedule = async () => {
  console.log('Cron Start Schedules');
  let timeOptions = {
    start: moment().format()
  };
  let schedules = await db.getShouldStartSchedule.findAll(timeOptions);

  let containersUpdate = schedules.map(createContainerFromSchedule);

 // let result = Promise.all(instancesUpdate);
 // console.log(result);
  return true;
};


const updateSchedule = async () => {
  debug('Cron Update Schedules');
  let schedules = await Schedule.scope(
    'detail',
    { method: ['scheduleStatusWhere', 2] }
  ).findAll();

  let containersUpdate = schedules.map(updateContainerFromSchedule);
  return true;
};

const terminateSchedule = async () => {
  debug('Cron terminal Schedules');
  let schedules = await Schedule.scope(
    'detail',
    'scheduleShouldTerminate'
  ).findAll();

  let containersUpdate = schedules.map((schedule) => {
    if ([2,3,4]){}

  });


  map(deleteContainerFromSchedule);

  return true;
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

export { createContainerFromSchedule,
  updateContainerFromSchedule,
  deleteContainerFromSchedule,
  removeAllContainers,
  startSchedule,
  updateSchedule,
  terminateSchedule,
  getAllImages
};

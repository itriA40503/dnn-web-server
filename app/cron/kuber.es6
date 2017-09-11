import request from 'request-promise-native';
import moment from 'moment';
import asyncWrap from '../util/asyncWrap';
import db from '../db/db';
import { schedule as Schedule, instance as Instance, machine as Machine, image as Image } from '../models';


const kubeUrl = 'http://100.86.2.12:30554/kubeGpu';
const kubeUrl2 = ' http://140.96.27.42:30554/kubeGpu';
const conAPI = `${kubeUrl}/container`;
const consAPI = `${kubeUrl}/containers`;
const imageAPI = `${kubeUrl2}/image`;
const imagesAPI = `${kubeUrl2}/images`;

const createContainerFromSchedule = async (schedule) => {
  try {

    let scheduleP = await schedule.get({ plain: true });
    let id = scheduleP.instance.id;
    let options = {
      method: 'POST',
      url: conAPI,
      body: {
        machineId: scheduleP.instance.machine.label,
        gpuType: scheduleP.instance.machine.gpuType,
        imgTag: `${scheduleP.instance.image.name}:${scheduleP.instance.image.label}`,
        account: schedule.instance.username,
        pwd: schedule.instance.password
      },
      timeout: 5000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);

    if (response.statusCode === 200) {
      let sch = await schedule.updateAttributes({ statusId: 2 });
      return (sch) ? true : false;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};

const updateContainerFromSchedule = async (schedule) => {
  try {
    let scheduleP = await schedule.get({ plain: true });
    let options = {
      method: 'GET',
      url: `${conAPI}/${scheduleP.instance.machine.label}`,
      json: true,
      resolveWithFullResponse: true
    };

    let response = await request(options);
    if (response.statusCode === 200) {
      let pod = response.body[0];
      let service = response.body[1];
      if (pod.status.phase !== 'Running') return false;

      let instanceN = await schedule.instance.updateAttributes({
        ip: pod.status.hostIP,
        port: service.spec.ports[0].nodePort
      });

      if (!instanceN) return false;
      let scheduleN = await schedule.updateAttributes({ statusId: 3 });
      return (scheduleN) ? true : false;

    }
  } catch (err) {
    console.log(`schedule${schedule.id}: update fail`);
  }
  return false;
};

const deleteContainerFromSchedule = async (schedule) => {
  try {
    let scheduleP = await schedule.get({ plain: true });
    let id = scheduleP.instance.id;
    let options = {
      method: 'DELETE',
      url: `${conAPI}/${scheduleP.instance.machine.label}`,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    if (response.statusCode === 200) {
      console.log('delete success');
      await schedule.updateAttributes({ statusId: 5, endedAt: moment().format() });
      return true;
    }
  } catch (err) {
    console.log(`schedule${schedule.id}: delete fail`);
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
    if (response.statusCode === 200) {
      let schedules = await Schedule.scope('id').findAll();
      let instances = await Instance.scope('id').findAll();
      let scheduleIds = await schedules.reduce((sId, schedule) => {
        sId.push(schedule.id);
        return sId;
      }, []);

      let instanceIds = await instances.reduce((sId, instance) => {
        sId.push(instance.id);
        return sId;
      }, []);

      await Schedule.destroy({
        force: true,
        where: {
          id: scheduleIds
        }});
      await Instance.destroy({
        force: true,
        where: {
          id: instanceIds
        }});


      await Schedule.destroy({
        force: true });
      await Instance.destroy({
        force: true });
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

const startSchedule = () => {
  console.log('start schedule');
  let timeOptions = {
    start: moment().format()
  };
  let schedules = Schedule.scope(
    'detail',
    { method: ['timeOverlap', timeOptions] },
    { method: ['scheduleStatusWhere', 1] }
  ).findAll();

  let instancesUpdate = schedules.map(createContainerFromSchedule);

 // let result = Promise.all(instancesUpdate);
 // console.log(result);
  return true;
};


const updateSchedule = () => {
  console.log('update schedule');
  let schedules = Schedule.scope(
    'detail',
    { method: ['scheduleStatusWhere', 2] }
  ).findAll();

  let instancesUpdate = schedules.map(updateContainerFromSchedule);
  return true;
};

const deleteSchedule = () => {
  let schedules = Schedule.scope(
    'detail',
    'scheduleShouldDelete'
  ).findAll();

  let instancesUpdate = schedules.map(deleteContainerFromSchedule);

  return true;
};


const handleAnImageTag = async (imageTag) => {
  let [name, label] = imageTag.split(':');
  console.log(`${name}===========================${label}`);
  let [image, created] = await Image.findOrCreate({
    where: {
      name: name,
      label: label
    }
  });
  return image;
};

const getAllImages = async () => {
  try {
    let options = {
      method: 'GET',
      url: imagesAPI,
      timeout: 5000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    if (response.statusCode === 200) {
      let images = response.body.images;
      images.map(handleAnImageTag);
      return true;
    }

  } catch (err) {
    console.log(err);
  }
  return false;
};

export { createContainerFromSchedule,
  updateContainerFromSchedule,
  deleteContainerFromSchedule,
  removeAllContainers,
  startSchedule,
  updateSchedule,
  deleteSchedule,
  getAllImages
};

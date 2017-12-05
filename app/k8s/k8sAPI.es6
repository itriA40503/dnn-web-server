import request from 'request-promise-native';
import moment from 'moment';
import Debug from 'debug';
import asyncWrap from '../util/asyncWrap';
import db from '../db/db';
import config from '../config';
import K8SError from '../util/K8SError';
import { schedule as Schedule, container as Container, machine as Machine, image as Image, port as Port } from '../models/index';

const debug = Debug('kuber-api');
const kubeConfig = config.kuber;
const kubeUrl = kubeConfig.url;
// const kubeUrl2 = ' http://140.96.27.42:30554/kubeGpu';
const cVolumnAPI = `${kubeUrl}/volumn`;
const conAPI = `${kubeUrl}/container`;
const consAPI = `${kubeUrl}/containers`;
const imageAPI = `${kubeUrl}/image`;
const imagesAPI = `${kubeUrl}/images`;

const k8sAPI = {};

k8sAPI.createUserVolumeUsingITRIID = async (itriId) => {
  console.log(`ITRI id ${itriId}: creating storage volume`);
  try {
    let options = {
      method: 'POST',
      url: cVolumnAPI,
      body: {
        account: itriId
      },
      timeout: 5000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    return response;
  } catch (err) {
    console.error(`ITRI id ${itriId}: create storage volume failed`);
    /* 這裡寄信 */
    throw new K8SError(err.message);
  }
};

k8sAPI.createContainerUsingSchedule = async (schedule) => {
  console.log(`Schedule${schedule.id}: creating container`);
  try {
    let options = {
      method: 'POST',
      url: conAPI,
      body: {
        machineId: schedule.machine.label,
        gpuType: schedule.machine.gpuType,
        imgTag: `${schedule.image.name}:${schedule.image.label}`,
        account: schedule.username,
        pwd: schedule.password,
        gpuCnt: schedule.machine.gpuAmount || 1
      },
      timeout: 5000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    return response;
  } catch (err) {
    console.error(`Schedule${schedule.id}: create fail with kubernetes`);
    /* 這裡寄信 */
    throw new K8SError(err.message);
  }
};

k8sAPI.updateContainerUsingSchedule = async (schedule) => {
  console.log(`Schedule${schedule.id}: updating container`);
  try {
    let options = {
      method: 'GET',
      url: `${conAPI}/${schedule.machine.label}`,
      json: true,
      resolveWithFullResponse: true,
      timeout: 5000
    };

    let response = await request(options);
    return response;
  } catch (err) {
    console.error(`Schedule${schedule.id}: update fail with kubernetes`);
    throw new K8SError(err.message);
  }
};

k8sAPI.deleteContainerFromSchedule = async (schedule) => {
  console.log(`Schedule${schedule.id}: deleting container`);
  try {
    let options = {
      method: 'DELETE',
      url: `${conAPI}/${schedule.machine.label}`,
      resolveWithFullResponse: true,
      timeout: 5000
    };
    let response = await request(options);
    return response;

  } catch (err) {
    console.error(`Schedule${schedule.id}: delete fail with kubernetes`);
    throw new K8SError(err.message);
  }
};


k8sAPI.removeAllContainers = async () => {
  try {
    let options = {
      method: 'DELETE',
      url: consAPI,
      resolveWithFullResponse: true,
      timeout: 5000
    };
    let response = await request(options);
    return response;
  } catch (err) {
    throw new K8SError(err.message);
  }
};

k8sAPI.getAllImages = async () => {
  console.log('Getting All Images\' tags from repository.');
  try {
    let options = {
      method: 'GET',
      url: imagesAPI,
      timeout: 7000,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    return response;

  } catch (err) {
    console.error('Get images\' tags from repository failed.');
    throw new K8SError(err.message);
  }
};

export default k8sAPI;

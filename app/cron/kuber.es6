import request from 'request-promise-native';
import asyncWrap from '../util/asyncWrap';
import moment from 'moment';
import { schedule as Schedule, instance as Instance, machine as Machine } from '../models';

const startSchedule = async () => {
  try {
    console.log('start schedule');
    let timeOptions = {
      start: moment().format()
    };
    console.log('schedule get');
    let schedules = await Schedule.scope(
      'detail',
      { method: ['timeOverlap', timeOptions] },
      { method: ['scheduleStatusWhere', 1] }
    ).findAll();

    let instancesUpdate = await schedules.map(async (schedule) => {
      let scheduleP = await schedule.get({ plain: true });
      let id = scheduleP.instance.id;
      let machineId = scheduleP.instance.machine.id;
      let options = {
        method: 'POST',
        url: 'http://100.86.2.12:30554/kubeGpu/container',
        body: {
          machineId: scheduleP.instance.machine.label,
          gpuType: scheduleP.instance.machine.gpuType,
          imgTag: scheduleP.instance.image.label,
          account: schedule.instance.username,
          pwd: schedule.instance.password
        },
        json: true,
        resolveWithFullResponse: true
      };
      let response = await request(options);

      if (response.statusCode === 200) {
        let pod = response.body[0];
        let service = response.body[1];

        await schedule.instance.update({
          ip: pod.status.hostIP,
          port: service.spec.ports[0].nodePort
        });
        return schedule.update({ statusId: 2 });
      }
      console.log(' fail');
      return true;
    });

    await Promise.all(instancesUpdate);

    return;

  } catch (err) {
    console.log(err);
  }
};


const updateSchedule = async () => {
  try {
    console.log('update schedule');
    let schedules = await Schedule.scope(
      'detail',
      { method: ['scheduleStatusWhere', 2] }
    ).findAll();

    let instancesUpdate = await schedules.map(async (schedule) => {
      let scheduleP = await schedule.get({ plain: true });
      let id = scheduleP.instance.id;
      let machineId = scheduleP.instance.machine.id;
      let options = {
        method: 'GET',
        url: `http://100.86.2.12:30554/kubeGpu/container/${scheduleP.instance.machine.label}`,
        json: true,
        resolveWithFullResponse: true
      };
      let response = await request(options);
      if (response.statusCode === 200) {
        let pod = response.body[0];
        let service = response.body[1];
        if (pod.status.phase === 'Running') {
          return schedule.update({ statusId: 3 });
        }

        console.log('status pending');
        return true;

      }
      console.log(' fail');
      return true;
    });

    await Promise.all(instancesUpdate);

    return;

  } catch (err) {
    console.log(err);
  }
};

const deleteSchedule = async () => {
  try {
    console.log('delete schedule');
    let schedules = await Schedule.scope(
      'detail',
      { method: ['scheduleStatusWhere', 3] }
    ).findAll();

    let instancesUpdate = await schedules.map(async (schedule) => {
      let scheduleP = await schedule.get({ plain: true });
      let id = scheduleP.instance.id;
      let machineId = scheduleP.instance.machine.id;
      let options = {
        method: 'DELETE',
        url: `http://100.86.2.12:30554/kubeGpu/container/${scheduleP.instance.machine.label}`,
        resolveWithFullResponse: true
      };
      let response = await request(options);
      if (response.statusCode === 200) {
        console.log('delete success');
        return schedule.destroy();
      }
      console.log(' fail');
      return false;
    });

    await Promise.all(instancesUpdate);

    return;

  } catch (err) {
    console.log(err);
  }
};

export { startSchedule, updateSchedule, deleteSchedule };

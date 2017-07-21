import { CronJob } from 'cron';
import request from 'request-promise-native';
import asyncWrap from '../util/asyncWrap';
import moment from 'moment';
import { schedule as Schedule, instance as Instance, machine as Machine } from '../models';


let startSchedule = async () => {
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
      let scheduleP = await schedule.get({plain: true});
      let id = scheduleP.instance.id;
      let machineId = scheduleP.instance.machineId;
      let options = {
        method: 'POST',
        url: 'http://140.96.27.42:30000/kubeGpu/container',
        body: {
          machineId: 'm' + machineId ,
          gpuType: '1080ti',
          imgTag: 'simple_201706',
          account: schedule.instance.username,
          pwd: schedule.instance.password
        },
        json: true,
        resolveWithFullResponse: true
      };
      let response = await request(options);

      if (response.statusCode === 200) {
        console.log(' success');
        return schedule.update({ statusId: 3 });
      }
      console.log(' fail');
      return false;
    });
    // await Promise.all(instancesUpdate);
  } catch (err) {
    console.log(err);
  }
};

let startScheduleJob = new CronJob({
  cronTime: '0 0 * * *',
  onTick: startSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});

startSchedule();
// startScheduleJob.start();

import { CronJob } from 'cron';
import { startSchedules, updateSchedules, terminateSchedules, getAllImages } from './kuber';

let terminateScheduleJob = new CronJob({
  cronTime: '* 0 0 * * *',
  onTick: terminateSchedules,
  start: false,
  timeZone: 'Asia/Taipei'
});

let startScheduleJob = new CronJob({
  cronTime: '* 1 0 * * *',
  onTick: startSchedules,
  start: false,
  timeZone: 'Asia/Taipei'
});

let updateScheduleJob = new CronJob({
  cronTime: '0 */10 * * * *',
  onTick: updateSchedules,
  start: false,
  timeZone: 'Asia/Taipei'
});


let updateImageJob = new CronJob({
  cronTime: '30 */10 * * * *',
  onTick: getAllImages,
  start: false,
  timeZone: 'Asia/Taipei'
});


// startSchedule();
startScheduleJob.start();
updateScheduleJob.start();
terminateScheduleJob.start();
updateImageJob.start();

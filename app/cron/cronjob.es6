import { CronJob } from 'cron';
import serverJob from '../queue/job';

let terminateScheduleJob = new CronJob({
  cronTime: '0 0 0 * * *',
  onTick: serverJob.terminateSchedules,
  start: false,
  timeZone: 'Asia/Taipei'
});

let startScheduleJob = new CronJob({
  cronTime: '0 1 0 * * *',
  onTick: serverJob.startSchedules,
  start: false,
  timeZone: 'Asia/Taipei'
});

let updateScheduleJob = new CronJob({
  cronTime: '20 */20 * * * *',
  onTick: serverJob.updateSchedules,
  start: false,
  timeZone: 'Asia/Taipei'
});


let updateImageJob = new CronJob({
  cronTime: '30 */11 * * * *',
  onTick: serverJob.updateImageList,
  start: false,
  timeZone: 'Asia/Taipei'
});


startScheduleJob.start();
updateScheduleJob.start();
terminateScheduleJob.start();
updateImageJob.start();

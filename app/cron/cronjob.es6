import { CronJob } from 'cron';
import { startSchedule, updateSchedule, deleteSchedule, getAllImages } from './kuber';

let deleteScheduleJob = new CronJob({
  cronTime: '* 0 0 * * *',
  onTick: deleteSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});

let startScheduleJob = new CronJob({
  cronTime: '* 1 0 * * *',
  onTick: startSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});

let updateScheduleJob = new CronJob({
  cronTime: '0 */10 * * * *',
  onTick: updateSchedule,
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
deleteScheduleJob.start();
updateImageJob.start();

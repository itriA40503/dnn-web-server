import { CronJob } from 'cron';
import { startSchedule, updateSchedule, deleteSchedule } from './kuber';

let deleteScheduleJob = new CronJob({
  cronTime: '0 0 * * *',
  onTick: deleteSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});

let startScheduleJob = new CronJob({
  cronTime: '1 0 * * *',
  onTick: startSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});

let updateScheduleJob = new CronJob({
  cronTime: '* */10 * * *',
  onTick: updateSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});


// startSchedule();
startScheduleJob.start();
updateScheduleJob.start();
deleteScheduleJob.start();

import { CronJob } from 'cron';
import {startSchedule, updateSchedule, deleteSchedule} from './kuber'

let startScheduleJob = new CronJob({
  cronTime: '0 0 * * *',
  onTick: startSchedule,
  start: false,
  timeZone: 'Asia/Taipei'
});

// startSchedule();
startScheduleJob.start();

import { CronJob } from 'cron';
import moment from 'moment';
import { schedule as Schedule, instance as Instance, machine as Machine } from '../models';

let startInstanceJob = new CronJob({
  cronTime: '0 0 * * *',
  onTick: async () => {
    try {
      let timeOptions = {
        start: moment().format()
      };

      let schedules = await Schedule.scope(
        'detail',
        { method: ['timeOverlap', timeOptions] },
        { method: ['instanceStatusWhere', { statusId: 1 }] }
      ).findAll();

      let instancesUpdate = await schedules.map((schedule) => {
        let id = schedule.instance.id;
        return Instance.update({ statusId: 2 }, { where: { id: id } });
      });
      await Promise.all(instancesUpdate);


    } catch (err) {
      console.log(err);
    }
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

startInstanceJob.start();

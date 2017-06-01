import express from 'express';
import moment from 'moment';
import CdError from '../../util/CdError';
import { schedule as Schedule, machine as Machine } from '../../models/index';

const router = express.Router();

let getSchedulesOverlapPeriod = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('normal', { method: ['timeOverlap', options] }).findAll();
};

let getAllMachines = () => {
  return Machine.findAll({ attributes: ['id'], raw: true });
};

router.get('/', async (req, res, next) => {
  try {
    let machines = await Machine.scope('normal').findAll();
    res.json({ machines: machines });
  } catch (err) {
    next(err);
  }
});

router.get('/remain', async (req, res, next) => {
  try {
    let startQuery = (req.query && req.query.start) || (req.body && req.body.start);
    let endQuery = (req.query && req.query.end) || (req.body && req.body.end);

    if (!startQuery || !endQuery) throw new CdError(401, 'lack of parameter');

    let start = moment(startQuery);
    let end = moment(endQuery);

    if (!start.isValid() || !end.isValid()) throw new CdError(401, 'date parameter error', 0);
    start.startOf('d');
    end.endOf('d');
    if (start > end) throw new CdError(401, 'end date should greater than start date');

    let [machines, schedules] = await Promise.all([
      getAllMachines(),
      getSchedulesOverlapPeriod(start.toDate(), end.toDate())
    ]);

    let machineSet = await new Set(
      machines.map(machine => machine.id)
    );

    let resultSet = await schedules.reduce((set, schedule) => {
      let machineId = schedule.instance.machine.id;
      if (set.has(machineId)) set.delete(machineId);
      return set;
    }, machineSet);

    res.json({
      availableNumber: resultSet.size,
      machines: [...resultSet]
    });
  } catch (err) {
    next(err);
  }
});

router.get('/calendar', async (req, res, next) => {
  const PERIOD = 30;
  try {

    let date = new Date();
    date.setHours(0,0,0,0);

    let [machines, schedules] = await Promise.all([
      getAllMachines(),
      getSchedulesOverlapPeriod(date, new Date(date.getTime() + (1000 * 86400 * PERIOD)))
    ]);

    let machineSet = await machines.reduce((set, machine) => {
      set.add(machine.id);
      return set;
    }, new Set());

    let calendar = await [...Array(PERIOD).keys()].map((i) => {

      let startedDate = new Date(date.getTime() + (1000 * 86400 * i));
      let endedDate = new Date(startedDate.getTime() + (1000 * 86399));
      let usedSet = schedules.reduce((set, schedule) => {
        if (schedule.startedAt <= endedDate && schedule.endedAt >= startedDate) {
          set.add(schedule.instance.machine.id);
        }
        return set;
      }, new Set());

      let availables = [...machineSet].filter(x => !usedSet.has(x));

      return {
        date: startedDate,
        available: availables,
        availableNum: availables.length
      };

    });

    res.json({ availableCalendar: calendar });

  } catch (err) {
    next(err);
  }
});

export default router;

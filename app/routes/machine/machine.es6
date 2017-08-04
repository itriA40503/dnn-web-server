import moment from 'moment';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { schedule as Schedule, machine as Machine } from '../../models/index';

const PERIOD = 30;
const machine = {};

let getSchedulesOverlapPeriod = (start, end) => {
  let options = {
    start: start,
    end: end
  };
  return Schedule.scope('normal', 'statusNormal', { method: ['timeOverlap', options] }).findAll();
};

let getAllMachinesId = () => {
  return Machine.findAll({ attributes: ['id'], raw: true });
};

let getAllMachines = () => {
  return Machine.scope('normal').findAll();
};

machine.getMachines = asyncWrap(async (req, res, next) => {

  let [machines, schedules] = await Promise.all([
    getAllMachines(),
    getSchedulesOverlapPeriod(moment().toDate(), moment().toDate())
  ]);
  let machineList = await machines.map((machine) => {
    let scheduleInMachineCurrent = schedules.filter((schedule) => {
      return schedule.instance.machine.id === machine.id;
    }).map((schedule) => {
      return schedule.get({ plain: true });
    });
    let machinePlain = machine.get({ plain: true });
    machinePlain.currentSchedules = scheduleInMachineCurrent;
    return machinePlain;
  });
  res.json({ machines: machineList });
});


machine.getMachineRemainInPeriod = asyncWrap(async (req, res, next) => {
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
    getAllMachinesId(),
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
});

machine.getMachineRemainInMonth = asyncWrap(async (req, res, next) => {

  let date = new Date();
  date.setHours(0,0,0,0);

  let [machines, schedules] = await Promise.all([
    getAllMachinesId(),
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

});


export default machine;

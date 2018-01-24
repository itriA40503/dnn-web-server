import moment from 'moment';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { schedule as Schedule, machine as Machine } from '../../models/index';

const PERIOD = 30;
const machine = {};


machine.getMachines = asyncWrap(async (req, res, next) => {
  let customGpu = req.query.gpu_type || (req.body && req.body.gpuType);

  let machineWhere = {};
  if (customGpu) machineWhere = { where: { gpuType: customGpu } };
  let machines = await db.getAllMachineNormal(machineWhere);

  res.json({ machines: machines });
});


machine.getMachineRemainInPeriod = asyncWrap(async (req, res, next) => {
  let startQuery = (req.query && req.query.start) || (req.body && req.body.start);
  let endQuery = (req.query && req.query.end) || (req.body && req.body.end);
  let customGpu = req.query.gpu_type || (req.body && req.body.gpuType);

  if (!startQuery || !endQuery) throw new CdError(400, 'lack of parameter', 40001);

  let start = moment(startQuery);
  let end = moment(endQuery);

  if (!start.isValid() || !end.isValid()) throw new CdError(400, 'date parameter error', 40002);
  start.startOf('d');
  end.endOf('d');
  if (start > end) throw new CdError(400, 'end date should greater than start date');

  let machineWhere = {};
  if (customGpu) machineWhere = { where: { gpuType: customGpu } };

  let [machines, schedules] = await Promise.all([
    db.getAllMachineNormal(machineWhere),
    db.getAllOccupiedSchedules(start.format(), end.format())
  ]);

  let machineSet = await new Set(
    machines.map(machine => machine.id)
  );

  let resultSet = await schedules.reduce((set, schedule) => {
    let machineId = schedule.machine.id;
    if (set.has(machineId)) set.delete(machineId);
    return set;
  }, machineSet);

  res.json({
    availableNumber: resultSet.size,
    machines: [...resultSet]
  });
});

machine.getMachineRemainInMonth = asyncWrap(async (req, res, next) => {

  let customGpu = req.query.gpu_type || (req.body && req.body.gpuType);
  /* let date = new Date();
  date.setHours(0, 0, 0, 0);*/
  let start = moment();
  let end = moment().add('d', PERIOD);

  let machineWhere = {};
  if (customGpu) machineWhere = { where: { gpuType: customGpu } };

  let [machines, schedules] = await Promise.all([
    db.getAllMachineNormal(machineWhere),
    db.getAllOccupiedSchedules(start.format(), end.format())
  ]);

  let machineSet = await machines.reduce((set, machine) => {
    set.add(machine.id);
    return set;
  }, new Set());

  let calendar = await [...Array(PERIOD).keys()].map((i) => {

    let startedDate = moment(start).add('days', i); // new Date(date.getTime() + (1000 * 86400 * i));
    let endedDate = moment(startedDate).endOf('days'); // new Date(startedDate.getTime() + (1000 * 86399));
    let usedSet = schedules.reduce((set, schedule) => {
      if (moment(schedule.startedAt) <= endedDate && moment(schedule.endedAt) >= startedDate) {
        set.add(schedule.machine.id);
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

import moment from 'moment';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { schedule as Schedule, machine as Machine } from '../../models/index';

const PERIOD = 30;
const machine = {};

machine.createMachine = asyncWrap(async (req, res, next) => {
  let label = (req.query && req.query.label) || (req.body && req.body.label);
  let name = (req.query && req.query.name) || (req.body && req.body.name) || label;
  let gpuAmount = (req.query && req.query.gpu_amount) || (req.body && req.body.gpuAmount) || 1;
  let gpuType = (req.query && req.query.gpu_type) || (req.body && req.body.gpuType) || 'v100';
  let [machine, created] = Machine.findOrCreate({
    where: {
      label: label
    },
    defaults: {
      name: name,
      gpuAmount: gpuAmount,
      gpuType: gpuType
    }
  });

  if (!created) throw CdError(401, 'Machine with same label already exist!');
  res.json(machine);
});

machine.updateMachineStatus = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let statusId = (req.query && req.query.status) || (req.body && req.body.status) || 1;

  let machine = Machine.update({ statusId: statusId } ,{
    where: {
      id: machineId
    }
  });

  res.json(machine);
});

machine.deleteMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let machine = Machine.update({ statusId: 4 } ,{
    where: {
      id: machineId
    }
  });

  res.json(machine);
});


machine.getMachines = asyncWrap(async (req, res, next) => {
  let machines = await db.getAllMachineNormal().findAll();

  res.json({ machines: machines });
});


machine.getMachineRemainInPeriod = asyncWrap(async (req, res, next) => {
  let startQuery = (req.query && req.query.start) || (req.body && req.body.start);
  let endQuery = (req.query && req.query.end) || (req.body && req.body.end);
  let customGpu = req.query.gpu_type || (req.body && req.body.gpu_type);

  if (!startQuery || !endQuery) throw new CdError(401, 'lack of parameter');

  let start = moment(startQuery);
  let end = moment(endQuery);

  if (!start.isValid() || !end.isValid()) throw new CdError(401, 'date parameter error', 0);
  start.startOf('d');
  end.endOf('d');
  if (start > end) throw new CdError(401, 'end date should greater than start date');

  let machineWhere = {};
  if (customGpu) machineWhere = { where: { gpuType: customGpu } };

  let [machines, schedules] = await Promise.all([
    db.getAllMachineNormal().findAll(machineWhere),
    db.getAllRunningSchedules(start.format(), end.format()).findAll()
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

  let customGpu = req.query.gpu_type || (req.body && req.body.gpu_type);
  /* let date = new Date();
  date.setHours(0, 0, 0, 0);*/
  let start = moment();
  let end = moment().add('d', PERIOD);

  let machineWhere = {};
  if (customGpu) machineWhere = { where: { gpuType: customGpu } };

  let [machines, schedules] = await Promise.all([
    db.getAllMachineNormal().findAll(machineWhere),
    db.getAllRunningSchedules(start.format(), end.format()).findAll()
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

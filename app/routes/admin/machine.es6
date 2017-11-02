import moment from 'moment';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import serverJob from '../../queue/job';
import { machine as Machine } from '../../models/index';

const GPU_MAXIMUM = 8;

const instantUpdateContainer = async (schedule, times) => {
  let tryTimes = times;
  if (tryTimes > 0) {
    let result = await serverJob.updateASchedule(schedule);
    if (!result) {
      setTimeout(() => {
        instantUpdateContainer(schedule, tryTimes - 1);
      }, 10000);
    }

  }
};

const instantDeleteContainer = async (schedule, times) => {
  let tryTimes = times;
  if (tryTimes > 0) {
    let result = await serverJob.deleteASchedule(schedule);
    if (!result) {
      setTimeout(() => {
        instantDeleteContainer(schedule, tryTimes - 1);
      }, 10000);
    }
  }
};

const instantCreateContainer = async (schedule, times) => {
  let tryTimes = times;
  if (tryTimes > 0) {
    console.log(`Start to create container ${schedule.id}`);
    let result = await serverJob.startASchedule(schedule);
    if (result) {
      setTimeout(() => {
        instantUpdateContainer(schedule, 2);
      }, 5000);
    } else {
      setTimeout(() => {
        instantCreateContainer(schedule, tryTimes - 1);
      }, 5000);
    }
  }
};


const machineAPI = {};

console.log(Machine);

const checkMachineExist = async (id) => {
  let machine = await db.getExistMachineById(id);
  if (!machine) throw new CdError(401, 'Machine not exist!!');
  return machine;
};

machineAPI.getAllExistMachine = asyncWrap(async (req, res, next) => {
  let machines = await db.getAllExistMachines();
  res.json(machines);
});

machineAPI.createMachine = asyncWrap(async (req, res, next) => {
  let label = (req.query && req.query.label) || (req.body && req.body.label);
  let name = (req.query && req.query.name) || (req.body && req.body.name) || label;
  let gpuAmount = (req.query && req.query.gpu_amount) || (req.body && req.body.gpuAmount) || 1;
  let gpuType = (req.query && req.query.gpu_type) || (req.body && req.body.gpuType) || 'v100';

  if (gpuAmount) {
    if (!Number.isInteger(gpuAmount)) throw new CdError(401, 'Gpu amount is not a number');
    else if (gpuAmount >= GPU_MAXIMUM || gpuAmount <= 0) throw new CdError(401, 'Gpu amount must between 1~8');
  }

  let machineAttr = {
    label: label,
    name: name,
    gpuAmount: gpuAmount,
    gpuType: gpuType
  };
  let machine = await db.getMachineByLabel(label);
  if (machine) {
    if (machine.statusId !== 4) throw new CdError(401, 'Machine with same label already exist!');
    await machine.updateAttributes(machineAttr);
  } else {
    machine = await Machine.create(machineAttr);
  }
  res.json(machine);
});

machineAPI.modifyMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let gpuAmount = (req.query && req.query.gpu_amount) || (req.body && req.body.gpuAmount);
  let gpuType = (req.query && req.query.gpu_type) || (req.body && req.body.gpuType);
  let description = (req.query && req.query.description) || (req.body && req.body.description);

  let updateAttr = {};

  if (gpuAmount) {
    if (!Number.isInteger(gpuAmount)) throw new CdError(401, 'Gpu amount is not a number');
    else if (gpuAmount >= GPU_MAXIMUM || gpuAmount <= 0) throw new CdError(401, 'Gpu amount must between 1~8');
    updateAttr.gpuAmount = gpuAmount;
  }

  if (gpuType) {
    updateAttr.gpuType = gpuType;
  }

  if (description) {
    updateAttr.description = description;
  }

  let machine = await checkMachineExist(machineId);
  // 要先update db裡的機器資訊
  await machine.updateAttributes(updateAttr);

  let currentScheduleOnMachine =
    await db.getMachinesCurrentOccupiedSchedules(machineId, moment().format());
  if (currentScheduleOnMachine) {
    instantCreateContainer(currentScheduleOnMachine, 3);
  }


  res.json(machine);
});

// 工程師用
machineAPI.updateMachineStatus = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let statusId = (req.query && req.query.status) || (req.body && req.body.status) || 1;
  let machine = await checkMachineExist(machineId);

  await machine.updateAttributes({ statusId: statusId });

  res.json(machine);
});

machineAPI.enableMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let machine = await checkMachineExist(machineId);

  await machine.updateAttributes({ statusId: 1 });

  res.json(machine);
});

machineAPI.disableMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let machine = await checkMachineExist(machineId);

  let currentScheduleOnMachine =
    await db.getMachineAllOccupiedSchedule(machineId);
  // 取消或刪除所有機器上的schedule
  currentScheduleOnMachine.map(serverJob.deleteASchedule);
  await machine.updateAttributes({ statusId: 3 });

  res.json(machine);
});


machineAPI.deleteMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let machine = await checkMachineExist(machineId);

  let currentScheduleOnMachine =
    await db.getMachineAllOccupiedSchedule(machineId);
  // 取消或刪除所有機器上的schedule
  currentScheduleOnMachine.map(serverJob.deleteASchedule);
  await machine.updateAttributes({ statusId: 4 });

  res.json(machine);
});


export default machineAPI;

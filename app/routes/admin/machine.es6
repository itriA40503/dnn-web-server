import moment from 'moment';
import validator from 'validator';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import serverJob from '../../queue/job';
import { machine as Machine } from '../../models/index';
import { checkAmount } from '../../util/Checker';

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

const checkMachineExist = async (id) => {
  let machine = await db.getExistMachineById(id);
  if (!machine) throw new CdError(400, 'Machine not exist!!');
  return machine;
};

const checkResourceExist = async (id) => {
  let res = await db.findResourceInfoById(id);
  if (!res) throw new CdError(400, 'Resource(id) not exist or has been deleted.');
  return res;
};

machineAPI.getAllExistMachine = asyncWrap(async (req, res, next) => {
  let machines = await db.getAllExistMachines();  
  res.json(machines);
});

machineAPI.createMachine = asyncWrap(async (req, res, next) => {
  let label = (req.query && req.query.label) || (req.body && req.body.label);
  let name = (req.query && req.query.name) || (req.body && req.body.name);
  let gpuAmount = (req.query && req.query.gpuAmount) || (req.body && req.body.gpuAmount);
  let gpuType = (req.query && req.query.gpu_type) || (req.body && req.body.gpuType);

  let resId = (req.query && req.query.resId) || (req.body && req.body.resId);

  if (!label) throw new CdError(400, 'label not input', 40001);
  if (!name) throw new CdError(400, 'name not input', 40001);
  if (!resId) { 
    throw new CdError(400, 'resId not input', 40001);
  } else {  
    const resInfo = await checkResourceExist(resId);
    gpuType = resInfo.gpuType;    
  }

  await checkAmount(gpuAmount);  

  let machineAttr = {
    label,
    name,
    gpuAmount,
    gpuType,
    resId,
    // updatedAt: moment().add(8, 'hours').format(),
  };
  let machine = await db.getMachineByLabel(label);
  if (machine) {
    if (machine.statusId !== 4) throw new CdError(400, 'Machine with same label already exist!');
    await machine.updateAttributes(machineAttr);
  } else {
    machine = await Machine.create(machineAttr);
  }  
  res.json(machine);
});

machineAPI.modifyMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let gpuAmount = (req.query && req.query.gpuAmount) || (req.body && req.body.gpuAmount);
  let description = (req.query && req.query.description) || (req.body && req.body.description);
  let resId = (req.query && req.query.resId) || (req.body && req.body.resId);

  let updateAttr = {};
  
  if (resId) {
    const resInfo = await checkResourceExist(resId);
    updateAttr.gpuType = resInfo.gpuType;
    updateAttr.resId = resId;
  }  

  await checkAmount(gpuAmount);
  
  if (description) {
    updateAttr.description = description;
  }

  let machine = await checkMachineExist(machineId);
  // 要先update db裡的機器資訊
  let modifiedMachine = await machine.updateAttributes(updateAttr);
  
  let currentScheduleOnMachine =
    await db.getMachinesCurrentOccupiedSchedules(machineId, moment().format());
  
  if (currentScheduleOnMachine) {
    instantCreateContainer(currentScheduleOnMachine, 3);
  }

  res.json(modifiedMachine);
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
  await machine.updateAttributes({ statusId: 4, deletedAt: moment().format() });

  res.json(machine);
});


export default machineAPI;

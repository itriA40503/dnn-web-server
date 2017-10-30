import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { machine as Machine } from '../../models/index';

const machineAPI = {};

console.log(Machine);


const checkMachineExist = async (id) => {
  let machine = await db.getMachineById(id);
  if (!machine) throw new CdError(401, 'Machine not exist!!');
  return machine;
};

machineAPI.createMachine = asyncWrap(async (req, res, next) => {
  let label = (req.query && req.query.label) || (req.body && req.body.label);
  let name = (req.query && req.query.name) || (req.body && req.body.name) || label;
  let gpuAmount = (req.query && req.query.gpu_amount) || (req.body && req.body.gpuAmount) || 1;
  let gpuType = (req.query && req.query.gpu_type) || (req.body && req.body.gpuType) || 'v100';
  let [machine, created] = await Machine.findOrCreate({
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

machineAPI.modifyMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let gpuAmount = (req.query && req.query.gpu_amount) || (req.body && req.body.gpuAmount) || 1;
  let gpuType = (req.query && req.query.gpu_type) || (req.body && req.body.gpuType) || 'v100';
  let description = (req.query && req.query.description) || (req.body && req.body.description);

  let machine = await checkMachineExist(machineId);

  if (machine.statusId === 1) throw new CdError(401, 'Machine is running, must disable first!');

  await machine.updateAttributes({
    gpuAmount: gpuAmount,
    gpuType: gpuType,
    description: description
  });

  res.json(machine);
});


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

  await machine.updateAttributes({ statusId: 3 });

  res.json(machine);
});


machineAPI.deleteMachine = asyncWrap(async (req, res, next) => {
  let machineId = req.params.machine_id;
  let machine = await checkMachineExist(machineId);

  await machine.updateAttributes({ statusId: 4 });

  res.json(machine);
});


export default machineAPI;

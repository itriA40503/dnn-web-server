import express from 'express';
import admin from './admin';
import machine from './machine';

const router = express.Router();
const adminRouter = express.Router();
const machineRouter = express.Router();

machineRouter.post('/', machine.createMachine);
machineRouter.put('/:machine_id', machine.modifyMachine);
machineRouter.put('/:machine_id/enable', machine.enableMachine);
machineRouter.put('/:machine_id/disable', machine.disableMachine);
machineRouter.delete('/:machine_id', machine.deleteMachine);

adminRouter.use('/machine', machineRouter);
router.use('/admin', adminRouter);

export default router;

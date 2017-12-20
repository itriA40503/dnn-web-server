import express from 'express';
import admin from './admin';
import machine from './machine';
import mail from './mail';

const router = express.Router();
const adminRouter = express.Router();
const machineRouter = express.Router();
const machinesRouter = express.Router();

const mailRouter = express.Router();

/* Todo: add admin authentication */

machineRouter.post('/', machine.createMachine);
machineRouter.put('/:machine_id', machine.modifyMachine);
machineRouter.put('/:machine_id/enable', machine.enableMachine);
machineRouter.put('/:machine_id/disable', machine.disableMachine);
machineRouter.delete('/:machine_id', machine.deleteMachine);

machinesRouter.get('/', machine.getAllExistMachine);

mailRouter.post('/', mail.checkMail);

adminRouter.use('/machine', machineRouter);
adminRouter.use('/machines', machinesRouter);
adminRouter.use('/mail', mailRouter);
router.use('/admin', adminRouter);

export default router;

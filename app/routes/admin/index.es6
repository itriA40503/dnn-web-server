import express from 'express';
import admin from './admin';
import machine from './machine';
import mail from './mail';
import resource from './resource';
import jwtAuth from '../../middleware/jwtAuth';

const router = express.Router();
const adminRouter = express.Router();
const machineRouter = express.Router();
const machinesRouter = express.Router();
const resourceRouter = express.Router();
const mailRouter = express.Router();

/* Todo: add admin authentication */

machineRouter.post('/', machine.createMachine);
machineRouter.put('/:machine_id', machine.modifyMachine);
machineRouter.put('/:machine_id/enable', machine.enableMachine);
machineRouter.put('/:machine_id/disable', machine.disableMachine);
machineRouter.delete('/:machine_id', machine.deleteMachine);

machinesRouter.get('/', machine.getAllExistMachine);

mailRouter.post('/', jwtAuth.Admin, mail.checkMail);

resourceRouter.post('/', resource.createResource);
resourceRouter.get('/', resource.getResource);
resourceRouter.put('/:resId', resource.modifyResource);
resourceRouter.delete('/:resId', resource.deleteResource);

adminRouter.use('/machine', machineRouter);
adminRouter.use('/machines', machinesRouter);
adminRouter.use('/mail', mailRouter);
adminRouter.use('/resource', resourceRouter);

router.use('/admin', adminRouter);

export default router;

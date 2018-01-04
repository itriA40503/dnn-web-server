import express from 'express';
import admin from './admin';
import machine from './machine';
import mail from './mail';
import user from './user';
import resource from './resource';
import jwtAuth from '../../middleware/jwtAuth';

const router = express.Router();
const adminRouter = express.Router();
const machineRouter = express.Router();
const machinesRouter = express.Router();
const resourceRouter = express.Router();
const mailRouter = express.Router();
const usersRouter = express.Router();
const userRouter = express.Router();

/* Todo: add admin authentication */

machineRouter.post('/', machine.createMachine);
machineRouter.put('/:machine_id', machine.modifyMachine);
machineRouter.put('/:machine_id/enable', machine.enableMachine);
machineRouter.put('/:machine_id/disable', machine.disableMachine);
machineRouter.delete('/:machine_id', machine.deleteMachine);

machinesRouter.get('/', machine.getAllExistMachine);

mailRouter.post('/', mail.checkMail);

usersRouter.get('/detail', user.getUserList);

userRouter.post('/:userId/resource', user.createAvailableRes);
userRouter.get('/:userId/resources', user.getAvailableRes);
userRouter.put('/:userId/resource/:resId', user.modifyAvailableRes);
userRouter.delete('/:userId/resource/:resId', user.deleteAvailableRes);
userRouter.post('/:userId/transaction', user.createTrans);
userRouter.post('/', user.createUser);

resourceRouter.post('/', resource.createResource);
resourceRouter.get('/', resource.getResource);
resourceRouter.put('/:resId', resource.modifyResource);
resourceRouter.delete('/:resId', resource.deleteResource);

adminRouter.use('/machine', jwtAuth.Admin, machineRouter);
adminRouter.use('/machines', jwtAuth.Admin, machinesRouter);
adminRouter.use('/mail', jwtAuth.Admin, mailRouter);
adminRouter.use('/resource', jwtAuth.Admin, resourceRouter);
adminRouter.use('/users', jwtAuth.Admin, usersRouter);
adminRouter.use('/user', jwtAuth.Admin, userRouter);

router.use('/admin', adminRouter);

export default router;

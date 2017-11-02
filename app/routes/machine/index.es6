import express from 'express';
import machine from './machine';

const router = express.Router();
const machinesRouter = express.Router();

machinesRouter.get('/', machine.getMachines);
machinesRouter.get('/remain', machine.getMachineRemainInPeriod);
machinesRouter.get('/calendar', machine.getMachineRemainInMonth);

router.use('/machines', machinesRouter);

export default router;

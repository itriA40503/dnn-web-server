import express from 'express';
import machine from './machine';

const router = express.Router();

router.get('/', machine.getMachines);
router.post('/', machine.createMachine);
router.get('/remain', machine.getMachineRemainInPeriod);
router.get('/calendar', machine.getMachineRemainInMonth);

export default router;

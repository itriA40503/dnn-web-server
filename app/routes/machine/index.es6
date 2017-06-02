import express from 'express';
import machine from './machine';

const router = express.Router();

router.get('/', machine.getMachines);
router.get('/remain', machine.getMachineRemainInPeriod);
router.get('/calendar', machine.getMachineRemainInMonth);

export default router;

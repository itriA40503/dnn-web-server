import express from 'express';
import schedule from './schedule';

const router = express.Router();

router.get('', schedule.getAllSchedule);

export default router;

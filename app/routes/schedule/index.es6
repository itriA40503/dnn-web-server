import express from 'express';
import schedule from './schedule';

const router = express.Router();
const schedulesRouter = express.Router();

schedulesRouter.get('/', schedule.getAllSchedule);
schedulesRouter.delete('/', schedule.removeAll);

router.use('/schedules', schedulesRouter);

export default router;

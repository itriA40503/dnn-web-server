import express from 'express';
import schedule from './statistic';

const router = express.Router();
const scheduleRouter = express.Router();

scheduleRouter.get('/', schedule.get);
scheduleRouter.post('/', schedule.create);
scheduleRouter.put('/:schedule_id', schedule.update);
scheduleRouter.delete('/:schedule_id', schedule.delete);
scheduleRouter.get('/:schedule_id/extendable', schedule.getExtendableDate);

router.use('/statistic', scheduleRouter);

export default router;


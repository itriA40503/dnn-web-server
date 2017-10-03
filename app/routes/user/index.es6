import express from 'express';
import login from './login';
import report from './report';
import schedule from './schedule';
import jwtAuth from '../../middleware/jwtAuth';

const router = express.Router();
const scheduleRouter = express.Router();
const schedulesRouter = express.Router();

scheduleRouter.get('/:schedule_id', schedule.getASchedule);
scheduleRouter.post('/', schedule.create);
scheduleRouter.put('/:schedule_id', schedule.update);
scheduleRouter.delete('/:schedule_id', schedule.delete);
scheduleRouter.put('/:schedule_id/restart', schedule.restart);
scheduleRouter.get('/:schedule_id/extendable', schedule.getExtendableDate);

schedulesRouter.get('/', schedule.get);
schedulesRouter.get('/reserved', schedule.getReserved);
schedulesRouter.get('/history', schedule.getHistory);

router.post('/report', jwtAuth, report);
router.get('/signin', login);
router.use('/schedule', jwtAuth, scheduleRouter);
router.use('/schedules', jwtAuth, schedulesRouter);

export default router;


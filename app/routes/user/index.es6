import express from 'express';
import login from './login';
import report from './report';
import schedule from './schedule';
import jwtAuth from '../../middleware/jwtAuth';

const router = express.Router();
const scheduleRouter = express.Router();

scheduleRouter.get('/:schedule_id', schedule.getASchedule);
scheduleRouter.get('/', schedule.get);
scheduleRouter.post('/', schedule.create);
scheduleRouter.put('/:schedule_id', schedule.update);
scheduleRouter.delete('/:schedule_id', schedule.delete);
scheduleRouter.get('/:schedule_id/extendable', schedule.getExtendableDate);


router.post('/report', jwtAuth, report);
router.get('/signin', login);
router.use('/schedule', jwtAuth, scheduleRouter);

export default router;


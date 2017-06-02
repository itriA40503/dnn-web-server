import express from 'express';
import login from './login'
import schedule from './schedule'
import jwtAuth from '../../middleware/jwtAuth';

const router = express.Router();
const scheduleRouter = express.Router();

scheduleRouter.get('/', schedule.get);
scheduleRouter.post('/', schedule.create);
scheduleRouter.put('/:schedule_id', schedule.update);
scheduleRouter.delete('/:schedule_id', schedule.delete);
scheduleRouter.get('/:schedule_id/extendable', schedule.getExtendableDate);

router.get('/signin', login);
router.use('/schedule', jwtAuth, scheduleRouter);

export default router;


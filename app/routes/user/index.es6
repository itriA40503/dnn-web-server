import express from 'express';
import login from './login';
import report from './report';
import schedule from './schedule';
import resource from './resource';
import jwtAuth from '../../middleware/jwtAuth';

const rootRouter = express.Router();
const router = express.Router();
const userRouter = express.Router();
const scheduleRouter = express.Router();
const schedulesRouter = express.Router();
const resourcesRouter = express.Router();
const resourceRouter = express.Router();

scheduleRouter.get('/:schedule_id', schedule.getASchedule);
scheduleRouter.post('/', schedule.create);
scheduleRouter.put('/:schedule_id', schedule.update);
scheduleRouter.delete('/:schedule_id', schedule.delete);
scheduleRouter.put('/:schedule_id/restart', schedule.restart);
scheduleRouter.get('/:schedule_id/extendable', schedule.getExtendableDate);

schedulesRouter.get('/', schedule.get);
schedulesRouter.get('/reserved', schedule.getReserved);
schedulesRouter.get('/history', schedule.getHistory);

resourcesRouter.get('/', resource.get);

resourceRouter.get('/remind', resource.remind);
resourceRouter.get('/calendar', resource.getCalendar);

userRouter.post('/report', jwtAuth.User, report);
userRouter.get('/signin', login);
userRouter.use('/schedule', jwtAuth.User, scheduleRouter);
userRouter.use('/schedules', jwtAuth.User, schedulesRouter);
userRouter.use('/resources', jwtAuth.User, resourcesRouter);
userRouter.use('/resource', jwtAuth.User, resourceRouter);

router.use('/user', userRouter);

export default router;


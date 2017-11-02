import express from 'express';
import statistic from './statistic';

const router = express.Router();
const statisticRouter = express.Router();
const imagesRouter = express.Router();

imagesRouter.get('/used', statistic.imageTotalUsed);

statisticRouter.use('/images', imagesRouter);

router.use('/statistic', statisticRouter);

export default router;


import express from 'express';
import statistic from './statistic';

const router = express.Router();

router.use('/images/used', statistic.imageTotalUsed);

export default router;


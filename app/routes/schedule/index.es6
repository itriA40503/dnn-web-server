import express from 'express';
import { schedule as Schedule } from '../../models/index';

const router = express.Router();

router.get('', (req, res, next) => {

  let startedAt = (req.query && req.query.startedAt);
  let endedAt = (req.query && req.query.endedAt);

  const getSchedule = async () => {
    try {
      let date = new Date();
      let options = {
        start: startedAt,
        end: endedAt
      };

      let schedules = await Schedule.scope({ method: ['normal', options] }).findAll();
      res.json(schedules);
    } catch (err) {
      next(err);
    }
  };
  getSchedule();
});


export default router;

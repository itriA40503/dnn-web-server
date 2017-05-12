import express from 'express';
import CdError from '../util/CdError';
import { image as Image } from '../models';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let images = await Image.scope('normal').findAll();
    res.json({
      images: images
    });
  } catch (err) {
    next(err);
  }
});

export default router;

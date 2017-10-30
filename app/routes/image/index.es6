import express from 'express';
import image from './image';

const router = express.Router();

router.get('/', image.getLatest);
router.put('/', image.update);

export default router;

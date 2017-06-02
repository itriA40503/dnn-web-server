import express from 'express';
import image from './image';

const router = express.Router();

router.get('/', image);

export default router;

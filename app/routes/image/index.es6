import express from 'express';
import image from './image';

const router = express.Router();
const imageRouter = express.Router();
const imagesRouter = express.Router();

imagesRouter.get('/', image.getLatest);
imageRouter.get('/:image_id', image.getByIdOrDigest);
imageRouter.put('/:image_id', image.update);

router.use('/images', imagesRouter);
router.use('/image', imageRouter);

export default router;

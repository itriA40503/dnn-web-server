import express from 'express';
import image from './image';
import jwtAuth from '../../middleware/jwtAuth';

const router = express.Router();
const imageRouter = express.Router();
const imagesRouter = express.Router();

imagesRouter.get('/', image.getLatest);
imageRouter.get('/:image_id', image.getByIdOrDigest);
imageRouter.put('/:image_id', image.update);

router.use('/images', jwtAuth.User, imagesRouter);
router.use('/image', jwtAuth.User, imageRouter);

export default router;

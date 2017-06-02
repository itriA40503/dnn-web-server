import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { image as Image } from '../../models/index';

const image = asyncWrap(async (req, res, next) => {
  let images = await Image.scope('normal').findAll();
  res.json({
    images: images
  });
});

export default image;

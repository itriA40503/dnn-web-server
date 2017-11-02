import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import db from '../../db/db';
import { image as Image } from '../../models/index';

const image = {};

image.getByIdOrDigest = asyncWrap(async (req, res, next) => {
  let id = req.params.image_id;
  let image = await db.getImageByIdOrDigest(id);
  if (!image) throw new CdError(401, 'No specific image.');

  res.json(image);
});

image.getLatest = asyncWrap(async (req, res, next) => {
  let images = await db.getLatestImage();
  let newImages = images.reduce((list, image) => {
    let imageP = image.get({ plain: true });
    if (imageP.sort === '1' && !imageP.label.includes('Disable')) {
      delete imageP.sort;
      list.push(imageP);
    }
    return list;
  }, []);

  res.json({
    images: newImages
  });
});

image.update = asyncWrap(async (req, res, next) => {
  let imageId = req.params.image_id;
  let description = req.query.description || (req.body && req.body.description);

  let options = {
    description: description
  };
  let image = db.updateImage(imageId, options);

  res.json({
    images: image
  });
});

export default image;

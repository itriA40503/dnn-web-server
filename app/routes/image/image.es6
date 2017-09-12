import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import db from '../../db/db';
import { image as Image } from '../../models/index';

const image = asyncWrap(async (req, res, next) => {
  /* let images = await Image.scope('normal').findAll();
  res.json({
    images: images
  });*/
  let images = await db.getLatestImage().findAll();
  

  let newImages = images.reduce((list, image) => {
    let imageP = image.get({ plain: true });
    if (imageP.sort === '1') {
      delete imageP.sort;
      list.push(imageP);
    }
    return list;
  }, []);

  res.json({
    images: newImages
  });
});

export default image;

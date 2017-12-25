import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { sendMail } from '../../mailer/mailer';

const mailAPI = {};

mailAPI.checkMail = asyncWrap(async (req, res, next) => {
  let receiver = (req.query && req.query.receiver) || (req.body && req.body.receiver);
  let title = (req.query && req.query.title) || (req.body && req.body.title) || 'checkMail';
  let text = (req.query && req.query.text) || (req.body && req.body.text) || 'send from server';
  
  if (!receiver) throw new CdError(401, 'Receiver not input!!');
  
  await sendMail(receiver, title, text);  
  res.json('sendMail');
});

export default mailAPI;

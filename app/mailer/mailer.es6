import nodemailer from 'nodemailer';
import config from '../config';

// const env = process.env.NODE_ENV || 'development';
const mailConfig = config.mailer;

// console.log(mailConfig);

let transporter = nodemailer.createTransport(mailConfig.smtpSetting);
let mailOptions = mailConfig.alarmMailOptions;

export const sendAlarm = () => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    return console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

export const sendMail = (receiver, title, text) => {
  mailOptions.to = receiver;
  mailOptions.subject = title;
  mailOptions.text = text;
  mailOptions.html = `<p><b>${text}</b><p><br/><p><img src="https://cdn.awwni.me/wa2w.jpg"/></p>`;
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    return console.log('Message %s sent: %s', info.messageId, info.response);
  });  
};

// export {
//   sendAlarm
// };

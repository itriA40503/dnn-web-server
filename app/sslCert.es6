import fs from 'fs';
import path from 'path';

const keyPath = path.join(__dirname, '../ssl/ccmacd.key');
const crtPath = path.join(__dirname, '../ssl/ccmacnpm rund.crt');
const cdKey = fs.readFileSync(keyPath);
const cdCert = fs.readFileSync(crtPath);
const ssl = {
  options: {
    key: cdKey,
    cert: cdCert
  }
};

module.exports = ssl;

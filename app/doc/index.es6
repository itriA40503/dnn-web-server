import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import config from '../config';

let doc = YAML.load(path.join(__dirname, '../../api/swagger.yaml'));
doc.host = `${config.apidoc.host}:${config.apidoc.port}`;

const options = {
  customSiteTitle: 'DNN Fram API Doc',
  customCss: '.topbar .wrapper {display: none;} .swagger-ui .topbar {background-color: #01579B}',  
  customfavIcon: '../../favicon.ico',
  explorer: false,
  swaggerOptions: {
    validatorUrl: null
  }
};

export default (app) => {
  app.use('/apidoc', swaggerUi.serve, swaggerUi.setup(doc, options));
};

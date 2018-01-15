import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const doc = YAML.load(path.join(__dirname, '../../api/swagger.yaml'));
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
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc, options));
};

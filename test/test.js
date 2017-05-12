const app = require('../app');
const supertest = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const request = chai.request(app);

const User = require('../models').dnnUser;
const Schedule = require('../models').schedule;
const Instance = require('../models').instance;
const Machine = require('../models').machine;
const Image = require('../models').image;

describe('server', () => {

  before( done => {
    (async () => {
      await User.create({
        id: 999999999,
        itriId: 'mocha-test'
      });
      await Machine.create({
        id: 999999999,
        name: 'mocha-test-m',
        gpuAmount: 4,
        gpuType: 'TITAN X',
        statusId: 1
      });
      await Image.create({
        id: 999999999,
        name: 'mocha-image',
        path: '//mocha'
      });
      await Schedule.create({
        id: 999999999,
        startedAt: new Date(),
        endedAt: new Date(),
        statusId: 1,
        instance: {
          id: 999999999,
          machineId: 999999999,
          ip: '255.255.255.255',
          port: 55555,
          username: 'mocha-test-i',
          password: 'pw',
          statusId: 1,
          imageId: 999999999
        },
        userId: 999999999
      },{
        include: [ Instance ]
      });
      done();
    })();
  });

  after( done => {
    (async () => {
      let schedules = await Schedule.findAll({
        where: {userId: 999999999},
        include: [Instance]
      });
      let instances = await schedules.map((schedule) => {
        return []
      });
      await instances.map(async (instance) => {
        await instance.destroy({ force: true });
        return instance;
      });
     /* await Instance.destroy({
        force: true,
        where: {
          id: 999999999,
        }
      });;*/
      await Image.destroy({
        force: true,
        where: {
          id: 999999999,
        }
      });
      await Machine.destroy({
        force: true,
        where: {
          id: 999999999,
        }
      });
      await User.destroy({
        force: true,
        where: {
          itriId: 'mocha-test'
        }
      })
      done();
    })();
  });

  describe('server loading', () => {

    it('index', done => {
      request
        .get('/')
        .end( (err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('404 for not found', (done) => {
      request
        .get('/foo/bar')
        .end( (err, res) => {
          res.should.have.status(404);
          res.should.to.be.html;
          done();
        });
    });

  });

  describe('user', () => {

  });

  describe('schedule', () => {

  });
});
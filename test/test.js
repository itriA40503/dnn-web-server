const app = require('../build/app');
const supertest = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const moment = require('moment');
chai.use(chaiHttp);

const request = chai.request(app);

const User = require('../build/models').dnnUser;
const Schedule = require('../build/models').schedule;
const Container = require('../build/models').container;
const Port = require('../build/models').port;
const Machine = require('../build/models').machine;
const Image = require('../build/models').image;

let userSetting = {
  id: 99999999,
  itriId: 'mochatest',
  password: 'password',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI5OTk5OTk5OSIsIml0cmlJZCI6Im1vY2hhdGVzdCIsImV4cGlyZXMiOjE1MDM0NzUwMjIuODUxfQ.r0cgCB-LTmO7yl1en14uSii1I2mZU8XwXfW2kcHGKH8'
}

let scheduleSetting = {
  start: moment('2019-01-01T00:00:00.000Z'),
  end: moment('2019-01-15T00:00:00.000Z')
}

let currentScheduleSetting = {
  start: moment(),
  end: moment().add(1, 'days')
}
let images = [];
let schedules = [];
let machines = [];
let machineCalendar = [];

describe('server', () => {

  before( done => {
    (async () => {
      console.log("before");
      let result = await User.create({
        id: userSetting.id,
        itriId: userSetting.itriId,
        typeId:1
      });
      done();
    })();
  });


  after( done => {
    (async () => {
      try {
        let schedules = await Schedule.scope('detail').findAll({
          where: {userId: userSetting.id},
        });
        let scheduleIds = await schedules.reduce((sId, schedule) => {
          sId.push(schedule.id);
          return sId;
        },[]);
        await Port.destroy({
          force: true,
          where: {
            containerId: scheduleIds
          }
        })
        await Container.destroy({
          force: true,
          where: {
            id: scheduleIds
          }})
        await Schedule.destroy({
          force: true,
          where: {
            id: scheduleIds
          }})
        await User.destroy({
          force: true,
          where: {
            itriId: userSetting.itriId
          }
        })
        done();
      } catch (err) {
        console.log(err);
        done();
      }
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
    it('Sign In', done => {
      request
        .get('/user/signin')
        .set('Accept', 'application/json')
        .set('x-username', userSetting.itriId)
        .set('x-password', userSetting.password)
        .end( (err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('token');
          userSetting.token = res.body.token;
          done();
        });
    });
  });

  describe('image', () => {
    it('Get Image List', done => {
      request
        .get('/image')
        .set('Accept', 'application/json')
        .end( (err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('images');
          images = res.body.images;
          done();
        });
    });
  });

  describe('machine', () => {
    it('Get Machine List', done => {
      request
        .get('/machine')
        .set('Accept', 'application/json')
        .end( (err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('machines');
          machines = res.body.machines;
          console.log(res.body);
          done();
        });
    });
    it('Get Machine Available Calender', done => {
      request
        .get('/machine/calendar')
        .set('Accept', 'application/json')
        .end( (err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('availableCalendar');
          machineCalendar = res.body.availableCalendar;
          console.log(res.body);
          done();
        });
    });
    it('Get Available machines during specific date range', done => {
      let dateRange = {
        start: scheduleSetting.start.format(),
        end: scheduleSetting.end.format()
      }
      request
        .get('/machine/remain')
        .set('Accept', 'application/json')
        .send(dateRange)
        .end( (err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('availableNumber');
          res.body.should.have.property('machines');
          console.log(res.body);
          done();
        });
    });
  });

  describe('user schedule', () => {
    let resSchedule = {};

    describe('Get user\'s schedule list', () => {
      let scheduleType = {
        all: {
          mode: 'all'
        },
        history: {
          mode: 'history'
        },
        inProgress: {
          mode: 'booked'
        }
      }

      it('All', done => {
        request
          .get('/user/schedule')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .query(scheduleType.all)
          .end((err,res) => {
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.have.property('schedules');
            res.body.should.have.property('historySchedules');
            console.log(res.body);
            done();
          });
      });
      it('History', done => {
        request
          .get('/user/schedule')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .query(scheduleType.history)
          .end((err,res) => {
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.not.have.property('schedules');
            res.body.should.have.property('historySchedules');
            console.log(res.body);
            done();
          });
      });
      it('In Progress', done => {
        request
          .get('/user/schedule')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .query(scheduleType.inProgress)
          .end((err,res) => {
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.have.property('schedules');
            res.body.should.not.have.property('historySchedules');
            console.log(res.body);
            done();
          });
      });
    });
    describe('Create schedule', () => {

      it('Create a schedule', done => {
        let scheduleOptions = {
          start: scheduleSetting.start.format(),
          end: scheduleSetting.end.format(),
        }

        request
          .post('/user/schedule')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .send(scheduleOptions)
          .end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.have.property('id')
            resSchedule = res.body;
            done();
          })
      });

    });
    describe('Update schedule', () => {

      it('Update schedule', done => {
        let scheduleOptions = {
          end: scheduleSetting.end.add(2,'d').format(),
        }

        request
          .put(`/user/schedule/${resSchedule.id}`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .send(scheduleOptions)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.have.property('id')
            resSchedule = res.body;
            console.log(res.body);
            done();
          })
      });
    });
    describe('Delete schedule', () => {

      it('Delete schedule', done => {

        request
          .delete(`/user/schedule/${resSchedule.id}`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(200);
            console.log(res.body)
            done();
          })
      });
    });

    describe('Create schedule instantly', () => {

      it('Create a schedule', done => {
        let scheduleOptions = {
          start: currentScheduleSetting.start.format(),
          end: currentScheduleSetting.end.format(),
        }

        request
          .post('/user/schedule')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .send(scheduleOptions)
          .end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.have.property('id')
            resSchedule = res.body;
            done();

          })
      });
      it('Get schedule', done => {
        let scheduleOptions = {
          start: currentScheduleSetting.start.format(),
          end: currentScheduleSetting.end.format(),
        }
        setTimeout( () => {
          request
            .get(`/user/schedule/${resSchedule.id}`)
            .set('x-access-token', userSetting.token)
            .set('Accept', 'application/json')
            .end((err, res) => {
              console.log(res.body);
              res.should.have.status(200);
              res.should.to.be.json;
              res.body.should.have.property('id')
              resSchedule = res.body;
              done();
            })
        }, 6000);

      }).timeout(10000);;
      it('Delete schedule', done => {
        request
          .delete(`/user/schedule/${resSchedule.id}`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .end((err, res) => {
            res.should.have.status(200);
            console.log(res.body)
            done();
          })
      });
    });

  });
});
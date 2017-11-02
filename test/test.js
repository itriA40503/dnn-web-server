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

let machineSetting = {
  label: 'm24',
  name: 'm24',
  gpuAmount: 1,
  gpuType: 'v100'
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
      await User.create({
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
        await Machine.destroy({
          force: true,
          where: {
            label: machineSetting.label
          }
        });
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
        .get('/images')
        .set('Accept', 'application/json')
        .end( (err, res) => {
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('images');
          images = res.body.images;
          console.log(images);
          done();
        });
    });
  });

  describe('machine', () => {
    it('Get Machine List', done => {
      request
        .get('/machines')
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
        .get('/machines/calendar')
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
        .get('/machines/remain')
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

      it('All', done => {
        request
          .get('/user/schedules')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
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
          .get('/user/schedules/history')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
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
          .get('/user/schedules/reserved')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
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
          imageId: images[0].id
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
      let extendableLatestDate;
      it('Get schedule extendable date', done => {
        request
          .get(`/user/schedule/${resSchedule.id}/extendable`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.have.property('extendableLatestDate')
            extendableLatestDate = res.body.extendableLatestDate;
            done();
          })
      });
      it('Update schedule', done => {
        let scheduleOptions = {
          end: moment(extendableLatestDate).format() || scheduleSetting.end.add(2,'d').format(),
        }

        request
          .put(`/user/schedule/${resSchedule.id}`)
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
      let resSchedule = {};
      it('Create a schedule', done => {
        let scheduleOptions = {
          start: currentScheduleSetting.start.format(),
          end: currentScheduleSetting.end.format(),
          imageId: images[0].id
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
            res.body.statusId.should.equal(8);
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
              res.body.statusId.should.equal(3);
              resSchedule = res.body;
              done();
            })
        }, 6000);

      }).timeout(9000);
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


  describe('admin', () => {
    describe('machine maintain', () => {
      let resMachine = {}
      it('create', done => {
        request
          .post('/admin/machine')
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .send(machineSetting)
          .end((err,res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.should.to.be.json;
            resMachine = res.body;
            done();
          });
      });
      it('wrong id', done => {
        request
          .put(`/admin/machine/1234564874874`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .send({
            gpuAmount: 2,
            gpuType: 'GTX1080'
          })
          .end((err,res) => {
            res.should.have.status(401);
            res.should.to.be.json;
            done();
          });
      })


      it('disable', done => {
        request
          .put(`/admin/machine/${resMachine.id}/disable`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .end((err,res) => {
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.statusId.should.equal(3);
            console.log(res.body);
            done();
          });
      })

      it('enable', done => {
        request
          .put(`/admin/machine/${resMachine.id}/enable`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .end((err,res) => {
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.statusId.should.equal(1);
            console.log(res.body);
            done();
          });
      })

      let resSchedule = {};
      it('Create a schedule', done => {
        let scheduleOptions = {
          start: currentScheduleSetting.start.format(),
          end: currentScheduleSetting.end.format(),
          imageId: images[0].id,
          machineId: resMachine.id
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
            res.body.statusId.should.equal(8);
            resSchedule = res.body;
            done();

          })
      });
      it('Get schedule', done => {
        setTimeout( () => {
          request
            .get(`/user/schedule/${resSchedule.id}`)
            .set('x-access-token', userSetting.token)
            .set('Accept', 'application/json')
            .end((err, res) => {
              console.log(res.body);
              res.should.have.status(200);
              res.should.to.be.json;
              res.body.statusId.should.equal(3);
              res.body.machine.id.should.equal(resMachine.id);
              done();
            })
        }, 6000);

      }).timeout(9000);
      it('modify machine', done => {
        request
          .put(`/admin/machine/${resMachine.id}`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .send({
            gpuAmount: 2,
            gpuType: 'GTX1080'
          })
          .end((err,res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.gpuAmount.should.equal(2);
            done();
          });
      })
      it('Get schedule', done => {
        setTimeout( () => {
          request
            .get(`/user/schedule/${resSchedule.id}`)
            .set('x-access-token', userSetting.token)
            .set('Accept', 'application/json')
            .end((err, res) => {
              console.log(res.body);
              res.should.have.status(200);
              res.should.to.be.json;
              res.body.statusId.should.equal(3);
              res.body.machine.id.should.equal(resMachine.id);
              resSchedule = res.body;
              done();
            })
        }, 7000);

      }).timeout(9000);


      it('destory', done => {
        request
          .delete(`/admin/machine/${resMachine.id}`)
          .set('x-access-token', userSetting.token)
          .set('Accept', 'application/json')
          .end((err,res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.statusId.should.equal(4);
            done();
          });
      })
    })
  })
});
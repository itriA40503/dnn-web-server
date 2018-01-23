const app = require('../build/app');
const supertest = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const moment = require('moment');
chai.use(chaiHttp);
const request = chai.request(app);
// Models
const User = require('../build/models').dnnUser;
const Schedule = require('../build/models').schedule;
const Container = require('../build/models').container;
const Port = require('../build/models').port;
const Machine = require('../build/models').machine;
const Image = require('../build/models').image;
const AvailableRes = require('../build/models').availableRes;
const ResInfo = require('../build/models').resInfo;
const Transaction = require('../build/models').transaction;
const UsageLog = require('../build/models').usageLog;
// Testing data
const userSetting = {
  id: 99999999,
  itriId: 'mochatest'.toUpperCase(),
  password: 'password',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5OTk5OTk5LCJpdHJpSWQiOiJNT0NIQVRFU1QiLCJleHBpcmVzIjoxNTI0OTg2NTQyLjU2OCwiYXV0aG9yaXR5IjoxfQ.p4podVnfQVPnW3znDyvFZlHlalMG07OQvcNeLC13x58'
};
const adminSetting = {
  id: 99999998,
  itriId: 'mochatest2'.toUpperCase(),
  password: 'password',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5OTk5OTk4LCJpdHJpSWQiOiJNT0NIQVRFU1QyIiwiZXhwaXJlcyI6MTUyNDk4NjM0OC4zNjEsImF1dGhvcml0eSI6Mn0.7FtRT0RV1EZNk1VN8VcjKCnsNBKwGag4y7cuGzQEjsM'
};
const resourceSetting = {
  id: 99999,  
  gpuType: 'v999',
  machineType: 'DGX99',
  valueUnit: 'd',
  value: 10
};
const machineSetting = {
  id: 99999,
  label: 'm99',
  name: 'm99',
  resId: resourceSetting.id,
  gpuAmount: 2,
  gpuType: 'v999'
};
const transactionSetting = {
  id: 99999,  
  addValue: 899,
  userId: 99999999, // setting this transaction to user(99999999)
  info: 'add value'
};
const imageSetting = {
  id: '9999',
  name: 'bayonetta',
  label: 'bayonetta'
};
const scheduleSetting = {
  start: moment('2020-01-01T00:00:00.000Z'),
  end: moment('2020-01-15T00:00:00.000Z')
};
const currentScheduleSetting = {
  start: moment(),
  end: moment().add(1, 'days')
};
const availableResSetting = {
  id: '99999',
  userId: userSetting.id,
  resId: resourceSetting.id,
  amount: machineSetting.gpuAmount  
};
let images = [];
let schedules = [];
let machines = [];
let machineCalendar = [];

describe('Api server testing', () => {
  let resourceFromApi = {};
  let machineFromApi = {};
  let userFromApi = {};
  let transactionFromApi = {};
  let availableResFromApi = {};
  let scheduleFromApi = {};
  before( done => {
    (async () => {
      try{
        console.log("test before");

        console.log("image create");
        await Image.create(imageSetting);

        console.log("admin create");
        await User.create({
          id: adminSetting.id,
          itriId: adminSetting.itriId,
          typeId:2
        }); 

        console.log("User create");
        await User.create({
          id: userSetting.id,
          itriId: userSetting.itriId,
          typeId:1
        });

        console.log("Resource create");
        await ResInfo.create(resourceSetting);

        console.log("Machine create");
        await Machine.create(machineSetting);

        console.log("Transaction create")
        await Transaction.create(transactionSetting);

        console.log("Available resource create");
        await AvailableRes.create(availableResSetting);

        done();
      }catch(err){
        console.log(err);
      }
    })();
  });
  after( done => {
    (async () => {
      try { 
        console.log("test after");
        const schedules = await Schedule.scope('detail').findAll({
          where: {userId: userSetting.id},
        });
        const scheduleIds = await schedules.reduce((sId, schedule) => {
          sId.push(schedule.id);
          return sId;
        },[]);
        console.log("remove port form container created");
        await Port.destroy({
          force: true,
          where: {
            containerId: scheduleIds
          }
        });
        console.log("remove container form schdeule created");
        await Container.destroy({
          force: true,
          where: {
            id: scheduleIds
          }
        });
        console.log("remove usageLog form schdeule created");
        await UsageLog.destroy({
          force: true,
          where: {
            scheduleId: scheduleIds
          }
        });
        console.log("remove schdeule form api created");
        await Schedule.destroy({
          force: true,
          where: {
            id: scheduleIds
          }})
        console.log("remove schedule form api created");
        await Schedule.destroy({
          force: true,
          where: {
            id: scheduleFromApi.id
          }
        });
        console.log("remove image");
        await Image.destroy({
          force: true,
          where: {
            id: imageSetting.id
          }
        });
        console.log('remove available resource');
        await AvailableRes.destroy({
          force: true,
          where: {
            id: availableResSetting.id
          }
        });        
        console.log('remove available resource form api created');
        await AvailableRes.destroy({
          force: true,
          where: {
            id: availableResFromApi.id
          }
        });
        console.log('remove transaction')
        await Transaction.destroy({
          force: true,
          where: {
            id: transactionSetting.id
          }
        });
        console.log('remove transaction form api created')
        await Transaction.destroy({
          force: true,
          where: {
            id: transactionFromApi.id
          }
        });
        console.log('remove machine')
        await Machine.destroy({
          force: true,
          where: {
            id: machineSetting.id
          }
        });
        console.log('remove machine form api created')
        await Machine.destroy({
          force: true,
          where: {
            id: machineFromApi.id
          }
        });
        console.log('remove resource')
        await ResInfo.destroy({
          force: true,
          where: {
            id: resourceSetting.id
          }
        });
        console.log('remove resource form api created')
        await ResInfo.destroy({
          force: true,
          where: {
            id: resourceFromApi.id
          }
        });
        console.log('remove user')
        await User.destroy({
          force: true,
          where: {
            itriId: userSetting.itriId
          }
        });
        console.log('remove user from api created')
        await User.destroy({
          force: true,
          where: {
            itriId: userFromApi.itriId
          }
        });
        console.log('remove admin')
        await User.destroy({
          force: true,
          where: {
            itriId: adminSetting.itriId
          }
        });
        done();
      } catch (err) {
        console.log(err);
        done();
      }
    })();
  });
  describe('Server loading', () => {
    it('Index', done => {
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
  describe('Admin', () => {
    describe('Resource maintain', () => {
      const settingResource = {        
        gpuType: 'v999',
        machineType: 'DGX',
        valueUnit: 'd',
        value: 10
      };      
      const modifyResource = {
        gpuType: 'v9999',
        machineType: 'DGX99',
        valueUnit: 'w',
        value: 5
      };      
      it('create', done => {
        request
        .post('/admin/resource')
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(settingResource)
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(settingResource, res.body);
          resourceFromApi = res.body;
          done();
        });
      });
      it('update', done => {
        request
        .put(`/admin/resource/${resourceFromApi.id}`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(modifyResource)
        .end((err,res) => {
          console.log(res.body);          
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(modifyResource, res.body);
          resourceFromApi = res.body;
          done();
        });
      });
      it('get', done => {
        request
        .get(`/admin/resources/`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(`length:${res.body.length}`);
          res.body.should.have.lengthOf.above(1);
          res.body.should.include.deep.members([resourceFromApi]);          
          res.should.have.status(200);
          res.should.to.be.json;          
          done();
        });
      });
      it('delete', done => {
        request
        .delete(`/admin/resource/${resourceFromApi.id}`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          resourceFromApi = res.body;
          done();
        });
      });
    });
    describe('Machine maintain', () => {
      const settingMachine = {        
        label: 'm300',
        name: 'm300',
        resId: 99999,
        gpuAmount: 2        
      };
      const modifyMachine = {
        description: 'ModifiedMachine',
        gpuAmount: 2        
      };
      it('Create', done => {
        request
        .post('/admin/machine')
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(settingMachine)
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(settingMachine, res.body);
          machineFromApi = res.body;
          done();
        });
      });
      it('Update', done => {
        request
        .put(`/admin/machine/${machineFromApi.id}`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(modifyMachine)
        .end((err,res) => {
          console.log(res.body);          
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(modifyMachine, res.body);
          machineFromApi = res.body;
          done();
        });
      });
      it('Get', done => {
        request
        .get(`/admin/machines/`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(`length:${res.body.length}`);
          res.body.should.have.lengthOf.above(0);          
          const getObj = res.body.find(obj => obj.id === machineFromApi.id);          
          checkObj(machineFromApi, getObj);
          res.should.have.status(200);
          res.should.to.be.json;          
          done();
        });
      });
      it('Disable', done => {
        request
        .put(`/admin/machine/${machineFromApi.id}/disable`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(res.body);          
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('statusId', 3);
          machineFromApi = res.body;
          done();
        });
      });
      it('Enable', done => {
        request
        .put(`/admin/machine/${machineFromApi.id}/enable`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(res.body);          
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('statusId', 1);
          machineFromApi = res.body;
          done();
        });
      });
      it('Delete', done => {
        request
        .delete(`/admin/machine/${machineFromApi.id}`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('statusId', 4);
          machineFromApi = res.body;
          done();
        });
      });
    });
    describe('User maintain', () => {
      const settingUser = {
        itriId: 'SUCKCOMPANY'
      };
      const settingTransacton = {
        addValue: 8787,
        info: 'organizationIsAwful'
      };
      const settingAvailRes = {
        amount: 2,
        resId:resourceSetting.id
      };
      const modifyAvailRes = {
        amount: 4,   
        resId:resourceSetting.id     
      };
      it('Create user', done => {
        request
        .post('/admin/user')
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(settingUser)
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(settingUser, res.body);
          userFromApi = res.body;
          done();
        });
      });
      it('Create user transaction', done => {
        request
        .post(`/admin/user/${userFromApi.id}/transaction`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(settingTransacton)
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(settingTransacton, res.body);
          transactionFromApi = res.body;
          done();
        });
      });
      it('Create user available resource', done => {
        request
        .post(`/admin/user/${userFromApi.id}/resource`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(settingAvailRes)
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(settingAvailRes, res.body);
          availableResFromApi = res.body;
          done();
        });
      });
      it('Update user available resource', done => {
        request
        .put(`/admin/user/${userFromApi.id}/resource/${availableResFromApi.id}`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .send(modifyAvailRes)
        .end((err,res) => {
          console.log(res.body);          
          res.should.have.status(200);
          res.should.to.be.json;
          checkObj(modifyAvailRes, res.body);
          availableResFromApi = res.body;
          done();
        });
      });
      it('Get user available resource', done => {
        request
        .get(`/admin/user/${userFromApi.id}/resources`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(`length:${res.body.length}`);
          res.body.should.have.lengthOf.above(0);
          res.should.have.status(200);
          res.should.to.be.json;          
          const getObj = res.body.find(obj => obj.id === availableResFromApi.id);          
          console.log(getObj);
          checkObj(availableResFromApi, getObj);
          done();
        });
      });
      it('Delete user available resource', done => {
        request
        .delete(`/admin/user/${userFromApi.id}/resource/${availableResFromApi.id}`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('deletedAt').not.equal(null);
          availableResFromApi = res.body;
          done();
        });
      });
      it('Get users information', done => {
        request
        .get(`/admin/users/detail`)
        .set('x-access-token', adminSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(`length:${res.body.length}`);
          res.body.should.have.lengthOf.above(2);
          res.should.have.status(200);
          res.should.to.be.json;
          done();
        });
      });
    });
  });
  describe('image', () => {
    const modifyImage = {
      description: 'bayonetta2'
    };
    it('update image', done => {
      request
      .put(`/image/${imageSetting.id}`)
      .set('x-access-token', userSetting.token)
      .set('Accept', 'application/json')
      .send(modifyImage)
      .end((err,res) => {
        console.log(res.body);          
        res.should.have.status(200);
        res.should.to.be.json;
        checkObj(modifyImage, res.body.image);
        done();
      });
    });
    it('get image by id', done => {
      request
      .get(`/image/${imageSetting.id}`)
      .set('x-access-token', userSetting.token)
      .set('Accept', 'application/json')        
      .end((err,res) => {
        console.log(res.body);        
        res.should.have.status(200);
        res.should.to.be.json;
        checkObj(imageSetting, res.body);
        done();
      });
    });
    it('get images', done => {
      request
      .get(`/images`)
      .set('x-access-token', userSetting.token)
      .set('Accept', 'application/json')        
      .end((err,res) => {        
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.have.property('images');
        const images = res.body.images;             
        const getObj = images.find(obj => obj.id === imageSetting.id);
        console.log(getObj);
        checkObj(imageSetting, getObj);        
        done();
      });
    });
  });
  describe('User', () => {
    describe('Signin', () => {
      it('Normal', done => {
        request
        .get('/user/signin')
        .set('x-username', userSetting.itriId)
        .set('x-password', userSetting.password)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('type',1);          
          done();
        });
      });
      it('Admin', done => {
        request
        .get('/user/signin')
        .set('x-username', adminSetting.itriId)
        .set('x-password', adminSetting.password)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.have.property('type',2);          
          done();
        });
      });
    });
    describe('Resource', () => {
      const remindSetting = {
        amount: availableResSetting.amount,
        resId: availableResSetting.resId
      };
      const calendarSetting ={
        amount: availableResSetting.amount,
        resId: availableResSetting.resId 
      };
      it('Get resources', done => {
        request
        .get('/user/resources')
        .set('x-access-token', userSetting.token)
        .set('Accept', 'application/json')        
        .end((err,res) => {
          console.log(`length:${res.body.length}`);         
          res.should.have.status(200);
          res.should.to.be.json;          
          const getObj = res.body.find(obj => obj.id === availableResSetting.id);          
          console.log(getObj);
          checkObj(availableResFromApi, getObj);
          done();
        });
      });
      it('Get resources remind', done => {
        request
        .get('/user/resource/remind')
        .set('x-access-token', userSetting.token)
        .set('Accept', 'application/json')
        .send(remindSetting)
        .end((err,res) => {
          console.log(res.body);         
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.equal('44 days');
          done();
        });
      });
      it('Get resources calendar', done => {
        request
        .get('/user/resource/calendar')
        .set('x-access-token', userSetting.token)
        .set('Accept', 'application/json')
        .send(calendarSetting)
        .end((err,res) => {          
          res.should.have.status(200);
          res.should.to.be.json;
          console.log(`length:${res.body.availableCalendar.length}`);
          console.log(res.body.availableCalendar[0]);
          done();
        });
      });
    });
    describe('Schedule', ()=> {
      describe('Get schedule list', () => {
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
      describe('Create', () => {
        const scheduleOptions = {
          start: scheduleSetting.start.format(),
          end: scheduleSetting.end.format(),
          imageId: imageSetting.id,
          machineId: machineSetting.id
        };
        it('Create a schedule', done => {
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
            scheduleFromApi = res.body;
            done();
          })
        });
      });
      describe('Update schedule', () => {
        let extendableLatestDate;
        it('Get schedule extendable date', done => {
          request
            .get(`/user/schedule/${scheduleFromApi.id}/extendable`)
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
            .put(`/user/schedule/${scheduleFromApi.id}`)
            .set('x-access-token', userSetting.token)
            .set('Accept', 'application/json')
            .send(scheduleOptions)
            .end((err, res) => {
              console.log(res.body);
              res.should.have.status(200);
              res.should.to.be.json;
              res.body.should.have.property('id')
              scheduleFromApi = res.body;
              done();
            })
        });
        describe('Delete schedule', () => {
          it('Delete schedule', done => {    
            request
              .delete(`/user/schedule/${scheduleFromApi.id}`)
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
  });
});

const checkObj = (orgObj, target) => {
  Object.keys(orgObj).map(key => {    
    target.should.have.deep.property(key, target[key]);
  })
}
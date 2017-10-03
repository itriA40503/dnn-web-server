import supertest from 'supertest';
import chai from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import moment from 'moment';
import sinon from 'sinon';
chai.use(chaiHttp);

import db from '../build/db/db';



describe('Cron unit test', () => {
  let sandbox, getShouldStartScheduleMock, startAScheduleMock;
  let schedules = [
    {
      "id": "299",
      "statusId": 1,
      "projectCode": null,
      "username": "A30375",
      "password": "bzu882mn",
      "startedAt": moment().format(),
      "endedAt": "2099-09-30T15:59:59.000Z",
      "createdAt": "2017-09-28T18:41:01.242Z",
      "updatedAt": "2017-09-28T18:40:59.795Z",
      "userId": "1",
      "machine": {
        "id": "1",
        "label": "m1",
        "name": "m1",
        "description": null,
        "gpuAmount": 1,
        "gpuType": "v100",
        "statusId": 1
      },
      "container": {
        "id": "299",
        "serviceIp": null,
        "podIp": null,
        "sshPort": null,
        "ports": [
        ]
      },
      "image": {
        "id": "23",
        "label": "2017v003",
        "name": "tensorflow-cpu",
        "path": null,
        "description": null
      }
    },
    {
      "id": "300",
      "statusId": 1,
      "projectCode": null,
      "username": "A30375",
      "password": "bzu882mn",
      "startedAt": moment().format(),
      "endedAt": "2099-09-30T15:59:59.000Z",
      "createdAt": "2017-09-28T18:41:01.242Z",
      "updatedAt": "2017-09-28T18:40:59.795Z",
      "userId": "1",
      "machine": {
        "id": "25",
        "label": "m25",
        "name": "m25",
        "description": null,
        "gpuAmount": 1,
        "gpuType": "v100",
        "statusId": 1
      },
      "container": {
        "id": "299",
        "serviceIp": null,
        "podIp": null,
        "sshPort": null,
        "ports": [
        ]
      },
      "image": {
        "id": "23",
        "label": "2017v003",
        "name": "tensorflow-cpu",
        "path": null,
        "description": null
      }
    },

  ];

  before( done =>{
  /*  sandbox = sinon.sandbox.create();
    getShouldStartScheduleMock = sandbox.stub(db, 'getShouldStartSchedule');
    getShouldStartScheduleMock.returns(schedules);
    console.log(kuber);
    startAScheduleMock = sandbox.stub(kuber, 'startASchedule').callsFake((schedule) => {
      // 根本沒stub到
      schedule.statusId = 2;
      return true;
    });*/
    done()
  })

  it("start all waiting job", async () => {
   // await kuber.startSchedules();
   // schedules[0].statusId.should.equal(2);
  });
});
/**
* @api {get} /user/schedule/:id Get user's schedule
* @apiVersion 0.1.0
* @apiName  getUserSchedule
* @apiGroup User/schedule
*
* @apiHeader {String} x-access-token Token
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
         {
           "id": "175",
           "statusId": "3",           // 1: waiting   2: loading  3: running 4: deleting 5: deleted 6: canceled 7: error 8:creating 9: outdate 10: delete fail
           "projectCode": null,
           "startedAt": "2017-08-17T16:00:00.000Z",
           "endedAt": "2017-08-19T15:59:59.000Z",
           "createdAt": "2017-08-18T01:45:30.408Z",
           "updatedAt": "2017-08-18T01:45:40.190Z",
           "userId": "6",
           "instance": {
             "id": "176",
             "ip": "100.86.2.10",
             "port": 31786,
             "username": "Axxxxx",
             "password": "jpipxqei",
             "datasetPath": null,
             "datasetUsername": null,
             "datasetPassword": null,
             "statusId": 1,
             "image": {
               "id": "7",
               "label": "all_cpu:demo",
               "name": "all_cpu:demo",
               "path": null,
               "description": "all_cpu"
             },
             "machine": {
               "id": "1",
               "label": "m1",
               "name": "Machine1",
               "description": "JAPARIPARK",
               "gpuAmount": 1,
               "gpuType": "v100",
               "statusId": 1
             }
           }
         }
*
* @apiError  0 Parameter error.
*
*
* @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *        "message": ""
 *     }
*
**/
/**
* @api {post} /user/schedule Create schedule
* @apiVersion 0.1.0
* @apiName  CreateSchedule
* @apiGroup User/schedule
*
* @apiHeader {String} x-access-token Token
* @apiParam {String} start Start date ( ISO-8601)
* @apiParam {String} end End date
 * @apiParam {int} imageId Which image to use
 * @apiParam {int} machineId Which machine to use
 * @apiParam {int} gpuType Target gpu. No use when machineId set.
 * @apiParam {int} gpuAmount Target machine gpu amount. No use when machineId set.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
 {
    "id": "732",
    "statusId": 7,
    "projectCode": null,
    "username": "Axxxxx",
    "password": "ofv7to2f",
    "startedAt": "2017-11-01T16:00:00.000Z",
    "endedAt": "2017-11-03T15:59:59.000Z",
    "createdAt": "2017-11-01T03:32:23.957Z",
    "updatedAt": "2017-11-01T18:40:21.124Z",
    "canceledAt": null,
    "expiredAt": null,
    "deletedAt": null,
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
      "id": "732",
      "serviceIp": null,
      "podIp": null,
      "sshPort": null,
      "phase": null,
      "message": "401 - {\"message\":\"CaCert is empty\"}",
      "ports": [
        {
          "id": "5785",
          "containerId": "732",
          "name": "ssh",
          "protocol": "TCP",
          "port": 22,
          "targetPort": 22,
          "nodePort": 31967
        },
        {
          "id": "5786",
          "containerId": "732",
          "name": "port1",
          "protocol": "TCP",
          "port": 1010,
          "targetPort": 1010,
          "nodePort": 31772
        },
        ...
      ]
    },
    "image": {
      "id": "35",
      "label": "2017v009",
      "name": "tensorflow",
      "path": null,
      "description": null
    }
  }
*
* @apiError  0 Parameter error.
*
*
* @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *        "message": ""
 *     }
*
**/
/**
 * @api {put} /user/schedule/:id/restart Restart schedule
 * @apiVersion 0.1.0
 * @apiName  RestartSchedule
 * @apiGroup User/schedule
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
  *     }
 *
 * @apiError  0 Parameter error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *        "message": ""
 *     }
 *
 **/
/**
* @api {put} /user/schedule/:id Update schedule
* @apiVersion 0.1.0
* @apiName  UpdateSchedule
* @apiGroup User/schedule
*
* @apiHeader {String} x-access-token Token
* @apiParam {String} end New end date.
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
  *     }
*
* @apiError  0 Parameter error.
*
*
* @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *        "message": ""
 *     }
**/
/**
 * @api {delete} /user/schedule/:id Delete schedule
 * @apiVersion 0.1.0
 * @apiName  DeleteSchedule
 * @apiGroup User/schedule
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
  *     }
 *
 * @apiError  0 error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *        "message": ""
 *     }
 **/

/**
 * @api {get} /user/schedule/:id/extendable Get extendable date
 * @apiVersion 0.1.0
 * @apiName  GetScheduleExtendableDate
 * @apiGroup User/schedule
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       {
         "extendableLatestDate": "2017-09-17T15:59:59.999Z"
       }
 *
 * @apiError  0 Parameter error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *        "message": ""
 *     }
 **/
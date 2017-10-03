/**
* @api {get} /user/schedules Get user's schedules
* @apiVersion 0.1.0
* @apiName  getUserSchedules
* @apiGroup User/schedules
*
* @apiHeader {String} x-access-token Token
*
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
       {
         "schedules": [
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
         ],

         "historySchedules": [
             ...
         ]
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
 * @api {get} /user/schedules/reserved Get user's reserved schedules
 * @apiVersion 0.1.0
 * @apiName  getUserReservedSchedules
 * @apiGroup User/schedules
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
   "schedules": [
       ...
   ]
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
 * @api {get} /user/schedules/history Get user's  history schedules
 * @apiVersion 0.1.0
 * @apiName  getUserHistorySchedules
 * @apiGroup User/schedules
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
   "historySchedules": [
       ...
   ]
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

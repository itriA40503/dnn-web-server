/**
 * @api {get} /machines Get machine list
 * @apiVersion 0.1.0
 * @apiName  getMachineList
 * @apiGroup Machine
 *
 * @apiParam {String} gpuType GTX1080 or v100
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{ machines:
   [ { id: '1',
       label: 'm1',
       name: 'm1',
       description: null,
       gpuAmount: 1,
       gpuType: 'v100',
       statusId: 1 },
     { id: '2',
       label: 'm2',
       name: 'm2',
       description: null,
       gpuAmount: 1,
       gpuType: 'v100',
       statusId: 1 },
     { id: '3',
       label: 'm3',
       name: 'm3',
       description: null,
       gpuAmount: 1,
       gpuType: 'v100',
       statusId: 1 }
        ] }
 * @apiError  0 Parameter error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *       "message":  ""
 *     }
 */
 /**
 * @api {get} /machines/remain Machine remain
 * @apiVersion 0.1.0
 * @apiName  checkMachineRemain
 * @apiGroup Machine
 *
 * @apiParam {String} start start date
 * @apiParam {String} end end date
  * @apiParam {String} gpuType GTX1080 or v100
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        avalableNumber: 2,
 *        machines:[ 1, 2]
 *     }
 *
 * @apiError  0 Parameter error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *       "code":  0
 *     }
 *
 **/
 /**
 * @api {get} /machines/calendar Machine available calendar
 * @apiVersion 0.1.0
 * @apiName  getMachineCalendar
 * @apiGroup Machine
  * @apiParam {String} gpuType GTX1080 or v100
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
   "availableCalendar": [
     {
       "date": "2017-08-17T16:00:00.000Z",
       "available": [],
       "availableNum": 0
     },
     {
       "date": "2017-08-18T16:00:00.000Z",
       "available": [],
       "availableNum": 0
     },
            .......
     {
       "date": "2017-09-15T16:00:00.000Z",
       "available": [
         "1",
         "2",
         "3",
         "5",
         "4",
         "6"
       ],
       "availableNum": 6
     }
   ]
 }
 *
 * @apiError  0 Parameter error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *       "message":  ""
 *     }
 */
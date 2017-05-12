/**
 * @api {get} /machine/remain Machine remain
 * @apiVersion 0.1.0
 * @apiName  checkMachineRemain
 * @apiGroup Machine
 *
 * @apiParam {String} start
 * @apiParam {String} end
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        avalableNumber: 2,
 *        machines:[ 123, 456]
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
 * @api {get} /machine/calendar Machine available calendar
 * @apiVersion 0.1.0
 * @apiName  getMachineCalendar
 * @apiGroup Machine
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
 *       "code":  0
 *     }
 */
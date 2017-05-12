/**
 * @api {get} /schedule Get schedule
 * @apiVersion 0.1.0
 * @apiName  getAllSchedule
 * @apiGroup Schedule
 *
 * @apiParam {String} startedAt (optional)
 * @apiHeader {String} endedAt (optional)
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
 *
 */
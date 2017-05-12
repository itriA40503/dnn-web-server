/**
* @api {get} /user/schedule Get user's schedule
* @apiVersion 0.1.0
* @apiName  getUserSchedule
* @apiGroup User/schedule
*
* @apiHeader {String} x-access-token Token
* @apiParam {String} mode all/booked/history(optional)
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
* @apiParam {String} start start date
* @apiParam {String} end end date
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
 *     {
  *     }
 *
 * @apiError  0 Parameter error.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
  *     }
 **/
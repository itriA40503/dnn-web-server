 /**
 * @api {get} /user/signin User sign in
 * @apiVersion 0.1.0
 * @apiName  UserSignIn
 * @apiGroup User
 *
 * @apiHeader {String} x-username Users username.
 * @apiHeader {String} x-password Users password.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIzIn0.xi1PUUhCfJLcX-YwUj-FtvBhcdD8FKwBZxZO9OeBNZg"
 *     }
 *
 * @apiError  0 Parameter error.
 *
 * @apiError  1 The User doesn't exists or wrong username/password.
  *
* @apiError  2 Other error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *       "code":  0
 *     }
 */
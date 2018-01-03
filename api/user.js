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
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *               message: ""
 *     }
 */

  /**
 * @api {get} /user/resources User get resources
 * @apiVersion 0.1.0
 * @apiName  UserGetResources
 * @apiGroup User/resources
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
          {
              "id": "9",
              "resId": "3",
              "amount": 2,
              "createdAt": "2017-12-26T01:28:03.981Z",
              "updatedAt": "2017-12-26T01:28:03.973Z",
              "deletedAt": null,
              "resInfo": {
                  "id": "3",
                  "gpuType": "1080",
                  "machineType": "x86",
                  "valueUnit": "Y",
                  "value": 12,
                  "createdAt": "2017-12-22T03:33:10.413Z",
                  "updatedAt": "2017-12-22T03:37:11.982Z"
              }
          },
          ...
      ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *               message: ""
 *     }
 */

 /**
 * @api {get} /user/resource/remind User get resource remind
 * @apiVersion 0.1.0
 * @apiName  UserGetResourceRemind
 * @apiGroup User/resource
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiParam {String} amount Amount of resouce
 * @apiParam {String} resId Id of resource 
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "294 days"
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *               message: ""
 *     }
 */

 /**
 * @api {get} /user/resource/calendar User get calendar
 * @apiVersion 0.1.0
 * @apiName  UserGetcalendar
 * @apiGroup User/resource
 *
 * @apiHeader {String} x-access-token Token
 *
 * @apiParam {String} amount Amount of resouce
 * @apiParam {String} resId Id of resource 
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
    "availableCalendar": [
        {
            "date": "2018-01-03T01:02:51.563Z",
            "available": [
                "6"
            ],
            "availableNum": 1
        },
        {
            "date": "2018-01-04T01:02:51.563Z",
            "available": [
                "6"
            ],
            "availableNum": 1
        },
        ...
    ]
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *               message: ""
 *     }
 */
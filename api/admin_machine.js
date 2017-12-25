/**
 * @api {get} /admin/machines Get machine list
 * @apiVersion 0.1.0
 * @apiName  GetMachineList
 * @apiGroup Admin/machines
 *
 * @apiHeader {String} x-access-token Admin token
 * @apiParam {String} gpuAmount Gpu amount (1~4)
 * @apiParam {String} gpuType Gpu type GTX1080 or v100
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 [
  { id: '51',
   label: 'm19',
   name: 'm19',
   description: null,
   gpuAmount: 2,
   gpuType: 'GTX1080',
   statusId: 1,     // 1: running 2:error 3: disable 4: destoryed
   updatedAt: '2017-09-30T02:09:43.615Z' },
    ...
 ]
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
 * @api {post} /admin/machine Create new machine
 * @apiVersion 0.1.0
 * @apiName  CreateMachine
 * @apiGroup Admin/machine
 *
 * @apiHeader {String} x-access-token User token. Need administrator privileges.
 * @apiParam {String} label Machine label
 * @apiParam {String} name Machine name
 * @apiParam {String} gpuAmount Gpu amount (1~4)
 * @apiParam {String} gpuType Gpu type GTX1080 or v100
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 {
       createdAt: '2017-09-29T18:01:26.190Z',
       statusId: 1,
       id: '50',
       name: 'm19',
       gpuAmount: 1,
       gpuType: 'v100',
       label: 'm19',
       updatedAt: '2017-09-29T18:01:24.693Z',
       description: null,
       deletedAt: null
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
 * @api {put} /admin/machine/:machineId Modify machine
 * @apiVersion 0.1.0
 * @apiName  ModifyMachine
 * @apiGroup Admin/machine
 *
 * @apiHeader {String} x-access-token Admin token
 * @apiParam {String} gpuAmount Gpu amount (1~4)
 * @apiParam {String} resId Id of resource information
 * @apiParam {String} gpuType Gpu type GTX1080 or v100
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       { id: '51',
         label: 'm19',
         name: 'm19',
         description: null,
         gpuAmount: 2,
         resId: '3',
         gpuType: 'GTX1080',
         statusId: 1,     // 1: running 2:error 3: disable 4: destoryed
         updatedAt: '2017-09-30T02:09:43.615Z' }
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
 * @api {put} /admin/machine/:machineId/enable Enable machine
 * @apiVersion 0.1.0
 * @apiName  EnableMachine
 * @apiGroup Admin/machine
 *
 * @apiHeader {String} x-access-token Admin token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       { id: '51',
         label: 'm19',
         name: 'm19',
         description: null,
         gpuAmount: 2,
         gpuType: 'GTX1080',
         statusId: 1,
         updatedAt: '2017-09-30T02:09:43.615Z' }
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
 * @api {put} /admin/machine/:machineId/disable Disable machine
 * @apiVersion 0.1.0
 * @apiName  DisableMachine
 * @apiGroup Admin/machine
 *
 * @apiHeader {String} x-access-token Admin token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
     { id: '51',
       label: 'm19',
       name: 'm19',
       description: null,
       gpuAmount: 2,
       gpuType: 'GTX1080',
       statusId: 3,
       updatedAt: '2017-09-30T02:09:43.615Z' }
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
 * @api {delete} /admin/machine/:machineId Destroy machine
 * @apiVersion 0.1.0
 * @apiName  DestroyMachine
 * @apiGroup Admin/machine
 *
 * @apiHeader {String} x-access-token Admin token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       { id: '51',
         label: 'm19',
         name: 'm19',
         description: null,
         gpuAmount: 2,
         gpuType: 'GTX1080',
         statusId: 4,
         updatedAt: '2017-09-30T02:09:43.615Z' }
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
 * @api {post} /admin/resource/ create resource
 * @apiVersion 0.1.0
 * @apiName  createResource
 * @apiGroup Admin/resource
 *
 * @apiParam {String} gpuType Type of GPU
 * @apiParam {String} machineType Type of Machine (DGX or x86)
 * @apiParam {String} valueUnit The unit of value (should be Y,M,D,h,m,s)
 * @apiParam {String} value The counting value
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "gpuType":"v100",
 *          "machineType":"DGX",
 *          "valueUnit":"D",
 *          "value":"8"
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
 * @api {get} /admin/resource/ get resource list
 * @apiVersion 0.1.0
 * @apiName  getResourceList
 * @apiGroup Admin/resource
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                "id":"11"
 *                "gpuType":"v100",
 *                "machineType":"DGX",
 *                "valueUnit":"D",
 *                "value":"8",
 *                "createdAt":"2017-12-20T00:30:08.548Z",
 *                "updatedAt":"2017-12-20T00:30:08.546Z"
 *          },
 *          ...
 *     ]
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
 * @api {put} /admin/resource/:resId update resource
 * @apiVersion 0.1.0
 * @apiName  updateResource
 * @apiGroup Admin/resource
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                "id":"11"
 *                "gpuType":"v100",
 *                "machineType":"DGX",
 *                "valueUnit":"D",
 *                "value":"8",
 *                "createdAt":"2017-12-20T00:30:08.548Z",
 *                "updatedAt":"2017-12-20T00:30:08.546Z"
 *          }
 *     ]
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
 * @api {delete} /admin/resource/:resId delete resource
 * @apiVersion 0.1.0
 * @apiName  deleteResource
 * @apiGroup Admin/resource
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *            "id":"11"
 *            "gpuType":"v100",
 *            "machineType":"DGX",
 *            "valueUnit":"D",
 *            "value":"8",
 *            "createdAt":"2017-12-20T00:30:08.548Z",
 *            "updatedAt":"2017-12-20T00:30:08.546Z"
 *            "deletedAt":"2017-12-20T00:30:08"
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
 * @api {post} /admin/mail/ send mail
 * @apiVersion 0.1.0
 * @apiName  sendCustomMail
 * @apiGroup Admin/mail
 *
 * @apiParam {String} receiver Email receiver
 * @apiParam {String} title Email title
 * @apiParam {text} text Email text
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       "Send mail"
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
 * @api {get} /admin/users/detail user detail
 * @apiVersion 0.1.0
 * @apiName  getUsers
 * @apiGroup Admin/users
 *
* @apiHeader {String} x-access-token Admin token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       {
             
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
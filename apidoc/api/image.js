/**
 * @api {get} /image Get image list
 * @apiVersion 0.1.0
 * @apiName  GetImages
 * @apiGroup Image

 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
       {
         "images": [
           {
             "id": "3",
             "label": "caffe_2017may",
             "name": "caffe_2017may",
             "path": null,
             "description": "caffe"
           },
           {
             "id": "2",
             "label": "tensorflow_2017may",
             "name": "tensorflow_2017may",
             "path": null,
             "description": "tensorflow"
           },
           .....
           {
             "id": "7",
             "label": "all_cpu:demo",
             "name": "all_cpu:demo",
             "path": null,
             "description": "all_cpu"
           }
         ]
       }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401
 *     {
 *          "message": ""
 *     }
 */
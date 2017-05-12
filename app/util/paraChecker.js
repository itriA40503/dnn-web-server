'use strict';
var CdError = require('./CdError');''

var ParaChecker = function(request, paraArray){
    var lackPara = [];
    paraArray.forEach( function(parameter, index, array){
        if(!request[parameter]){
            lackPara.push(parameter);
        }
    });
    if(lackPara.length>0){
        console.log('lack of paramter: '+lackPara.toString());
        throw new CdError(401,40000,'lack of paramter: '+lackPara.toString());
        return false;
    }
    return true;
}

module.exports = ParaChecker;
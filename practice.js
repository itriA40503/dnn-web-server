/**
 * Created by A30375 on 2017/5/3.
 */
import moment from 'moment';

let test = moment();
let test2 = moment('2017-05-11T17:16:15.286+08:00');
console.log(test);
console.log(test.toDate());
console.log(test2);
console.log(test2.endOf('d').format());

let webstormpushtest = 1;

/**
 * Created by A30375 on 2017/5/3.
 */
import moment from 'moment';
import {dnnUser as User, instance as Instance, schedule as Schedule } from './app/models';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

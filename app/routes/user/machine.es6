import moment from 'moment';
import db from '../../db/db';
import CdError from '../../util/CdError';
import asyncWrap from '../../util/asyncWrap';
import { checkDateRange } from '../../util/Checker';

const machineAPI = {};

machineAPI.getMachineRemainInPeriod = asyncWrap(async (req, res, next) => {
  const startQuery = (req.query && req.query.start) || (req.body && req.body.start);
  const endQuery = (req.query && req.query.end) || (req.body && req.body.end);  
  const user = req.user;
  const resId = (req.query && req.query.resId) || (req.body && req.body.resId);
  const amount = (req.query && req.query.amount) || (req.body && req.body.amount);  

  if (!startQuery || !endQuery) throw new CdError(400, 'lack of parameter', 40001);

  let start = moment(startQuery);
  let end = moment(endQuery);

  if (!start.isValid() || !end.isValid()) throw new CdError(400, 'date parameter error', 40002);
  start.startOf('d');
  end.endOf('d');
  if (start > end) throw new CdError(400, 'end date should greater than start date');

  await checkDateRange(user.id, resId, amount, start, end);  

  const machineWhere = {
    resId: resId,
    gpuAmount: amount
  };  

  const [machines, schedules] = await Promise.all([
    db.getAllMachineNormal(machineWhere),
    db.getAllOccupiedSchedules(start.format(), end.format())
  ]);
  
  let machineSet = await new Set(
    machines.map(machine => machine.id)
  );
  
  let resultSet = await schedules.reduce((set, schedule) => {
    let machineId = schedule.machine.id;
    if (set.has(machineId)) set.delete(machineId);
    return set;
  }, machineSet);

  res.json({ machines: [...resultSet] });
});

export default machineAPI;

import moment from 'moment';
import { schedule as Schedule, container as Container } from '../models/index';

Schedule.create({
  username: 'A30375',
  password: 'test',
  startedAt: moment().format(),
  endedAt: moment().format(),
  userId: 1,
  imageId: 19,
  machineId: 12,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test2',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 2,
  userId: 1,
  imageId: 19,
  machineId: 11,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test3',
  password: 'test3',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 3,
  userId: 1,
  imageId: 19,
  machineId: 10,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test4',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 4,
  userId: 1,
  imageId: 19,
  machineId: 9,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});


Schedule.create({
  username: 'test5',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 5,
  userId: 1,
  imageId: 19,
  machineId: 9,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test6',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 5,
  userId: 1,
  imageId: 19,
  machineId: 9,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});


Schedule.create({
  username: 'test6',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 6,
  userId: 1,
  imageId: 19,
  machineId: 9,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test7',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 7,
  userId: 1,
  imageId: 19,
  machineId: 8,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test8',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 8,
  userId: 1,
  imageId: 19,
  machineId: 7,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});

Schedule.create({
  username: 'test9',
  password: 'test2',
  startedAt: moment().format(),
  endedAt: moment().format(),
  statusId: 9,
  userId: 1,
  imageId: 19,
  machineId: 7,
  container: {
    serviceIp: undefined,
    podIp: undefined,
    sshPort: undefined
  },
}, {
  include: [Container],
});
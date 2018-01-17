/* jshint indent: 2 */
import moment from 'moment';

module.exports = (sequelize, DataTypes) => {
  let Schedule = sequelize.define('schedule', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedule_status',
        key: 'id'
      },
      defaultValue: 1,
      field: 'status_id'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'username'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password'
    },
    projectCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'project_code'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    startedAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'started_at'
    },
    endedAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'ended_at'
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.fn('now'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'deleted_at'
    },
    canceledAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'canceled_at'
    },
    expiredAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'expired_at'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'dnn_user',
        key: 'id'
      },
      field: 'user_id'
    },
    projectCodeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'project_code',
        key: 'id'
      },
      field: 'project_code_id'
    },
    imageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'image',
        key: 'id'
      },
      field: 'image_id'
    },
    machineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'machine',
        key: 'id'
      },
      field: 'machine_id'
    }
  }, {
    tableName: 'schedule',
    paranoid: false,
    scopes: {
      id: () => {
        return {
          attributes: ['id']
        };
      },
      onlyTime: () => {
        return {
          attributes: [
            'id',
            'startedAt',
            'endedAt'
          ],
        };
      },
      normal: () => {
        return {
          attributes: [
            'id',
            'statusId',
            'machineId',
            'imageId',
            'projectCode',
            'startedAt',
            'endedAt',
            'createdAt',
            'updatedAt',
            'canceledAt',
            'expiredAt',
            'deletedAt',
            'userId'
          ]
        };
      },
      detail: () => {
        return {
          include: [
            { model: sequelize.models.image.scope('normal') },
            { model: sequelize.models.container.scope('normal') },
            // { model: sequelize.models.machine.scope('normal') }
            { model: sequelize.models.machine.scope('detail') },
            { model: sequelize.models.usageLog.scope('normal') }
          ],
          attributes: [
            'id',
            'statusId',
            'machineId',
            'projectCode',
            'username',
            'password',
            'startedAt',
            'endedAt',
            'createdAt',
            'updatedAt',
            'canceledAt',
            'expiredAt',
            'deletedAt',
            'userId'
          ]
        };
      },
      byUser: (userId) => {
        return {
          where: {
            userId: userId
          }
        };
      },
      thoseOccupiedSchedule: () => {
        return {
          where: {
            statusId: {
              $in: [1, 2, 3, 4, 7, 8, 10]
            }
          }
        };
      },
      thoseBeingAncient: () => {
        return {
          where: {
            statusId: {
              $in: [5]
            }
          }
        };
      },
      thoseShouldStart: () => {
        return {
          where: {
            statusId: {
              $in: [1]
            },
            startedAt: {
              $lte: moment().format()
            },
            endedAt: {
              $gt: moment().format()
            }
          }
        };
      },
      thoseShouldRestart: () => {
        return {
          where: {
            statusId: {
              $in: [7]
            },
            startedAt: {
              $lte: moment().format()
            },
            endedAt: {
              $gt: moment().format()
            }
          }
        };
      },
      thoseShouldUpdate: () => {
        return {
          where: {
            statusId: {
              $in: [2, 3, 7]
            },
          }
        };
      },
      thoseWillBeCanceled: () => {
        return {
          where: {
            statusId: {
              $in: [1]
            },
            startedAt: {
              $lte: moment().format()
            },
            endedAt: {
              $gt: moment().format()
            }
          }
        };
      },
      thoseWillExpire: () => {
        return {
          where: {
            statusId: {
              $in: [1, 2, 3, 7, 8]
            },
            endedAt: {
              $lte: moment().format()
            }
          }
        };
      },
      thoseWillBeDeleted: () => {
        return {
          where: {
            statusId: {
              $in: [2, 3, 8]
            },
          }
        };
      },
      statusNormal: () => {
        return {
          where: {
            statusId: {
              $in: [1, 2, 3, 4, 7, 8, 10]
            }
          }
        };
      },
      statusHistory: () => {
        return {
          where: {
            statusId: {
              $in: [5, 6, 9]
            }
          }
        };
      },
      shouldEnd: () => {
        return {
          where: {
            statusId: {
              $in: [1, 2, 3, 4, 7, 8, 10]
            },
            endedAt: {
              $lte: moment().format()
            }
          }
        };
      },
      statusShouldDelete: () => {
        return {
          where: {
            statusId: {
              $in: [4]
            }
          }
        };
      },
      byStatus: (statusId) => {
        return {
          where: {
            statusId: statusId
          }
        };
      },
      byMachine: (machineId) => {
        return {
          where: {
            machineId: machineId
          }
        };
      },
      timeOverlap: (options) => {
        let where = {};
        if (options && (options.start || options.end)) {
          where.startedAt = {
            $lte: options.end || options.start
          };
          where.endedAt = {
            $gte: options.start || options.end
          };
        }
        let result = {
          where: where
        };
        return result;
      }
    }
  });
  Schedule.associate = (models) => {
    Schedule.belongsTo(models.machine, { foreignKey: 'machineId' });
    Schedule.belongsTo(models.image, { foreignKey: 'imageId' });
    Schedule.belongsTo(models.dnnUser, { foreignKey: 'userId' });
    Schedule.hasOne(models.container, { foreignKey: 'id' });
    Schedule.hasMany(models.usageLog, { foreignKey: 'scheduleId' });
  };
  return Schedule;
};

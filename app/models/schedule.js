/* jshint indent: 2 */

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
    paranoid: true,
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
            'projectCode',
            'startedAt',
            'endedAt',
            'createdAt',
            'updatedAt',
            'userId'
          ]
        };
      },
      detail: () => {
        return {
          include: [
            { model: sequelize.models.image.scope('normal') },
            { model: sequelize.models.container.scope('normal') },
            { model: sequelize.models.machine.scope('normal') }
          ],
          attributes: [
            'id',
            'statusId',
            'projectCode',
            'username',
            'password',
            'startedAt',
            'endedAt',
            'createdAt',
            'updatedAt',
            'userId'
          ]
        };
      },
      user: (userId) => {
        return {
          where: {
            userId: userId
          }
        };
      },
      statusNormal: () => {
        return {
          where: {
            statusId: {
              $in: [1, 2, 3, 4]
            }
          }
        };
      },
      statusShouldDelete: () => {
        return {
          where: {
            $or: [
              {
                statusId: {
                  $in: [4, 7]
                }
              },
              {
                endedAt: {
                  $lt: new Date()
                }
              }
            ]
          }
        };
      },
      status: (statusId) => {
        return {
          where: {
            statusId: statusId
          }
        };
      },
      whichMachine: (machineId) => {
        console.log(machineId);
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
  };
  return Schedule;
};

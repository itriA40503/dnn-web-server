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
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'schedule_status',
        key: 'id'
      },
      defaultValue: 1,
      field: 'status_id'
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
    projectCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'project_code'
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
    instanceId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'instance',
        key: 'id'
      },
      field: 'instance_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'dnn_user',
        key: 'id'
      },
      field: 'user_id'
    }
  }, {
    tableName: 'schedule',
    paranoid: true,
    classMethods: {
      associate: (models) => {
        Schedule.belongsTo(models.instance, { foreignKey: 'instanceId' });
      }
    },
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
          include: [
            { model: sequelize.models.instance.scope('normal'), paranoid: false }
          ],
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
            { model: sequelize.models.instance.scope('detail'), paranoid: false }
          ],
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
      instanceScope: (scope) => {
        return {
          include: [
            { model: sequelize.models.instance.scope(scope), paranoid: false }
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
      machine: (machineId) => {
        console.log(machineId);
        return {
          include: [
            { model: sequelize.models.instance.scope({ method: ['whichMachine', machineId] }) }
          ]
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
  return Schedule;
};
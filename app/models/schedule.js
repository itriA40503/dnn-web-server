module.exports = (sequelize, DataTypes) => {
  let Schedule = sequelize.define('schedule', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
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
      normal: (options) => {
        let where = {};
        if (options && options.start && options.end) {
          where.startedAt = {
            $lte: options.end
          };
          where.endedAt = {
            $gte: options.start
          };
        }
        let result = {
          where: where,
          include: [
            { model: sequelize.models.instance.scope({ method: ['normal', options] }), paranoid: false }
          ],
          attributes: [
            'id',
            'projectCode',
            'startedAt',
            'endedAt',
            'createdAt',
            'updatedAt',
            'userId'
          ]
        };
        return result;
      },
      detail: (parameter) => {
        let result = {
          include: [
            { model: sequelize.models.instance.scope('detail'), paranoid: false }
          ],
          attributes: [
            'id',
            'projectCode',
            'startedAt',
            'endedAt',
            'createdAt',
            'updatedAt',
            'userId'
          ]
        };
        return result;
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
      },
      instanceStatusWhere: (options) => {
        let result = {
          include: [
            { model: sequelize.models.instance.scope({ method: ['statusWhere', options] }),
              paranoid: false }
          ]
        };
        return result;
      }
    }
  });
  return Schedule;
};
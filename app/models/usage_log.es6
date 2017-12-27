/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let UsageLog = sequelize.define('usageLog', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    scheduleId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'schedule',
        key: 'id'
      },
      field: 'schedule_id'
    },
    countValue: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'count_value'
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
      allowNull: true,
      defaultValue: sequelize.fn('now'),
      field: 'created_at'
    }
  }, {
    tableName: 'usage_log',
    timestamps: false,
    scopes: {
      normal: () => {
        return {
          attributes: [
            'id',
            'scheduleId',
            'countValue',
            'startedAt',
            'endedAt',
            'createdAt',
          ]
        };
      },
      onlyValue: () => {
        return {
          attributes: [
            'countValue'
          ]
        };
      },
      byId: (id) => {
        return {
          where: {
            id: id
          }
        };
      }
    }    
  });
  UsageLog.associate = (models) => {
    UsageLog.belongsTo(models.schedule, { foreignKey: 'scheduleId' });
  };
  return UsageLog;
};

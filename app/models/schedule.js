'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var Schedule = sequelize.define('schedule', {
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
      associate: function (models) {
        Schedule.belongsTo(models.instance, { foreignKey: 'instanceId' });
      }
    },
    scopes: {
      normal: function (options) {
        var where = {};
        if (options && options.start && options.end) {
          where.startedAt = {
            $lte: options.end
          };
          where.endedAt = {
            $gte: options.start
          };
        }
        var result = {
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
      detail: function (parameter) {

        var result = {
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
      }
    }
  });
  return Schedule;
};
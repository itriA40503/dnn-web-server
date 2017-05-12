'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var Instance = sequelize.define('instance', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    machineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'machine',
        key: 'id'
      },
      field: 'machine_id'
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ip'
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'port'
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    datasetPath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dataset_path'
    },
    datasetUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dataset_username'
    },
    datasetPassword: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dataset_password'
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
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'instance_status',
        key: 'id'
      },
      field: 'status_id'
    },
    imageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'image',
        key: 'id'
      },
      field: 'image_id'
    }
  }, {
    tableName: 'instance',
    paranoid: true,
    classMethods: {
      associate: function (models) {
        Instance.belongsTo(models.machine, { foreignKey: 'machineId' });
        Instance.belongsTo(models.image, { foreignKey: 'imageId' });
        Instance.hasMany(models.schedule);
      }
    },
    scopes: {
      normal: function (options) {
        var result = {
          include: [
            { model: sequelize.models.machine.scope({ method: ['normal', options] }) }
          ],
          attributes: [
            'id',
            'ip',
            'port',
            'statusId',
            'imageId'
          ]
        };
        return result;
      },
      detail: function () {
        var result = {
          include: [
            { model: sequelize.models.machine.scope('normal') },
            { model: sequelize.models.image.scope('normal') }
          ],
          attributes: [
            'id',
            'ip',
            'port',
            'username',
            'password',
            'datasetPath',
            'datasetUsername',
            'datasetPassword',
            'statusId'
          ]
        };
        return result;
      }
    }
  });
  return Instance;
};
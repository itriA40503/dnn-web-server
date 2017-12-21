/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let ResInfo = sequelize.define('resInfo', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    gpuType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'gpu_type'
    },
    machineType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'machine_type'
    },
    valueUnit: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'value_unit'
    },
    value: {
      type: DataTypes.REAL,
      allowNull: true,
      field: 'value'
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
    }
  }, {
    tableName: 'res_info',
    scopes: {
      normal: () => {
        return {
          attributes: [
            'id',
            'gpuType',
            'machineType',
            'valueUnit',
            'value',
            'createdAt',
            'updatedAt'            
          ]
        };
      },
      notDelete: () => {
        return {
          where: {
            deletedAt: null
          }
        };
      }
    }
  });
  ResInfo.associate = (models) => {
    ResInfo.hasMany(models.availableRes);
    ResInfo.hasMany(models.machine);
  };
  return ResInfo;
};

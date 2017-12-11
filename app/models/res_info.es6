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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'update_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    tableName: 'res_info',
  });
  ResInfo.associate = (models) => {
    ResInfo.hasMany(models.availableRes);
  };
  return ResInfo;
};

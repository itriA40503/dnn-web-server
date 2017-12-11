/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('resourceInfo', {
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
    }
  }, {
    tableName: 'resource_info'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('machineStatus', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'status'
    }
  }, {
    tableName: 'machine_status'
  });
};

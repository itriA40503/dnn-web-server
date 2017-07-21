/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scheduleStatus', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'status'
    }
  }, {
    tableName: 'schedule_status'
  });
};

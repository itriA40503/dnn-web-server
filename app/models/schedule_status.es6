/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('scheduleStatus', {
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
    tableName: 'schedule_status'
  });
};

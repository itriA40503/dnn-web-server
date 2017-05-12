/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('instanceStatus', {
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
    tableName: 'instance_status'
  });
};

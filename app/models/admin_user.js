/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('adminUser', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    }
  }, {
    tableName: 'admin_user'
  });
};

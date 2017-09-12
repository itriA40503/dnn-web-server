/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('userType', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'type'
    }
  }, {
    tableName: 'user_type'
  });
};

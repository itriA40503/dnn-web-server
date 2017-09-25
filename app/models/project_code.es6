/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('projectCode', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'code'
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: true,
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
    tableName: 'project_code'
  });
};

/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('dnnUser', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    itriId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'itri_id'
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'salt'
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
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_type',
        key: 'id'
      },
      defaultValue: 1,
      field: 'type_id'
    }
  }, {
    tableName: 'dnn_user'
  });
};

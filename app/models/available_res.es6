/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let AvailableRes = sequelize.define('availableRes', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'dnn_user',
        key: 'id'
      },
      field: 'user_id'
    },
    resId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'res_info',
        key: 'id'
      },
      field: 'res_id'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'amount'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    tableName: 'available_res'
  });
  AvailableRes.associate = (models) => {
    AvailableRes.belongTo(models.resInfo, { foreignKey: 'resId' });
    AvailableRes.belongTo(models.dnnUser, { foreignKey: 'userId' });
  };
  return AvailableRes;
};

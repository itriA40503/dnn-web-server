/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('availableRes', {
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
        model: 'resource_info',
        key: 'id'
      },
      field: 'res_id'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'amount'
    }
  }, {
    tableName: 'available_res'
  });
};

/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let Transaction = sequelize.define('transaction', {
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
    addValue: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'add_value'
    },
    info: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'info'
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.fn('now'),
      field: 'created_at'
    }
  }, {
    tableName: 'transaction'
  });
  // Transaction.associate = (models) => {
  //   Transaction.belongsTo(models.dnnUser, { foreignKey: 'dnnUser' });
  // };
  return Transaction;
};

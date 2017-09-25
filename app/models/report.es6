/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let Report = sequelize.define('report', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    scheduleId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'schedule',
        key: 'id'
      },
      field: 'schedule_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'dnn_user',
        key: 'id'
      },
      field: 'user_id'
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: false,
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
    tableName: 'report'
  });
  Report.associate = (models) => {
    Report.belongsTo(models.schedule, { foreignKey: 'scheduleId' });
    Report.belongsTo(models.dnnUser, { foreignKey: 'userId' });
  };
  return Report;
};

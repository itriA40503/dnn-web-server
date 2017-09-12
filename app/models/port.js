/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let Port = sequelize.define('port', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    containerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'container',
        key: 'id'
      },
      field: 'container_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name'
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'protocol'
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'port'
    },
    targetPort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'target_port'
    },
    nodePort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'node_port'
    }
  }, {
    tableName: 'port',
    timestamps: false
  });

  Port.associate = (models) => {
    Port.belongsTo(models.container, { foreignKey: 'containerId' });
  };
  return Port;
};

/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let Container = sequelize.define('container', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    serviceIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'service_ip'
    },
    podIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pod_ip'
    },
    sshPort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ssh_port'
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'message'
    },
    phase: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'message'
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'created_at'
    }
  }, {
    tableName: 'container',
    timestamps: false,
    scopes: {
      normal: () => {
        return {
          include: [
            { model: sequelize.models.port }
          ],
          attributes: [
            'id',
            'serviceIp',
            'podIp',
            'sshPort',
            'phase',
            'message',
            'createdAt'
          ]
        };
      }
    }
  });
  Container.associate = (models) => {
    Container.belongsTo(models.schedule, { foreignKey: 'id' });
    Container.hasMany(models.port);
  };
  return Container;
};

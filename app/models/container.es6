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
            'sshPort'
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

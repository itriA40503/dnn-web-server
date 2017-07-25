/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('image', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'label'
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'path'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
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
    }
  }, {
    tableName: 'image',
    scopes: {
      normal: () => {
        let result = {
          where: {},
          attributes: [
            'id',
            'label',
            'name',
            'path',
            'description'
          ]
        };
        return result;
      }
    }
  });
};

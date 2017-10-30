/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let Image = sequelize.define('image', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    digest: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'digest'
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
    label: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'label'
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
      id: () => {
        return {
          attributes: ['id'],
          raw: true
        };
      },
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
      },
      latest: () => {
        return {
          attributes: [
            'id',
            'name',
            'label',
            'path',
            'description',
            [sequelize.literal('ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at DESC)'), 'sort']
            //   [sequelize.fn('MAX', sequelize.col('created_at')), 'createdAt']
          ]
        };
      }
    }
  });
  Image.associate = (models) => {
    Image.hasMany(models.schedule);
  };
  return Image;
};

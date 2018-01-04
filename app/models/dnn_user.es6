/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let DnnUser = sequelize.define('dnnUser', {
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
    mail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'mail'
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
    tableName: 'dnn_user',
    scopes: {
      notDelete: () => {
        return {
          where: {
            deletedAt: null
          }
        };
      },
      normal: () => {
        return {
          attributes: [
            'id',
            'itriId',
            'mail',
            'createdAt',
            'updatedAt',           
          ]
        };
      },
      detail: () => {
        return {
          include: [
            { model: sequelize.models.availableRes.scope('detail') },            
            { model: sequelize.models.transaction.scope('normal') },
          ],
          attributes: [
            'id',
            'itriId',
            'mail',
            'salt',
            'createdAt',
            'updatedAt',
            'deletedAt',
            'typeId'
          ]
        };        
      },
      byItriId: (itriId) => {
        return {
          where: {
            itriId: itriId
          }
        };
      }
    }
  });
  DnnUser.associate = (models) => {
    DnnUser.hasMany(models.transaction, { foreignKey: 'userId' });
    DnnUser.hasMany(models.availableRes, { foreignKey: 'userId' });
  };
  return DnnUser;
};

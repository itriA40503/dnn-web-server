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
    tableName: 'available_res',
    scopes: {
      normal: () => {
        return {
          attributes: [
            'id',          
            'resId',
            'userId',
            'amount',
            'createdAt',
            'updatedAt',
            'deletedAt'         
          ]
        };
      },
      detail: () => {
        return {
          include: [
            { model: sequelize.models.resInfo.scope('normal') },
            // { model: sequelize.models.dnnUser.scope('normal') },
          ],
          attributes: [
            'id',          
            'resId',            
            'amount',
            'createdAt',
            'updatedAt',
            'deletedAt'        
          ]
        };
      },
      notDelete: () => {
        return {
          where: {
            deletedAt: null
          }          
        };
      },
      byUserId: (userId) => {
        return {
          where: {
            userId: userId          
          }          
        };
      },
      byResId: (resId) => {
        return {
          where: {
            resId: resId
          }          
        };
      }
    }    
  });
  AvailableRes.associate = (models) => {
    AvailableRes.belongsTo(models.resInfo, { foreignKey: 'resId' });
    AvailableRes.belongsTo(models.dnnUser, { foreignKey: 'userId' });
  };
  return AvailableRes;
};

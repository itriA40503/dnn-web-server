/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var machine = sequelize.define('machine', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
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
    gpuAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'gpu_amount'
    },
    gpuType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'gpu_type'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'machine_status',
        key: 'id'
      },
      field: 'status_id'
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
    tableName: 'machine',
    classMethods: {
      associate: function (models) {
      }
    },
    scopes: {
      normal: function (options) {
        var where = {};
        if(options && options.machineId){
          where.id = options.machineId;
        }

        var result = {
          where: where,
          attributes: [
            'id',
            'name',
            'description',
            'gpuAmount',
            'gpuType',
            'statusId'
          ]
        };
        return result;
      }
    }
  });

  return machine;
};

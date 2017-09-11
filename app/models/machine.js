/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  let Machine = sequelize.define('machine', {
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
      defaultValue: 1,
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
      associate: (models) => {
      }
    },
    scopes: {
      id: () => {
        return {
          attributes: ['id'],
          raw: true
        };
      },
      normal: (options) => {
        let where = {};
        if (options && options.machineId) {
          where.id = options.machineId;
        }

        let result = {
          where: where,
          attributes: [
            'id',
            'label',
            'name',
            'description',
            'gpuAmount',
            'gpuType',
            'statusId'
          ]
        };
        return result;
      },
      whichGpu: (gpuType) => {
        return {
          where: {
            gpuType: gpuType
          }
        };
      }

    }
  });
  Machine.associate = (models) => {
    Machine.hasMany(models.instance);
  };
  return Machine;
};

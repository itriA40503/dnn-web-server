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
    resId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'res_info',
        key: 'id'
      },
      field: 'res_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name'
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'label'
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
      thoseDeleted: () => {
        return {
          where: {
            statusId: 4
          }
        };
      },
      statusNormal: () => {
        return {
          where: {
            statusId: 1
          }
        };
      },
      thoseExist: () => {
        return {
          where: {
            statusId: {
              $not: 4
            }
          }
        };
      },
      gpuAmount: (gpuAmount) => {
        if (!gpuAmount) return {};
        return {
          where: {
            gpuAmount: gpuAmount
          }
        };
      },
      whichGpu: (gpuType) => {
        if (!gpuType) return {};
        return {
          where: {
            gpuType: gpuType
          }
        };
      },
      whichId: (id) => {
        return {
          where: {
            id: id
          }
        };
      },
      byLabel: (label) => {
        return {
          where: {
            label: label
          }
        };
      }
    }
  });
  Machine.associate = (models) => {
    Machine.hasMany(models.schedule);
  };
  return Machine;
};

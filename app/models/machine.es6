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
      statusNormal: () => {
        return {
          where: {
            statusId: 1
          }
        };
      },
      statusShouldShow: () => {
        return {
          where: {
            statusId: {
              $notIn: [4]
            }
          }
        };
      },
      whichGpu: (gpuType) => {
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
      }
    }
  });
  Machine.associate = (models) => {
    Machine.hasMany(models.schedule);
  };
  return Machine;
};

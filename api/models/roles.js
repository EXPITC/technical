'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      roles.hasMany(models.routes, {
        as: 'routes',
        foreignKey: {
          name: 'id'
        }
      })

      roles.hasMany(models.users, {
        as: 'role',
        foreignKey: {
          name: 'id'
        }
      })
    }
  }
  roles.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'roles',
  });
  return roles;
};
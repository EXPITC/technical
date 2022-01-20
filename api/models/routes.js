'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class routes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      routes.belongsTo(models.roles, {
        as: 'accessUser',
        foreignKey: {
          name : 'access'
        }
      })
    }
  }
  routes.init({
    route: DataTypes.STRING,
    method: DataTypes.STRING,
    access: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'routes',
  });
  return routes;
};
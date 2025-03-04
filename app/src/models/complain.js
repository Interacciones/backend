'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complain extends Model {
    static associate(models) {
    }
  }
  Complain.init({
    name: DataTypes.STRING(20),
    lastName: DataTypes.STRING(20),
    email: DataTypes.STRING(75),
    content: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'Complain',
  });
  return Complain;
};
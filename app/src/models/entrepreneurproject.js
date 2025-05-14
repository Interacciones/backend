'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EntrepreuneurProject extends Model {
    static associate(models) {
      EntrepreuneurProject.belongsTo(models.User, { foreignKey: 'userId' });
      EntrepreuneurProject.hasMany(models.EntrepreneurProjectPhoto, { foreignKey: 'projectId' });
    }
  }
  EntrepreuneurProject.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING(2000),
    instagramProfile: DataTypes.STRING,
    showContact: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'EntrepreuneurProject',
  });
  return EntrepreuneurProject;
}; 
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EntrepreneurProjectPhoto extends Model {
    static associate(models) {
      EntrepreneurProjectPhoto.belongsTo(models.EntrepreuneurProject, { foreignKey: 'projectId' });
    }
  }
  EntrepreneurProjectPhoto.init({
    projectId: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EntrepreneurProjectPhoto',
  });
  return EntrepreneurProjectPhoto;
}; 
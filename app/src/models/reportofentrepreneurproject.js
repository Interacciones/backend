'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReportOfEntrepreneurProject extends Model {
    static associate(models) {
      ReportOfEntrepreneurProject.belongsTo(models.User, { foreignKey: 'userId' });
      ReportOfEntrepreneurProject.belongsTo(models.EntrepreuneurProject, { foreignKey: 'projectId' });
    }
  }

  ReportOfEntrepreneurProject.init({
    userId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportOfEntrepreneurProject',
  });

  return ReportOfEntrepreneurProject;
};



'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportOfTutor extends Model {
    static associate(models) {
      ReportOfTutor.belongsTo(models.User, { foreignKey: 'userId' });
      ReportOfTutor.belongsTo(models.TutorProfile, { foreignKey: 'tutorId' });
      ReportOfTutor.hasMany(models.ReportHistoryOfTutor, { foreignKey: 'reportId' });
    }
  }
  ReportOfTutor.init({
    userId: DataTypes.INTEGER,
    tutorId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportOfTutor',
  });
  return ReportOfTutor;
};

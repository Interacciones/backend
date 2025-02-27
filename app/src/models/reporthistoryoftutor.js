'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfTutor extends Model {
    static associate(models) {
      ReportHistoryOfTutor.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfTutor.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfTutor.belongsTo(models.Admin, { foreignKey: 'handlerAdminId' });
    }
  }
  ReportHistoryOfTutor.init({
    reportedByUserId: DataTypes.INTEGER,
    createdByUserId: DataTypes.INTEGER,
    handlerAdminId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    decisionArgument: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'ReportHistoryOfTutor',
  });
  return ReportHistoryOfTutor;
};

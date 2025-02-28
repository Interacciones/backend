'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfTutor extends Model {
    static associate(models) {
      ReportHistoryOfTutor.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfTutor.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfTutor.belongsTo(models.Admin, { foreignKey: 'handlerAdminUserId' });
    }
  }
  ReportHistoryOfTutor.init({
    reportedByUserId: DataTypes.INTEGER,
    createdByUserId: DataTypes.INTEGER,
    handlerAdminUserId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    decisionArgument: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'ReportHistoryOfTutor',
  });
  return ReportHistoryOfTutor;
};

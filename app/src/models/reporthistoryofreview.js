'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfReview extends Model {
    static associate(models) {
      ReportHistoryOfReview.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfReview.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfReview.belongsTo(models.Admin, { foreignKey: 'handlerAdminUserId' });
    }
  }
  ReportHistoryOfReview.init({
    reportedByUserId: DataTypes.INTEGER,
    createdByUserId: DataTypes.INTEGER,
    handlerAdminUserId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    decisionArgument: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'ReportHistoryOfReview',
  });
  return ReportHistoryOfReview;
};

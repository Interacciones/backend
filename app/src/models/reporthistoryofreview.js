'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfReview extends Model {
    static associate(models) {
      ReportHistoryOfReview.belongsTo(models.ReportOfReview, { foreignKey: 'reportId' });
      ReportHistoryOfReview.belongsTo(models.Admin, { foreignKey: 'handlerAdminId' });
    }
  }
  ReportHistoryOfReview.init({
    reportId: DataTypes.INTEGER,
    handlerAdminId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportHistoryOfReview',
  });
  return ReportHistoryOfReview;
};

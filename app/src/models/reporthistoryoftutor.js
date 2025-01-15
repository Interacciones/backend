'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfTutor extends Model {
    static associate(models) {
      ReportHistoryOfTutor.belongsTo(models.ReportOfTutor, { foreignKey: 'reportId' });
      ReportHistoryOfTutor.belongsTo(models.Admin, { foreignKey: 'handlerAdminId' });
    }
  }
  ReportHistoryOfTutor.init({
    reportId: DataTypes.INTEGER,
    handlerAdminId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportHistoryOfTutor',
  });
  return ReportHistoryOfTutor;
};

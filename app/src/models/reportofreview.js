'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportOfReview extends Model {
    static associate(models) {
      ReportOfReview.belongsTo(models.User, { foreignKey: 'userId' });
      ReportOfReview.belongsTo(models.ReviewMessage, { foreignKey: 'reviewId' });
      ReportOfReview.hasMany(models.ReportHistoryOfReview, { foreignKey: 'reportId' });
    }
  }
  ReportOfReview.init({
    userId: DataTypes.INTEGER,
    reviewId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportOfReview',
  });
  return ReportOfReview;
};

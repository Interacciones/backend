'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.ReportHistoryOfTutor, { foreignKey: 'handlerAdminId' });
      Admin.hasMany(models.ReportHistoryOfReview, { foreignKey: 'handlerAdminId' });
      Admin.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Admin.init({
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};

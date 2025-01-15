'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewMessage extends Model {
    static associate(models) {
      ReviewMessage.belongsTo(models.User, { foreignKey: 'userId' });
      ReviewMessage.belongsTo(models.TutorProfile, { foreignKey: 'tutorId' });
      ReviewMessage.hasMany(models.ReportOfReview, { foreignKey: 'reviewId' });
    }
  }
  ReviewMessage.init({
    userId: DataTypes.INTEGER,
    tutorId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReviewMessage',
  });
  return ReviewMessage;
};

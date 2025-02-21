'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewsPerTutor extends Model {
    static associate(models) {
      ReviewsPerTutor.belongsTo(models.TutorProfile, { foreignKey: 'tutorId' });
    }
  }
  ReviewsPerTutor.init({
    tutorId: DataTypes.INTEGER,
    avgRating: DataTypes.FLOAT,
    reviewAmount: DataTypes.INTEGER,
    oneStarReviews: DataTypes.INTEGER,
    twoStarReviews: DataTypes.INTEGER,
    threeStarReviews: DataTypes.INTEGER,
    fourStarReviews: DataTypes.INTEGER,
    fiveStarReviews: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReviewsPerTutor',
  });
  return ReviewsPerTutor;
};
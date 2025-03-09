'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorProfile extends Model {
    static associate(models) {
      TutorProfile.hasMany(models.ReviewMessage, { foreignKey: 'tutorId' });
      TutorProfile.hasMany(models.ReportOfTutor, { foreignKey: 'tutorId' });
      TutorProfile.hasOne(models.TutorPriority, { foreignKey: 'idTutor' });
      TutorProfile.hasMany(models.TutorSubjects, { foreignKey: 'idTutor' });
      TutorProfile.hasMany(models.TutorCourses, { foreignKey: 'idTutor' });
      TutorProfile.belongsTo(models.User, { foreignKey: 'userId' });
      TutorProfile.hasOne(models.ReviewsPerTutor, { foreignKey: 'tutorId' });
    }
  }
  TutorProfile.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    priceDescription: DataTypes.STRING,
    photo: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TutorProfile',
  });
  return TutorProfile;
};

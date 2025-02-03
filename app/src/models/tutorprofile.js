'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorProfile extends Model {
    static associate(models) {
      TutorProfile.hasMany(models.ReviewMessage, { foreignKey: 'tutorId' });
      TutorProfile.hasMany(models.ReportOfTutor, { foreignKey: 'tutorId' });
      TutorProfile.hasMany(models.TutorPriority, { foreignKey: 'idTutor' });
      TutorProfile.hasMany(models.TutorSubjects, { foreignKey: 'idTutor', as: 'Subjects' });
      TutorProfile.hasMany(models.TutorCourses, { foreignKey: 'idTutor', as: 'Courses' });
      TutorProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  TutorProfile.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    priceDescription: DataTypes.STRING,
    photo: DataTypes.STRING,
    contactMail: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TutorProfile',
  });
  return TutorProfile;
};

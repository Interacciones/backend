'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorCourses extends Model {
    static associate(models) {
      TutorCourses.belongsTo(models.TutorProfile, { foreignKey: 'idTutor' });
    }
  }
  TutorCourses.init({
    idTutor: DataTypes.INTEGER,
    subject: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TutorCourses',
  });
  return TutorCourses;
};

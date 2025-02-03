'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudySubjects extends Model {
    static associate(models) {
      StudySubjects.hasMany(models.TutorSubjects, { foreignKey: 'idSubject', as: 'Subjects' });
    }
  }
  StudySubjects.init({
    subject: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StudySubjects',
  });
  return StudySubjects;
};

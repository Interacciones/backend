'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorSubjects extends Model {
    static associate(models) {
      TutorSubjects.belongsTo(models.TutorProfile, { foreignKey: 'idTutor' });
      TutorSubjects.belongsTo(models.StudySubjects, { foreignKey: 'idSubject', as: 'StudySubject' });
    }
  }
  TutorSubjects.init({
    idTutor: DataTypes.INTEGER,
    idSubject: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TutorSubjects',
  });
  return TutorSubjects;
};

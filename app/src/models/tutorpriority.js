'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorPriority extends Model {
    static associate(models) {
      TutorPriority.belongsTo(models.TutorProfile, { foreignKey: 'idTutor' });
    }
  }
  TutorPriority.init({
    idTutor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TutorPriority',
  });
  return TutorPriority;
};

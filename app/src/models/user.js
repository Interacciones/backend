'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.ReviewMessage, { foreignKey: 'userId' });
      User.hasMany(models.ReportOfTutor, { foreignKey: 'userId' });
      User.hasMany(models.ReportOfReview, { foreignKey: 'userId' });
      User.hasOne(models.TutorProfile, { foreignKey: 'userId' });
      User.hasOne(models.Admin, { foreignKey: 'userId' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    isBanned: DataTypes.BOOLEAN,
    lastName: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
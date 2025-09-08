'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReportOfEntrepreneurComment extends Model {
    static associate(models) {
      ReportOfEntrepreneurComment.belongsTo(models.User, { foreignKey: 'userId' });
      ReportOfEntrepreneurComment.belongsTo(models.EntrepreneurProjectComment, { foreignKey: 'commentId' });
    }
  }

  ReportOfEntrepreneurComment.init({
    userId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportOfEntrepreneurComment',
  });

  return ReportOfEntrepreneurComment;
};



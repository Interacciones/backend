'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EntrepreneurProjectComment extends Model {
    static associate(models) {
      EntrepreneurProjectComment.belongsTo(models.User, { foreignKey: 'userId' });
      EntrepreneurProjectComment.belongsTo(models.EntrepreuneurProject, { foreignKey: 'projectId' });
      EntrepreneurProjectComment.belongsTo(models.EntrepreneurProjectComment, { as: 'parent', foreignKey: 'parentCommentId' });
      EntrepreneurProjectComment.hasMany(models.EntrepreneurProjectComment, { as: 'replies', foreignKey: 'parentCommentId' });
      EntrepreneurProjectComment.hasMany(models.ReportOfEntrepreneurComment, { foreignKey: 'commentId' });
    }
  }

  EntrepreneurProjectComment.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EntrepreneurProjectComment',
  });

  return EntrepreneurProjectComment;
};



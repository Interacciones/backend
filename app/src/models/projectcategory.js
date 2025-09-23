'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectCategory extends Model {
    static associate(models) {
      ProjectCategory.belongsToMany(models.EntrepreuneurProject, { 
        through: models.ProjectCategoryAssignment,
        foreignKey: 'categoryId',
        otherKey: 'projectId'
      });
    }
  }
  ProjectCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ProjectCategory',
  });
  return ProjectCategory;
};

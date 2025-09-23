'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectCategoryAssignment extends Model {
    static associate(models) {
      ProjectCategoryAssignment.belongsTo(models.EntrepreuneurProject, { foreignKey: 'projectId' });
      ProjectCategoryAssignment.belongsTo(models.ProjectCategory, { foreignKey: 'categoryId' });
    }
  }
  ProjectCategoryAssignment.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'EntrepreuneurProjects',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProjectCategories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProjectCategoryAssignment',
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'categoryId']
      }
    ]
  });
  return ProjectCategoryAssignment;
};

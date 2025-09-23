'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfEntrepreneurProjects extends Model {
    static associate(models) {
      ReportHistoryOfEntrepreneurProjects.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfEntrepreneurProjects.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfEntrepreneurProjects.belongsTo(models.User, { foreignKey: 'handlerAdminUserId' });
    }
  }

  ReportHistoryOfEntrepreneurProjects.init({
    reportedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    handlerAdminUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    decisionArgument: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ReportHistoryOfEntrepreneurProjects',
  });

  return ReportHistoryOfEntrepreneurProjects;
};





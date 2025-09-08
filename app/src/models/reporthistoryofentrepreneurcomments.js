'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfEntrepreneurComments extends Model {
    static associate(models) {
      ReportHistoryOfEntrepreneurComments.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfEntrepreneurComments.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfEntrepreneurComments.belongsTo(models.User, { foreignKey: 'handlerAdminUserId' });
    }
  }

  ReportHistoryOfEntrepreneurComments.init({
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
    modelName: 'ReportHistoryOfEntrepreneurComments',
  });

  return ReportHistoryOfEntrepreneurComments;
};





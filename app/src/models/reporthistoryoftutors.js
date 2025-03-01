'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfTutors extends Model {
    static associate(models) {
      ReportHistoryOfTutors.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfTutors.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfTutors.belongsTo(models.User, { foreignKey: 'handlerAdminUserId' });
    }
  }
  ReportHistoryOfTutors.init({
    reportedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    handlerAdminUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Admins',
        key: 'id'
      },
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
    modelName: 'ReportHistoryOfTutors',
  });
  return ReportHistoryOfTutors;
};
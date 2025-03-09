'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportHistoryOfReviews extends Model {
    static associate(models) {
      ReportHistoryOfReviews.belongsTo(models.User, { foreignKey: 'reportedByUserId' });
      ReportHistoryOfReviews.belongsTo(models.User, { foreignKey: 'createdByUserId' });
      ReportHistoryOfReviews.belongsTo(models.User, { foreignKey: 'handlerAdminUserId' });
    }
  }
  ReportHistoryOfReviews.init({
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
        model: 'Users',
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
    modelName: 'ReportHistoryOfReviews',
  });
  return ReportHistoryOfReviews;
};
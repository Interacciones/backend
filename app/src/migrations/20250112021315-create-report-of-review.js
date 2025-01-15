'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReportOfReviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ReviewMessages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:"pending",
        validate: {
          isIn: [['pending', 'accepted', 'rejected']],
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReportOfReviews');
  }
};

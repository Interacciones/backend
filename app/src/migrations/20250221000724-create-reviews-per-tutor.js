'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReviewsPerTutors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tutorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TutorProfiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      avgRating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      reviewAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      oneStarReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      twoStarReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      threeStarReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      fourStarReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      fiveStarReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReviewsPerTutors');
  }
};

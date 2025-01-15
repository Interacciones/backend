'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReviewMessages', {
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
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING(1000)
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
    await queryInterface.dropTable('ReviewMessages');
  }
};

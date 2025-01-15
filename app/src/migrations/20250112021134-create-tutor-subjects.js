'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TutorSubjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TutorProfiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idSubject: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'StudySubjects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('TutorSubjects');
  }
};

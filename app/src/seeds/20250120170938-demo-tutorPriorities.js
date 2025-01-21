'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TutorPriorities', [
      { idTutor: 1, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 2, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 7, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TutorPriorities', null, {});
  }
};

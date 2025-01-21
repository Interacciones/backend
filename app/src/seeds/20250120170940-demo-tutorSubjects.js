'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TutorSubjects', [
      { idTutor: 1, idSubject: 1, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 1, idSubject: 2, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 2, idSubject: 3, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 2, idSubject: 4, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 3, idSubject: 5, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 3, idSubject: 6, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 4, idSubject: 7, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 4, idSubject: 8, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 5, idSubject: 9, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 5, idSubject: 10, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 6, idSubject: 1, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 6, idSubject: 2, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 7, idSubject: 3, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 7, idSubject: 4, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 8, idSubject: 5, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 8, idSubject: 6, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 9, idSubject: 7, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 9, idSubject: 8, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 10, idSubject: 9, createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 10, idSubject: 10, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TutorSubjects', null, {});
  },
};

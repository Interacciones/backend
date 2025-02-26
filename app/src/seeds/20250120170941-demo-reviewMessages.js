'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ReviewMessages', [
      { userId: 6, tutorId: 1, rating: 5, content: "Excelente tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, tutorId: 1, rating: 4, content: "Buen tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, tutorId: 1, rating: 3, content: "Regular tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 4, tutorId: 2, rating: 5, content: "Excelente tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 5, tutorId: 2, rating: 4, content: "Buen tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 6, tutorId: 2, rating: 3, content: "Regular tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 7, tutorId: 3, rating: 5, content: "Excelente tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 8, tutorId: 3, rating: 4, content: "Buen tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 9, tutorId: 3, rating: 3, content: "Regular tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 10, tutorId: 8, rating: 5, content: "Excelente tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 11, tutorId: 8, rating: 4, content: "Buen tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 12, tutorId: 8, rating: 3, content: "Regular tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 13, tutorId: 9, rating: 5, content: "Excelente tutor", createdAt: new Date(), updatedAt: new Date() },
      { userId: 14, tutorId: 9, rating: 4, content: "Buen tutor", createdAt: new Date(), updatedAt: new Date()}
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ReviewMessages', null, {});
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReportOfReviews', [
      {
        userId: 1,
        reviewId: 1,
        description: 'La review contiene lenguaje inapropiado.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        reviewId: 2,
        description: 'La review es spam.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        reviewId: 3,
        description: 'La review no es relevante.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        reviewId: 4,
        description: 'La review contiene información falsa.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        reviewId: 5,
        description: 'La review es ofensiva.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 6,
        reviewId: 6,
        description: 'La review no cumple con las normas de la comunidad.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 7,
        reviewId: 7,
        description: 'La review es irrelevante.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 8,
        reviewId: 8,
        description: 'La review contiene lenguaje ofensivo.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 9,
        reviewId: 9,
        description: 'La review es spam.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 10,
        reviewId: 10,
        description: 'La review contiene información falsa.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReportOfReviews', null, {});
  }
};

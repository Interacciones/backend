'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewsPerTutors', [
      {
        tutorId: 1,
        avgRating: (5 + 4 + 3) / 3,
        reviewAmount: 3,
        oneStarReviews: 0,
        twoStarReviews: 0,
        threeStarReviews: 1,
        fourStarReviews: 1,
        fiveStarReviews: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tutorId: 2,
        avgRating: (5 + 4 + 3) / 3,
        reviewAmount: 3,
        oneStarReviews: 0,
        twoStarReviews: 0,
        threeStarReviews: 1,
        fourStarReviews: 1,
        fiveStarReviews: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tutorId: 3,
        avgRating: (5 + 4 + 3) / 3,
        reviewAmount: 3,
        oneStarReviews: 0,
        twoStarReviews: 0,
        threeStarReviews: 1,
        fourStarReviews: 1,
        fiveStarReviews: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tutorId: 8,
        avgRating: (5 + 4 + 3) / 3,
        reviewAmount: 3,
        oneStarReviews: 0,
        twoStarReviews: 0,
        threeStarReviews: 1,
        fourStarReviews: 1,
        fiveStarReviews: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tutorId: 9,
        avgRating: (5 + 4) / 2,
        reviewAmount: 2,
        oneStarReviews: 0,
        twoStarReviews: 0,
        threeStarReviews: 0,
        fourStarReviews: 1,
        fiveStarReviews: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewsPerTutors', null, {});
  }
};

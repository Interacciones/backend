'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TutorProfiles', [
      { userId: 1, description: 'Math expert with 5+ years of experience', priceDescription: 'Affordable rates for quality tutoring', photo: 'https://example.com/photo1.jpg', contactMail: 'john.tutor@example.com', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, description: 'Physics tutor for high school students', priceDescription: 'Physics made easy!', photo: 'https://example.com/photo2.jpg', contactMail: 'jane.tutor@example.com', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, description: 'Biology specialist with online classes', priceDescription: 'Interactive biology lessons', photo: 'https://example.com/photo3.jpg', contactMail: 'alice.tutor@example.com', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 4, description: 'Chemistry tutor for university students', priceDescription: 'Advanced chemistry topics explained', photo: 'https://example.com/photo4.jpg', contactMail: 'bob.tutor@example.com', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 5, description: 'English language tutor with certifications', priceDescription: 'Learn English fluently', photo: 'https://example.com/photo5.jpg', contactMail: 'charlie.tutor@example.com', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 6, description: 'History tutor passionate about teaching', priceDescription: 'Explore history with me', photo: 'https://example.com/photo6.jpg', contactMail: 'diana.tutor@example.com', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 7, description: 'Programming tutor specializing in JavaScript', priceDescription: 'Code with confidence', photo: 'https://example.com/photo7.jpg', contactMail: 'eve.tutor@example.com', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 8, description: 'Art tutor for painting and sketching', priceDescription: 'Unleash your creativity', photo: 'https://example.com/photo8.jpg', contactMail: 'frank.tutor@example.com', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 9, description: 'Spanish language tutor for beginners', priceDescription: 'Learn Spanish step by step', photo: 'https://example.com/photo9.jpg', contactMail: 'grace.tutor@example.com', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 10, description: 'Music tutor specializing in piano', priceDescription: 'Learn piano with personalized lessons', photo: 'https://example.com/photo10.jpg', contactMail: 'hank.tutor@example.com', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TutorProfiles', null, {});
  },
};

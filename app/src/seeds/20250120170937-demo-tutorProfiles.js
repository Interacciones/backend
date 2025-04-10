'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TutorProfiles', [
      { userId: 1, description: 'Math expert with 5+ years of experience', priceDescription: 'Affordable rates for quality tutoring', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000001', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, description: 'Physics tutor for high school students', priceDescription: 'Physics made easy!', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000002', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, description: 'Biology specialist with online classes', priceDescription: 'Interactive biology lessons', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000003', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 4, description: 'Chemistry tutor for university students', priceDescription: 'Advanced chemistry topics explained', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000004', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 5, description: 'English language tutor with certifications', priceDescription: 'Learn English fluently', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000005', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 6, description: 'History tutor passionate about teaching', priceDescription: 'Explore history with me', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000006', isPublished: false, createdAt: new Date(), updatedAt: new Date() },
      { userId: 7, description: 'Programming tutor specializing in JavaScript', priceDescription: 'Code with confidence', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000007', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 8, description: 'Art tutor for painting and sketching', priceDescription: 'Unleash your creativity', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000008', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 9, description: 'Spanish language tutor for beginners', priceDescription: 'Learn Spanish step by step', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000009', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
      { userId: 10, description: 'Music tutor specializing in piano', priceDescription: 'Learn piano with personalized lessons', photo: "https://interac-ciones.s3.amazonaws.com/default.jpg", contactNumber: '+56900000010', isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TutorProfiles', null, {});
  },
};

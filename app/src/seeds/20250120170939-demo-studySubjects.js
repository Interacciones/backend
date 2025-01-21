'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('StudySubjects', [
      { subject: 'Mathematics', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Physics', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Chemistry', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Biology', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'English', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'History', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Programming', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Art', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Spanish', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Music', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('StudySubjects', null, {});
  },
};

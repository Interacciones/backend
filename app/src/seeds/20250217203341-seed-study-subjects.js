'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('StudySubjects', [
      { subject: 'Otros', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Matemáticas', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Programación', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Ciencias', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Física', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Química', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Biología', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Historia', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Lengua y literatura', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Música', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Artes visuales', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Derecho', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Economía', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Marketing', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Psicología', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Política', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Industrial', createdAt: new Date(), updatedAt: new Date() },
      { subject: 'Comercial', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('StudySubjects', null, {});
  }
};

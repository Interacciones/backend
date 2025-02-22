'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReportOfTutors', [
      {
        userId: 1,
        tutorId: 2,
        description: 'El tutor no se presentó a la clase programada.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        tutorId: 3,
        description: 'El tutor fue muy grosero durante la clase.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        tutorId: 4,
        description: 'El tutor no tenía conocimientos suficientes sobre el tema.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        tutorId: 5,
        description: 'El tutor canceló la clase en el último momento.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        tutorId: 6,
        description: 'El tutor no respondió a mis mensajes.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 6,
        tutorId: 7,
        description: 'El tutor no cumplió con el horario acordado.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 7,
        tutorId: 8,
        description: 'El tutor no tenía el material necesario para la clase.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 8,
        tutorId: 9,
        description: 'El tutor no explicó bien los conceptos.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 9,
        tutorId: 10,
        description: 'El tutor no tenía buena conexión a internet.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 10,
        tutorId: 1,
        description: 'El tutor no fue puntual.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReportOfTutors', null, {});
  }
};

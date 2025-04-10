'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TutorCourses', [
      { idTutor: 1, subject: "Calculo I", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 1, subject: "Intro a la programacion", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 1, subject: "Calculo II", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 1, subject: "Calculo III", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 2, subject: "Cálculo I", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 2, subject: "Cálculo II", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 3, subject: "Quimica", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 3, subject: "Fisica", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 3, subject: "Termodinamica", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 4, subject: "Letras", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 4, subject: "Italiano", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 4, subject: "Español", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 5, subject: "Español", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 5, subject: "Aleman", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 5, subject: "Japones", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 6, subject: "EDD", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 6, subject: "Electro", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 6, subject: "Microecnomía", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 7, subject: "Macroeconomía", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 7, subject: "Estadistica", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 7, subject: "Calculo I", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 8, subject: "Calculo II", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 8, subject: "Calculo III", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 8, subject: "Cálculo IV", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 9, subject: "Cálculo I", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 9, subject: "Cálculo II", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 9, subject: "Calculo III", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 10, subject: "Calculo IV", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 10, subject: "Cálculo V", createdAt: new Date(), updatedAt: new Date() },
      { idTutor: 10, subject: "Calculo VI", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TutorCourses', null, {});
  }
};

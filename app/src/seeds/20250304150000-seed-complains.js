'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Complains', [
      {
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        content: 'I am facing an issue with the tutor profile.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        content: 'The course content is not as described.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        content: 'I am unable to contact the tutor.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob',
        lastName: 'Brown',
        email: 'bob.brown@example.com',
        content: 'The tutor is not responding to my messages.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Charlie',
        lastName: 'Davis',
        email: 'charlie.davis@example.com',
        content: 'I am having trouble with the payment process.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Complains', null, {});
  }
};
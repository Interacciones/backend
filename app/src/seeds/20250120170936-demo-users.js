'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      { name: 'John', lastName: 'Doe', email: 'john.doe@example.com', isBanned: false, token: 'abcd1234', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', isBanned: false, token: 'efgh5678', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', isBanned: false, token: 'ijkl9012', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', isBanned: true, token: 'mnop3456', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Charlie', lastName: 'Davis', email: 'charlie.davis@example.com', isBanned: false, token: 'qrst7890', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Diana', lastName: 'Garcia', email: 'diana.garcia@example.com', isBanned: false, token: 'uvwx1234', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Eve', lastName: 'Martinez', email: 'eve.martinez@example.com', isBanned: true, token: 'yzab5678', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Frank', lastName: 'Taylor', email: 'frank.taylor@example.com', isBanned: false, token: 'cdef9012', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Grace', lastName: 'Harris', email: 'grace.harris@example.com', isBanned: false, token: 'ghij3456', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hank', lastName: 'Lewis', email: 'hank.lewis@example.com', isBanned: true, token: 'klmn7890', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ivy', lastName: 'Walker', email: 'ivy.walker@example.com', isBanned: false, token: 'opqr1234', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jack', lastName: 'Robinson', email: 'jack.robinson@example.com', isBanned: false, token: 'stuv5678', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kate', lastName: 'Hall', email: 'kate.hall@example.com', isBanned: false, token: 'wxyz9012', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Leo', lastName: 'Young', email: 'leo.young@example.com', isBanned: false, token: 'abcd3456', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mona', lastName: 'King', email: 'mona.king@example.com', isBanned: true, token: 'efgh7890', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

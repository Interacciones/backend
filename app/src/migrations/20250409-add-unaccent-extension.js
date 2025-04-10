'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS unaccent;');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS unaccent;');
  }
};
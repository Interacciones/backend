'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProjectCategoryAssignments', [
      // Project 1: Eco-Friendly Stationery -> Sostenibilidad, Arte y Diseño
      {
        projectId: 1,
        categoryId: 10, // Sostenibilidad
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30))
      },
      {
        projectId: 1,
        categoryId: 7, // Arte y Diseño
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30))
      },

      // Project 2: Organic Skincare Line -> Salud y Bienestar, Maquillaje
      {
        projectId: 2,
        categoryId: 6, // Salud y Bienestar
        createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 25))
      },
      {
        projectId: 2,
        categoryId: 9, // Maquillaje
        createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 25))
      },

      // Project 3: Tech Innovations Hub -> Tecnología
      {
        projectId: 3,
        categoryId: 1, // Tecnología
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 20))
      },

      // Project 4: Sustainable Fashion -> Moda y Accesorios, Sostenibilidad
      {
        projectId: 4,
        categoryId: 8, // Moda y Accesorios
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
      },
      {
        projectId: 4,
        categoryId: 10, // Sostenibilidad
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
      },

      // Project 5: Artisan Coffee Roasters -> Alimentación, Servicios
      {
        projectId: 5,
        categoryId: 2, // Alimentación
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 15))
      },
      {
        projectId: 5,
        categoryId: 4, // Servicios
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 15))
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProjectCategoryAssignments', null, {});
  }
};

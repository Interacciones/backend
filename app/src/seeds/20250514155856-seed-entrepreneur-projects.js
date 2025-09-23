'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('EntrepreuneurProjects', [
      {
        userId: 1, // John Doe
        name: 'Eco-Friendly Stationery',
        description: 'Handmade stationery products made from recycled materials. Our mission is to reduce waste while creating beautiful, functional products for everyday use.',
        instagramProfile: 'eco_stationery',
        showContact: true,
        isActive: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30))
      },
      {
        userId: 2, // Jane Smith
        name: 'Organic Skincare Line',
        description: 'All-natural skincare products made with organic ingredients. Our products are cruelty-free and come in biodegradable packaging.',
        instagramProfile: 'jane_organics',
        showContact: true,
        isActive: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 25))
      },
      {
        userId: 5, // Charlie Davis
        name: 'Tech Innovations Hub',
        description: 'Creating innovative technology solutions for everyday problems. Our latest project is a smart home energy management system that helps reduce electricity consumption.',
        instagramProfile: 'tech_innovations_hub',
        showContact: false,
        isActive: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 20))
      },
      {
        userId: 6, // Diana Garcia
        name: 'Sustainable Fashion',
        description: 'Clothing line made from sustainable materials with ethical manufacturing practices. We believe fashion can be both stylish and environmentally responsible.',
        instagramProfile: 'sustainable_by_diana',
        showContact: true,
        isActive: false, // Pending approval
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
      },
      {
        userId: 8, // Frank Taylor
        name: 'Artisan Coffee Roasters',
        description: 'Small-batch coffee roastery focusing on single-origin beans and direct trade with farmers. We bring the best coffee experiences while supporting sustainable farming practices.',
        instagramProfile: 'franks_coffee',
        showContact: true,
        isActive: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 15))
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EntrepreuneurProjects', null, {});
  }
}; 
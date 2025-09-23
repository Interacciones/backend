'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('EntrepreneurProjectPhotos', [
      // Photos for Project 1 (Eco-Friendly Stationery)
      {
        projectId: 1,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6750(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30))
      },
      {
        projectId: 1,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6751(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30))
      },
      
      // Photos for Project 2 (Organic Skincare Line)
      {
        projectId: 2,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6752(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 25))
      },
      {
        projectId: 2,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6750(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 25))
      },
      
      // Photos for Project 3 (Tech Innovations Hub)
      {
        projectId: 3,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6751(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 20))
      },
      {
        projectId: 3,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6752(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 20))
      },
      
      // Photos for Project 4 (Sustainable Fashion)
      {
        projectId: 4,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6750(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
      },
      {
        projectId: 4,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6751(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
      },
      
      // Photos for Project 5 (Artisan Coffee Roasters)
      {
        projectId: 5,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6752(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 15))
      },
      {
        projectId: 5,
        photo: 'https://s3.us-east-1.amazonaws.com/interacciones.entrepreneurs/IMG_6750(1).JPEG',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 15))
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EntrepreneurProjectPhotos', null, {});
  }
}; 
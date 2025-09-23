'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProjectCategories', [
      {
        name: 'Tecnología',
        description: 'Proyectos relacionados con desarrollo de software, aplicaciones, sitios web, inteligencia artificial y tecnología en general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Alimentación',
        description: 'Emprendimientos del sector gastronómico, restaurantes, catering, productos alimenticios y bebidas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eventos',
        description: 'Organización de eventos, fiestas, conferencias, celebraciones y actividades sociales',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Servicios',
        description: 'Servicios profesionales, consultorías, asesorías, limpieza, mantenimiento y servicios en general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mascotas',
        description: 'Productos y servicios para mascotas, veterinaria, cuidado animal, accesorios y alimentación',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Salud y Bienestar',
        description: 'Productos y servicios relacionados con salud, fitness, nutrición, bienestar y cuidado personal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Arte y Diseño',
        description: 'Diseño gráfico, arte, fotografía, artesanías, productos creativos y servicios de diseño',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Artesanía',
        description: 'Productos hechos a mano, trabajos artesanales, manualidades, tejidos, cerámica y objetos únicos creados por artesanos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
          name: 'Moda y Accesorios',
          description: 'Ropa, accesorios, joyería, zapatos y productos relacionados con la moda',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Maquillaje',
          description: 'Productos de belleza, cosméticos, maquillaje y servicios de belleza',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      {
        name: 'Sostenibilidad',
        description: 'Proyectos ecológicos, productos sostenibles, reciclaje, energías renovables y cuidado del medio ambiente',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Transporte',
        description: 'Servicios de transporte, logística, delivery, movilidad urbana y soluciones de transporte',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Entretenimiento',
        description: 'Juegos, entretenimiento, música, espectáculos, aplicaciones de entretenimiento y contenido digital',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProjectCategories', null, {});
  }
};

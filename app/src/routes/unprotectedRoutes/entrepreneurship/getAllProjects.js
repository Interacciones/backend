const db = require('../../../models');
const { Op } = require('sequelize');

const DEFAULT_QUANTITY = 10;
const DEFAULT_PAGE = 1;

async function getAllEntrepreneurProjects(quantity, offset) {
  return await db.EntrepreuneurProject.findAndCountAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact'],
    include: [
      {
        model: db.User,
        attributes: ['name', 'lastName', 'email'],
      },
      {
        model: db.EntrepreneurProjectPhoto,
        attributes: ['id', 'photo'],
      }
    ],
    quantity,
    offset,
    order: [['id', 'DESC']],
  });
}

module.exports = async (ctx) => {
  try {
    // Get pagination parameters from query
    const { quantity = DEFAULT_QUANTITY, page = DEFAULT_PAGE } = ctx.query;
    const parsedQuantity = parseInt(quantity) || DEFAULT_QUANTITY;
    const parsedPage = parseInt(page) || DEFAULT_PAGE;
    const offset = (parsedPage - 1) * parsedQuantity;

    // Fetch projects with pagination
    const { rows: projects, count: totalCount } = await getAllEntrepreneurProjects(parsedQuantity, offset);

    // Transform data for response
    const formattedProjects = projects.map(project => {
      const projectData = project.toJSON();
      return {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        instagramProfile: projectData.instagramProfile,
        showContact: projectData.showContact,
        user: {
          name: projectData.User.name,
          lastName: projectData.User.lastName,
          email: projectData.showContact ? projectData.User.email : null
        },
        photos: projectData.EntrepreneurProjectPhotos.map(photo => photo.photo)
      };
    });

    // Return success response
    ctx.body = {
      message: 'Entrepreneur projects fetched successfully',
      data: formattedProjects,
      pagination: {
        total: totalCount,
        page: parsedPage,
        quantity: parsedQuantity,
        totalPages: Math.ceil(totalCount / parsedQuantity)
      }
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching entrepreneur projects:', error);
    ctx.body = {
      message: 'Failed to fetch entrepreneur projects',
      error: error.message,
    };
    ctx.status = 500;
  }
}; 
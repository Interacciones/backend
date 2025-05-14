const db = require('../../../models');
const { Op } = require('sequelize');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

async function getAllEntrepreneurProjects(limit, offset) {
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
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
}

module.exports = async (ctx) => {
  try {
    // Get pagination parameters from query
    const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = ctx.query;
    const parsedLimit = parseInt(limit) || DEFAULT_LIMIT;
    const parsedPage = parseInt(page) || DEFAULT_PAGE;
    const offset = (parsedPage - 1) * parsedLimit;

    // Fetch projects with pagination
    const { rows: projects, count: totalCount } = await getAllEntrepreneurProjects(parsedLimit, offset);

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
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit)
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
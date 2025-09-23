const db = require('../../../models');
const { Op } = require('sequelize');

const ALLOWED_QUANTITIES = [9, 15, 21];
const DEFAULT_QUANTITY = 15;

async function getAllEntrepreneurProjects(limit, offset, categoryId) {
  const includeOptions = [
    {
      model: db.User,
      attributes: ['name', 'lastName', 'email'],
    },
    {
      model: db.EntrepreneurProjectPhoto,
      attributes: ['id', 'photo'],
    },
    {
      model: db.ProjectCategory,
      attributes: ['id', 'name', 'description'],
      through: { attributes: [] } // Don't include junction table data
    }
  ];

  // Add category filter if provided
  if (categoryId) {
    includeOptions[2].where = { id: categoryId };
    includeOptions[2].required = true; // Inner join to filter by category
  }

  return await db.EntrepreuneurProject.findAndCountAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact'],
    include: includeOptions,
    limit,
    offset,
    order: [['id', 'DESC']],
    distinct: true // Important for accurate count with joins
  });
}

module.exports = async (ctx) => {
  try {
    // Get pagination and filter parameters from query
    const { cantidad, pagina, categoryId } = ctx.query;
    const limit = ALLOWED_QUANTITIES.includes(parseInt(cantidad)) ? parseInt(cantidad) : DEFAULT_QUANTITY;
    const page = parseInt(pagina) || 1;
    const parsedCategoryId = categoryId ? parseInt(categoryId) : null;
    const offset = (page - 1) * limit;

    // Validate category if provided
    if (parsedCategoryId) {
      const category = await db.ProjectCategory.findByPk(parsedCategoryId);
      
      if (!category) {
        ctx.body = {
          message: 'Invalid category ID',
        };
        ctx.status = 400;
        return;
      }
    }

    // Fetch projects with pagination and filtering
    const { rows: projects, count: totalCount } = await getAllEntrepreneurProjects(limit, offset, parsedCategoryId);

    // Transform data for response
    const formattedProjects = projects.map(project => {
      const projectData = project.toJSON();
      return {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        instagramProfile: projectData.instagramProfile,
        showContact: projectData.showContact,
        categories: projectData.ProjectCategories ? projectData.ProjectCategories.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description
        })) : [],
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
      totalCount,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        categoryId: parsedCategoryId
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
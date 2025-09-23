const db = require('../../../models');

module.exports = async (ctx) => {
  try {
    const categories = await db.ProjectCategory.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']]
    });

    ctx.body = {
      message: 'Categories fetched successfully',
      data: categories
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching categories:', error);
    ctx.body = {
      message: 'Failed to fetch categories',
      error: error.message
    };
    ctx.status = 500;
  }
};

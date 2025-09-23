const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

module.exports = async (ctx) => {
  try {
    const isAdmin = await checkAdmin(ctx);
    if (!isAdmin) {
      ctx.body = { message: 'Unauthorized: Admin access required' };
      ctx.status = 401;
      return;
    }

    const { name, description } = ctx.request.body;

    if (!name) {
      ctx.body = { message: 'Category name is required' };
      ctx.status = 400;
      return;
    }

    // Check if category already exists
    const existingCategory = await db.ProjectCategory.findOne({
      where: { name }
    });

    if (existingCategory) {
      ctx.body = { message: 'Category with this name already exists' };
      ctx.status = 409;
      return;
    }

    const category = await db.ProjectCategory.create({
      name,
      description: description || null
    });

    ctx.body = {
      message: 'Category created successfully',
      data: category
    };
    ctx.status = 201;
  } catch (error) {
    console.error('Error creating category:', error);
    ctx.body = {
      message: 'Failed to create category',
      error: error.message
    };
    ctx.status = 500;
  }
};

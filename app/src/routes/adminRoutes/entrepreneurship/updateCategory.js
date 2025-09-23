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

    const { id } = ctx.params;
    const { name, description } = ctx.request.body;

    if (!id || isNaN(id)) {
      ctx.body = { message: 'Invalid category ID' };
      ctx.status = 400;
      return;
    }

    const category = await db.ProjectCategory.findByPk(id);
    if (!category) {
      ctx.body = { message: 'Category not found' };
      ctx.status = 404;
      return;
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== category.name) {
      const existingCategory = await db.ProjectCategory.findOne({
        where: { name }
      });

      if (existingCategory) {
        ctx.body = { message: 'Category with this name already exists' };
        ctx.status = 409;
        return;
      }
    }

    const updatedCategory = await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description
    });

    ctx.body = {
      message: 'Category updated successfully',
      data: updatedCategory
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error updating category:', error);
    ctx.body = {
      message: 'Failed to update category',
      error: error.message
    };
    ctx.status = 500;
  }
};

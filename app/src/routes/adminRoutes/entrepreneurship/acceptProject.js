const db = require('../../../models');
const checkAdminStatus = require('../../authorization/checkAdminStatus');

async function getProjectById(id) {
  return await db.EntrepreuneurProject.findByPk(id, {
    include: [
      {
        model: db.User,
        attributes: ['name', 'lastName', 'email'],
      }
    ]
  });
}

module.exports = async (ctx) => {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminStatus(ctx);
    if (!isAdmin) {
      ctx.body = { message: 'Unauthorized: Admin access required' };
      ctx.status = 401;
      return;
    }

    const { id } = ctx.params;
    
    if (!id || isNaN(id)) {
      ctx.body = {
        message: 'Invalid project ID',
      };
      ctx.status = 400;
      return;
    }

    // Get the project
    const project = await getProjectById(id);

    if (!project) {
      ctx.body = {
        message: 'Project not found',
      };
      ctx.status = 404;
      return;
    }

    // Update project to active status
    await project.update({ isActive: true });

    // You could also add email notification here to notify the user that their project was approved
    // Similar to what's done in the tutor approval process

    // Return success response
    ctx.body = {
      message: 'Project has been approved successfully',
      data: {
        id: project.id,
        name: project.name,
        user: {
          name: project.User.name,
          lastName: project.User.lastName
        },
        isActive: project.isActive
      }
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error accepting project:', error);
    ctx.body = {
      message: 'Failed to accept project',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
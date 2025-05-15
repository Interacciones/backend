const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

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

async function deleteProjectAndPhotos(projectId) {
  // First, delete all associated photos
  await db.EntrepreneurProjectPhoto.destroy({
    where: { projectId }
  });
  
  // Then delete the project itself
  await db.EntrepreuneurProject.destroy({
    where: { id: projectId }
  });
}

module.exports = async (ctx) => {
  try {
    // Check admin authorization
    const isAdmin = await checkAdmin(ctx);
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

    // Store some info for the response before deletion
    const projectInfo = {
      id: project.id,
      name: project.name,
      user: {
        name: project.User.name,
        lastName: project.User.lastName
      }
    };

    // Delete the project and its photos
    await deleteProjectAndPhotos(id);

    // You could also add email notification here to notify the user that their project was rejected
    // Similar to what's done in the tutor rejection process

    // Return success response
    ctx.body = {
      message: 'Project has been rejected and deleted successfully',
      data: projectInfo
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error rejecting project:', error);
    ctx.body = {
      message: 'Failed to reject project',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
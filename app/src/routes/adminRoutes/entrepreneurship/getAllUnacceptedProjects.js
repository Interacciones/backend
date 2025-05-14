const db = require('../../../models');
const checkAdminStatus = require('../../authorization/checkAdminStatus');

async function getUnacceptedProjects() {
  return await db.EntrepreuneurProject.findAll({
    where: { isActive: false },
    attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact', 'createdAt', 'updatedAt'],
    include: [
      {
        model: db.User,
        attributes: ['id', 'name', 'lastName', 'email'],
      },
      {
        model: db.EntrepreneurProjectPhoto,
        attributes: ['id', 'photo'],
      }
    ],
    order: [['createdAt', 'ASC']] // Oldest first
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

    // Get all projects pending approval
    const projects = await getUnacceptedProjects();

    // Format the projects for response
    const formattedProjects = projects.map(project => {
      const projectData = project.toJSON();
      return {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        instagramProfile: projectData.instagramProfile,
        showContact: projectData.showContact,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        user: {
          id: projectData.User.id,
          name: projectData.User.name,
          lastName: projectData.User.lastName,
          email: projectData.User.email
        },
        photos: projectData.EntrepreneurProjectPhotos.map(photo => ({
          id: photo.id,
          url: photo.photo
        }))
      };
    });

    // Return success response
    ctx.body = {
      message: 'Unaccepted entrepreneur projects fetched successfully',
      data: formattedProjects
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching unaccepted projects:', error);
    ctx.body = {
      message: 'Failed to fetch unaccepted projects',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

async function getUserProjects(userId) {
  return await db.EntrepreuneurProject.findAll({
    where: { userId },
    attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact', 'isActive', 'createdAt', 'updatedAt'],
    include: [
      {
        model: db.EntrepreneurProjectPhoto,
        attributes: ['id', 'photo'],
      }
    ],
    order: [['createdAt', 'DESC']] // Show newest projects first
  });
}

module.exports = async (ctx) => {
  try {
    // Check if user is authenticated
    const userToken = await checkVerifiedUser(ctx);
    if (!userToken) {
      ctx.body = { message: 'User is not verified' };
      ctx.status = 401;
      return;
    }

    // Get user from token
    const user = await db.User.findOne({
      where: { token: userToken.uid }
    });

    if (!user) {
      ctx.body = { message: 'User not found' };
      ctx.status = 404;
      return;
    }

    // Find all projects that belong to this user
    const projects = await getUserProjects(user.id);

    if (!projects || projects.length === 0) {
      ctx.body = {
        message: 'You have no projects yet',
        data: []
      };
      ctx.status = 200;
      return;
    }

    // Format projects data for response
    const formattedProjects = projects.map(project => {
      const projectData = project.toJSON();
      return {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        instagramProfile: projectData.instagramProfile,
        showContact: projectData.showContact,
        isActive: projectData.isActive,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        photos: projectData.EntrepreneurProjectPhotos.map(photo => ({
          id: photo.id,
          url: photo.photo
        }))
      };
    });

    // Return success response
    ctx.body = {
      message: 'Projects fetched successfully',
      data: formattedProjects,
      count: formattedProjects.length
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    ctx.body = {
      message: 'Failed to fetch projects',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
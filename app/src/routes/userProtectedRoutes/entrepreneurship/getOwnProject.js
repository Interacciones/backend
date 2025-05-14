const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

async function getUserProject(userId) {
  return await db.EntrepreuneurProject.findOne({
    where: { userId },
    attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact'],
    include: [
      {
        model: db.EntrepreneurProjectPhoto,
        attributes: ['id', 'photo'],
      }
    ]
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

    // Find the project that belongs to this user
    const project = await getUserProject(user.id);

    if (!project) {
      ctx.body = {
        message: 'You have no project yet',
      };
      ctx.status = 404;
      return;
    }

    // Format project data for response
    const projectData = project.toJSON();
    
    const formattedProject = {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
      instagramProfile: projectData.instagramProfile,
      showContact: projectData.showContact,
      photos: projectData.EntrepreneurProjectPhotos.map(photo => ({
        id: photo.id,
        url: photo.photo
      }))
    };

    // Return success response
    ctx.body = {
      message: 'Project fetched successfully',
      data: formattedProject
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching user project:', error);
    ctx.body = {
      message: 'Failed to fetch project',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
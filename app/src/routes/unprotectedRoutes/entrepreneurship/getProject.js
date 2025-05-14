const db = require('../../../models');

async function getEntrepreneurProjectById(id) {
  return await db.EntrepreuneurProject.findOne({
    where: { id, isActive: true },
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
    ]
  });
}

module.exports = async (ctx) => {
  try {
    const { id } = ctx.params;
    
    if (!id || isNaN(id)) {
      ctx.body = {
        message: 'Invalid project ID',
      };
      ctx.status = 400;
      return;
    }

    const project = await getEntrepreneurProjectById(id);

    if (!project) {
      ctx.body = {
        message: 'Project not found or not active',
      };
      ctx.status = 404;
      return;
    }

    const projectData = project.toJSON();
    
    const formattedProject = {
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

    ctx.body = {
      message: 'Project fetched successfully',
      data: formattedProject
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching project:', error);
    ctx.body = {
      message: 'Failed to fetch project',
      error: error.message,
    };
    ctx.status = 500;
  }
}; 
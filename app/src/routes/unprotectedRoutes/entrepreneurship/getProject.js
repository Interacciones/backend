const db = require('../../../models');

async function getEntrepreneurProjectById(id, includeUser = false) {
  const includeOptions = [
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
  
  if (includeUser) {
    includeOptions.push({
      model: db.User,
      attributes: ['name', 'lastName', 'email'],
    });
  }

  return await db.EntrepreuneurProject.findOne({
    where: { id, isActive: true },
    attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact'],
    include: includeOptions
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

    // First query to get basic project data including showContact flag
    const project = await getEntrepreneurProjectById(id);

    if (!project) {
      ctx.body = {
        message: 'Project not found or not active',
      };
      ctx.status = 404;
      return;
    }

    const projectData = project.toJSON();
    let formattedProject = {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
      instagramProfile: projectData.instagramProfile,
      categories: projectData.ProjectCategories ? projectData.ProjectCategories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
      })) : [],
      photos: projectData.EntrepreneurProjectPhotos.map(photo => photo.photo)
    };
    
    // If showContact is true, fetch user data in a second query
    if (projectData.showContact) {
      const projectWithUser = await getEntrepreneurProjectById(id, true);
      const userData = projectWithUser.toJSON().User;
      
      formattedProject.user = {
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email
      };
    }

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
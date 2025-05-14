const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

// Placeholder function for S3 upload - will be replaced by actual implementation later
async function uploadProjectPhoto(projectId, photoIndex, photo) {
  // This is a placeholder - in the real implementation, this would upload to S3
  const imageKey = `project_${projectId}_photo_${photoIndex}.jpg`;
  const imageUrl = `https://interac-ciones.s3.amazonaws.com/${imageKey}`;
  
  // Return fake S3 URL as placeholder
  return imageUrl;
}

async function createEntrepreneurProject(userId, projectData) {
  return await db.EntrepreuneurProject.create({
    userId,
    name: projectData.name,
    description: projectData.description,
    instagramProfile: projectData.instagramProfile || null,
    showContact: projectData.showContact || false,
    isActive: false // Always create as inactive until admin approval
  });
}

async function saveProjectPhotos(projectId, photos) {
  const photoUrls = [];
  
  // Loop through photos and save them
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    // Upload to S3 (placeholder function)
    const photoUrl = await uploadProjectPhoto(projectId, i, photo);
    
    // Save photo URL to database
    const projectPhoto = await db.EntrepreneurProjectPhoto.create({
      projectId,
      photo: photoUrl
    });
    
    photoUrls.push(photoUrl);
  }
  
  return photoUrls;
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

    // Extract project data from request body
    const { name, description, instagramProfile, showContact } = ctx.request.body;
    
    // Validate required fields
    if (!name || !description) {
      ctx.body = {
        message: 'Missing required fields: name and description are required',
      };
      ctx.status = 400;
      return;
    }

    // Check if photos were uploaded
    const photos = ctx.request.files && ctx.request.files.photos ? 
      (Array.isArray(ctx.request.files.photos) ? ctx.request.files.photos : [ctx.request.files.photos]) : 
      [];
      
    if (photos.length === 0) {
      ctx.body = {
        message: 'At least one photo is required',
      };
      ctx.status = 400;
      return;
    }

    // Create the project
    const project = await createEntrepreneurProject(user.id, {
      name,
      description,
      instagramProfile,
      showContact: showContact === 'true' || showContact === true
    });

    // Save project photos
    const photoUrls = await saveProjectPhotos(project.id, photos);

    // Return success response
    ctx.body = {
      message: 'Project created successfully and pending admin approval',
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        instagramProfile: project.instagramProfile,
        showContact: project.showContact,
        isActive: project.isActive,
        photos: photoUrls
      }
    };
    ctx.status = 201;
  } catch (error) {
    console.error('Error creating project:', error);
    ctx.body = {
      message: 'Failed to create project',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
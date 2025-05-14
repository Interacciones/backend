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

async function getUserProject(userId, projectId) {
  return await db.EntrepreuneurProject.findOne({
    where: { 
      id: projectId,
      userId
    },
    include: [
      {
        model: db.EntrepreneurProjectPhoto,
        attributes: ['id', 'photo']
      }
    ]
  });
}

async function updateProjectData(project, projectData) {
  return await project.update({
    name: projectData.name || project.name,
    description: projectData.description || project.description,
    instagramProfile: projectData.instagramProfile !== undefined ? projectData.instagramProfile : project.instagramProfile,
    showContact: projectData.showContact !== undefined ? projectData.showContact : project.showContact,
    isActive: false // Reset to false, requiring admin approval again
  });
}

async function handleProjectPhotos(projectId, currentPhotos, newPhotos, photosToKeep) {
  const photoUrls = [];
  const keepPhotoIds = photosToKeep ? photosToKeep.split(',').map(Number) : [];
  
  // Delete photos that are not in the keepPhotoIds array
  if (Array.isArray(currentPhotos) && keepPhotoIds.length > 0) {
    for (const photo of currentPhotos) {
      if (!keepPhotoIds.includes(photo.id)) {
        await db.EntrepreneurProjectPhoto.destroy({
          where: { id: photo.id }
        });
      } else {
        photoUrls.push(photo.photo);
      }
    }
  } else if (Array.isArray(currentPhotos) && keepPhotoIds.length === 0) {
    // Delete all existing photos if keepPhotoIds is empty
    await db.EntrepreneurProjectPhoto.destroy({
      where: { projectId }
    });
  }
  
  // Add new photos if any
  if (newPhotos && newPhotos.length > 0) {
    // Upload and save new photos
    const startIndex = photoUrls.length;
    for (let i = 0; i < newPhotos.length; i++) {
      const photo = newPhotos[i];
      const photoUrl = await uploadProjectPhoto(projectId, startIndex + i, photo);
      
      await db.EntrepreneurProjectPhoto.create({
        projectId,
        photo: photoUrl
      });
      
      photoUrls.push(photoUrl);
    }
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

    // Get project ID from parameters
    const { id } = ctx.params;
    
    if (!id || isNaN(id)) {
      ctx.body = {
        message: 'Invalid project ID',
      };
      ctx.status = 400;
      return;
    }

    // Find the project that belongs to this user
    const project = await getUserProject(user.id, id);

    if (!project) {
      ctx.body = {
        message: 'Project not found or you do not have permission to update it',
      };
      ctx.status = 404;
      return;
    }

    // Extract project update data from request body
    const { name, description, instagramProfile, showContact, photosToKeep } = ctx.request.body;
    
    // Handle photo updates
    const newPhotos = ctx.request.files && ctx.request.files.photos ? 
      (Array.isArray(ctx.request.files.photos) ? ctx.request.files.photos : [ctx.request.files.photos]) : 
      [];
    
    const currentPhotos = project.EntrepreneurProjectPhotos;
    
    // Update project data
    const updatedProject = await updateProjectData(project, {
      name,
      description,
      instagramProfile,
      showContact: showContact === 'true' || showContact === true
    });

    // Handle photo updates (delete unwanted photos, add new ones)
    const photoUrls = await handleProjectPhotos(project.id, currentPhotos, newPhotos, photosToKeep);

    // Return success response
    ctx.body = {
      message: 'Project updated successfully and is now pending admin approval',
      data: {
        id: updatedProject.id,
        name: updatedProject.name,
        description: updatedProject.description,
        instagramProfile: updatedProject.instagramProfile,
        showContact: updatedProject.showContact,
        isActive: updatedProject.isActive,
        photos: photoUrls
      }
    };
    ctx.status = 200;
  } catch (error) {
    console.error('Error updating project:', error);
    ctx.body = {
      message: 'Failed to update project',
      error: error.message
    };
    ctx.status = 500;
  }
}; 
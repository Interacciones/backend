const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { uploadFile, deleteFile } = require('../../../services/s3Entrepreneurs');
const { sendEmailNotification } = require('../../../services/emailService');
const adminProjectNotificationTemplate = require('../../../emailTemplates/adminProjectNotificationTemplate');

async function uploadProjectPhoto(projectId, photoIndex, photo) {
  try {
    const imageKey = `project_${projectId}_photo_${photoIndex}_${Date.now()}.jpg`;
    const imageUrl = await uploadFile(imageKey, photo);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading project photo:', error);
    // Return default image as fallback
    return "https://interac-ciones.s3.amazonaws.com/default_project.jpg";
  }
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
        // Delete from S3 first
        try {
          await deleteFile(photo.photo);
        } catch (s3Error) {
          console.error(`❌ Failed to delete S3 file during update: ${photo.photo}`, s3Error);
          // Continue with database deletion even if S3 deletion fails
        }
        
        // Delete from database
        await db.EntrepreneurProjectPhoto.destroy({
          where: { id: photo.id }
        });
      } else {
        photoUrls.push(photo.photo);
      }
    }
  } else if (Array.isArray(currentPhotos) && keepPhotoIds.length === 0) {
    // Delete all existing photos if keepPhotoIds is empty
    // First delete from S3
    for (const photo of currentPhotos) {
      try {
        await deleteFile(photo.photo);
      } catch (s3Error) {
        console.error(`❌ Failed to delete S3 file during update: ${photo.photo}`, s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }
    
    // Then delete from database
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
    const { name, description, instagramProfile, showContact, photosToKeep, categoryIds } = ctx.request.body;
    
    // Handle photo updates
    let newPhotos = [];
    if (ctx.request.files) {
      if (ctx.request.files.photos) {
        newPhotos = Array.isArray(ctx.request.files.photos) ? ctx.request.files.photos : [ctx.request.files.photos];
      } else {
        const fileKeys = Object.keys(ctx.request.files);
        const photoKeys = fileKeys.filter(key => key.match(/^photo\d+$/));
        if (photoKeys.length > 0) {
          photoKeys.sort((a, b) => parseInt(a.replace('photo', '')) - parseInt(b.replace('photo', '')));
          newPhotos = photoKeys.map(key => ctx.request.files[key]);
        }
      }
    }
    
    // Validate categories if provided
    let validatedCategoryIds = [];
    if (categoryIds !== undefined) {
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const uniqueCategoryIds = [...new Set(categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id)))];
        
        const categories = await db.ProjectCategory.findAll({
          where: { id: uniqueCategoryIds }
        });
        
        if (categories.length !== uniqueCategoryIds.length) {
          ctx.body = { message: 'One or more invalid category IDs provided' };
          ctx.status = 400;
          return;
        }
        
        validatedCategoryIds = uniqueCategoryIds;
      } else if (categoryIds.length === 0) {
        // Empty array means remove all categories
        validatedCategoryIds = [];
      }
    }

    const currentPhotos = project.EntrepreneurProjectPhotos;
    
    // Enforce max 5 photos total (kept + new)
    const keepPhotoIds = photosToKeep ? photosToKeep.split(',').map(Number).filter(Number.isFinite) : [];
    const keptCount = keepPhotoIds.length > 0
      ? (Array.isArray(project.EntrepreneurProjectPhotos)
          ? project.EntrepreneurProjectPhotos.filter(p => keepPhotoIds.includes(p.id)).length
          : 0)
      : 0;
    const prospectiveTotal = keptCount + (newPhotos ? newPhotos.length : 0);
    if (prospectiveTotal > 5) {
      ctx.body = { message: 'A maximum of 5 photos is allowed' };
      ctx.status = 400;
      return;
    }

    // Update project data
    const updatedProject = await updateProjectData(project, {
      name,
      description,
      instagramProfile,
      showContact: showContact === 'true' || showContact === true
    });

    // Handle photo updates (delete unwanted photos, add new ones)
    const photoUrls = await handleProjectPhotos(project.id, currentPhotos, newPhotos, photosToKeep);

    // Handle category updates if categoryIds was provided
    if (categoryIds !== undefined) {
      // Remove all existing category assignments
      await db.ProjectCategoryAssignment.destroy({
        where: { projectId: project.id }
      });
      
      // Add new category assignments if any
      if (validatedCategoryIds.length > 0) {
        const categoryAssignments = validatedCategoryIds.map(categoryId => ({
          projectId: project.id,
          categoryId: categoryId
        }));
        
        await db.ProjectCategoryAssignment.bulkCreate(categoryAssignments);
      }
    }

    // Send notification email to admin about project update
    try {
      const adminEmail = process.env.GMAIL_USER;
      const userFullName = `${user.name} ${user.lastName}`;
      const emailSubject = '✏️ Proyecto Actualizado - Requiere Revisión';
      const emailBody = adminProjectNotificationTemplate(
        'UPDATED',
        userFullName,
        user.email,
        updatedProject.name,
        updatedProject.description,
        updatedProject.id
      );
      
      await sendEmailNotification(adminEmail, emailSubject, emailBody);
      console.log(`✅ Admin notification sent for updated project: ${updatedProject.name}`);
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
      // Don't fail the project update if email fails
    }

    // Return success response
    ctx.body = {
      message: 'Project updated successfully and is now pending admin approval',
      data: {
        id: updatedProject.id,
        name: updatedProject.name,
        description: updatedProject.description,
        instagramProfile: updatedProject.instagramProfile,
        showContact: updatedProject.showContact,
        categoryIds: categoryIds !== undefined ? validatedCategoryIds : 'unchanged',
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
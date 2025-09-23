const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { uploadFile } = require('../../../services/s3Entrepreneurs');
const { sendEmailNotification } = require('../../../services/emailService');
const adminProjectNotificationTemplate = require('../../../emailTemplates/adminProjectNotificationTemplate');

async function uploadProjectPhoto(projectId, photoIndex, photo) {
  try {
    const imageKey = `project_${projectId}_photo_${photoIndex}.jpg`;
    const imageUrl = await uploadFile(imageKey, photo);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading project photo:', error);
    // Return default image as fallback
    return "https://interac-ciones.s3.amazonaws.com/default_project.jpg";
  }
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
    // Upload to S3 (real function)
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
    let { name, description, instagramProfile, showContact, categoryIds } = ctx.request.body;

    // Parse categoryIds if it comes as a JSON string (multipart form data)
    if (typeof categoryIds === 'string' && categoryIds.trim() !== '') {
      try {
        categoryIds = JSON.parse(categoryIds);
      } catch (error) {
        console.error('Failed to parse categoryIds JSON:', error.message);
        categoryIds = null;
      }
    }
    
    // Validate required fields
    if (!name || !description) {
      ctx.body = {
        message: 'Missing required fields: name and description are required',
      };
      ctx.status = 400;
      return;
    }

    // Validate categories if provided
    let validatedCategoryIds = [];
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const uniqueCategoryIds = [...new Set(categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id)))];
      
      const categories = await db.ProjectCategory.findAll({
        where: { id: uniqueCategoryIds }
      });
      
      if (categories.length !== uniqueCategoryIds.length) {
        ctx.body = {
          message: 'One or more invalid category IDs provided',
        };
        ctx.status = 400;
        return;
      }
      
      validatedCategoryIds = uniqueCategoryIds;
    }

    // Check if photos were uploaded
    let photos = [];
    
    // Check for photos with keys like photo0, photo1, etc.
    if (ctx.request.files) {
      const fileKeys = Object.keys(ctx.request.files);
      // Filter keys that match pattern 'photo0', 'photo1', etc.
      const photoKeys = fileKeys.filter(key => key.match(/^photo\d+$/));
      
      if (photoKeys.length > 0) {
        // Sort keys numerically to preserve order
        photoKeys.sort((a, b) => {
          const numA = parseInt(a.replace('photo', ''));
          const numB = parseInt(b.replace('photo', ''));
          return numA - numB;
        });
        
        // Get the photos in order
        photos = photoKeys.map(key => ctx.request.files[key]);
      } else if (ctx.request.files.photos) {
        // Fallback to previous logic if photos are sent as an array
        photos = Array.isArray(ctx.request.files.photos) ? 
          ctx.request.files.photos : [ctx.request.files.photos];
      }
    }
      
    if (photos.length === 0) {
      ctx.body = {
        message: 'At least one photo is required',
      };
      ctx.status = 400;
      return;
    }

    if (photos.length > 5) {
      ctx.body = {
        message: 'A maximum of 5 photos is allowed',
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

    // Assign categories to project if any were provided
    if (validatedCategoryIds.length > 0) {
      const categoryAssignments = validatedCategoryIds.map(categoryId => ({
        projectId: project.id,
        categoryId: categoryId
      }));
      
      await db.ProjectCategoryAssignment.bulkCreate(categoryAssignments);
    }

    // Send notification email to admin about new project
    try {
      const adminEmail = process.env.GMAIL_USER;
      const userFullName = `${user.name} ${user.lastName}`;
      const emailSubject = '📝 Nuevo Proyecto Creado - Requiere Revisión';
      const emailBody = adminProjectNotificationTemplate(
        'CREATED',
        userFullName,
        user.email,
        project.name,
        project.description,
        project.id
      );
      
      await sendEmailNotification(adminEmail, emailSubject, emailBody);
      console.log(`✅ Admin notification sent for new project: ${project.name}`);
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
      // Don't fail the project creation if email fails
    }

    // Return success response
    ctx.body = {
      message: 'Project created successfully and pending admin approval',
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        instagramProfile: project.instagramProfile,
        showContact: project.showContact,
        categoryIds: validatedCategoryIds,
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
const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');
const projectRejectedTemplate = require('../../../emailTemplates/projectRejectedTemplate');
const { deleteFile } = require('../../../services/s3Entrepreneurs');

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
  try {
    // First, get all photo URLs before deleting from database
    const photos = await db.EntrepreneurProjectPhoto.findAll({
      where: { projectId },
      attributes: ['photo']
    });

    // Delete photos from S3 storage
    for (const photo of photos) {
      try {
        await deleteFile(photo.photo);
      } catch (s3Error) {
        console.error(`❌ Failed to delete S3 file: ${photo.photo}`, s3Error);
        // Continue with deletion even if S3 deletion fails
      }
    }

    // Delete photo records from database
    await db.EntrepreneurProjectPhoto.destroy({
      where: { projectId }
    });
    
    // Delete the project itself
    await db.EntrepreuneurProject.destroy({
      where: { id: projectId }
    });
    
    console.log(`✅ Successfully rejected and deleted project ${projectId} and ${photos.length} photos`);
  } catch (error) {
    console.error(`❌ Error in deleteProjectAndPhotos:`, error);
    throw error;
  }
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

    // Store some info for the response and email before deletion
    const projectInfo = {
      id: project.id,
      name: project.name,
      user: {
        name: project.User.name,
        lastName: project.User.lastName,
        email: project.User.email
      }
    };

    // Send email notification to user about project rejection before deletion
    try {
      const userFullName = `${project.User.name} ${project.User.lastName}`;
      const emailSubject = 'Actualización sobre tu proyecto - Interacciones';
      const emailBody = projectRejectedTemplate(userFullName, project.name);
      
      await sendEmailNotification(project.User.email, emailSubject, emailBody);
      console.log(`✅ Rejection email sent to user: ${project.User.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send rejection email:', emailError);
      // Don't fail the rejection process if email fails
    }

    // Delete the project and its photos
    await deleteProjectAndPhotos(id);

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
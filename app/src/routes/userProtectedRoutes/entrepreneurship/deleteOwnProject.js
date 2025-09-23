const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { sendEmailNotification } = require('../../../services/emailService');
const adminProjectNotificationTemplate = require('../../../emailTemplates/adminProjectNotificationTemplate');
const { deleteFile } = require('../../../services/s3Entrepreneurs');

async function getUserByToken(token) {
  return await db.User.findOne({ where: { token } });
}

async function getOwnProjectById(userId, projectId) {
  return await db.EntrepreuneurProject.findOne({ 
    where: { id: projectId, userId },
    include: [
      {
        model: db.User,
        attributes: ['name', 'lastName', 'email']
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
    await db.EntrepreneurProjectPhoto.destroy({ where: { projectId } });
    
    // Delete project record
    await db.EntrepreuneurProject.destroy({ where: { id: projectId } });
    
    console.log(`✅ Successfully deleted project ${projectId} and ${photos.length} photos`);
  } catch (error) {
    console.error(`❌ Error in deleteProjectAndPhotos:`, error);
    throw error;
  }
}

module.exports = async (ctx) => {
  try {
    const userToken = await checkVerifiedUser(ctx);
    if (!userToken) {
      ctx.body = { message: 'User is not verified' };
      ctx.status = 401;
      return;
    }

    const user = await getUserByToken(userToken.uid);
    if (!user) {
      ctx.body = { message: 'User not found' };
      ctx.status = 404;
      return;
    }

    const { id } = ctx.params;
    if (!id || isNaN(id)) {
      ctx.body = { message: 'Invalid project ID' };
      ctx.status = 400;
      return;
    }

    const project = await getOwnProjectById(user.id, id);
    if (!project) {
      ctx.body = { message: 'Project not found or not owned by user' };
      ctx.status = 404;
      return;
    }

    // Store project info for email notification before deletion
    const projectInfo = {
      id: project.id,
      name: project.name,
      description: project.description
    };

    // Send notification email to admin about project deletion
    try {
      const adminEmail = process.env.GMAIL_USER;
      const userFullName = `${user.name} ${user.lastName}`;
      const emailSubject = '🗑️ Proyecto Eliminado por Usuario';
      const emailBody = adminProjectNotificationTemplate(
        'DELETED',
        userFullName,
        user.email,
        projectInfo.name,
        projectInfo.description,
        projectInfo.id
      );
      
      await sendEmailNotification(adminEmail, emailSubject, emailBody);
      console.log(`✅ Admin notification sent for deleted project: ${projectInfo.name}`);
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
      // Don't fail the project deletion if email fails
    }

    await deleteProjectAndPhotos(project.id);

    ctx.body = { message: 'Project deleted successfully' };
    ctx.status = 200;
  } catch (error) {
    console.error('Error deleting project:', error);
    ctx.body = { message: 'Failed to delete project', error: error.message };
    ctx.status = 500;
  }
};





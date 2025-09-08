const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

async function getUserByToken(token) {
  return await db.User.findOne({ where: { token } });
}

async function getOwnProjectById(userId, projectId) {
  return await db.EntrepreuneurProject.findOne({ where: { id: projectId, userId } });
}

async function deleteProjectAndPhotos(projectId) {
  await db.EntrepreneurProjectPhoto.destroy({ where: { projectId } });
  await db.EntrepreuneurProject.destroy({ where: { id: projectId } });
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

    await deleteProjectAndPhotos(project.id);

    ctx.body = { message: 'Project deleted successfully' };
    ctx.status = 200;
  } catch (error) {
    console.error('Error deleting project:', error);
    ctx.body = { message: 'Failed to delete project', error: error.message };
    ctx.status = 500;
  }
};





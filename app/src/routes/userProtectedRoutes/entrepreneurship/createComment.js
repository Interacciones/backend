const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

async function getUserByToken(token) {
  return await db.User.findOne({ where: { token } });
}

async function getProjectById(projectId) {
  return await db.EntrepreuneurProject.findOne({ where: { id: projectId, isActive: true } });
}

async function createComment(userId, projectId, parentCommentId, content) {
  return await db.EntrepreneurProjectComment.create({
    userId,
    projectId,
    parentCommentId: parentCommentId || null,
    content,
  });
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

    const { projectId, parentCommentId, content } = ctx.request.body;
    if (!projectId || !content) {
      ctx.body = { message: 'projectId and content are required' };
      ctx.status = 400;
      return;
    }

    const project = await getProjectById(projectId);
    if (!project) {
      ctx.body = { message: 'Project not found or not active' };
      ctx.status = 404;
      return;
    }

    const comment = await createComment(user.id, projectId, parentCommentId, content);

    ctx.body = { message: 'Comment created successfully', data: comment };
    ctx.status = 201;
  } catch (error) {
    console.error('Error creating comment:', error);
    ctx.body = { message: 'Failed to create comment', error: error.message };
    ctx.status = 500;
  }
};





const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

module.exports = async (ctx) => {
  try {
    const userToken = await checkVerifiedUser(ctx);
    if (!userToken) {
      ctx.body = { message: 'User is not verified' };
      ctx.status = 401;
      return;
    }

    const user = await db.User.findOne({ where: { token: userToken.uid } });
    if (!user) {
      ctx.body = { message: 'User not found' };
      ctx.status = 404;
      return;
    }

    const { commentId, description } = ctx.request.body;
    if (!commentId || !description) {
      ctx.body = { message: 'commentId and description are required' };
      ctx.status = 400;
      return;
    }

    const comment = await db.EntrepreneurProjectComment.findOne({ where: { id: commentId } });
    if (!comment) {
      ctx.body = { message: 'Comment not found' };
      ctx.status = 404;
      return;
    }

    const report = await db.ReportOfEntrepreneurComment.create({
      userId: user.id,
      commentId,
      description,
      status: 'Pendiente'
    });

    ctx.body = { message: 'Report created successfully', data: report };
    ctx.status = 201;
  } catch (error) {
    console.error('Error creating entrepreneur comment report:', error);
    ctx.body = { message: 'Failed to create report', error: error.message };
    ctx.status = 500;
  }
};





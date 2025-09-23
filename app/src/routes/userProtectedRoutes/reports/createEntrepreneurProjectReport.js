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

    const { projectId, description } = ctx.request.body;
    if (!projectId || !description) {
      ctx.body = { message: 'projectId and description are required' };
      ctx.status = 400;
      return;
    }

    const project = await db.EntrepreuneurProject.findOne({ where: { id: projectId } });
    if (!project) {
      ctx.body = { message: 'Project not found' };
      ctx.status = 404;
      return;
    }

    const report = await db.ReportOfEntrepreneurProject.create({
      userId: user.id,
      projectId,
      description,
      status: 'Pendiente'
    });

    ctx.body = { message: 'Report created successfully', data: report };
    ctx.status = 201;
  } catch (error) {
    console.error('Error creating entrepreneur project report:', error);
    ctx.body = { message: 'Failed to create report', error: error.message };
    ctx.status = 500;
  }
};





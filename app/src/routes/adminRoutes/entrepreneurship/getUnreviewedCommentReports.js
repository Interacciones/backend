const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getPendingCommentReports() {
  return await db.ReportOfEntrepreneurComment.findAll({
    where: { status: 'pending' },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'userId', 'commentId', 'description', 'status', 'createdAt'],
    include: [
      { model: db.User, attributes: ['id', 'name', 'lastName', 'email'] },
      { model: db.EntrepreneurProjectComment, attributes: ['id', 'content', 'projectId', 'parentCommentId', 'createdAt'],
        include: [
          { model: db.User, attributes: ['id', 'name', 'lastName', 'email'] },
          { model: db.EntrepreuneurProject, attributes: ['id', 'name'] }
        ] }
    ]
  });
}

module.exports = async (ctx) => {
  try {
    const tokenAdmin = await checkAdmin(ctx);
    if (!tokenAdmin) {
      ctx.body = { message: 'User is not admin' };
      ctx.status = 401;
      return;
    }

    const reports = await getPendingCommentReports();
    ctx.body = { message: 'Pending comment reports fetched successfully', data: reports };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: 'Failed to fetch pending comment reports', error: error.message };
    ctx.status = 500;
  }
};





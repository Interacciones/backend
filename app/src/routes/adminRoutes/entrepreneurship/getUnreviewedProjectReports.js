const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getPendingProjectReports() {
  return await db.ReportOfEntrepreneurProject.findAll({
    where: { status: 'pending' },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'userId', 'projectId', 'description', 'status', 'createdAt'],
    include: [
      { model: db.User, attributes: ['id', 'name', 'lastName', 'email'] },
      { model: db.EntrepreuneurProject, attributes: ['id', 'name', 'description', 'instagramProfile', 'showContact', 'isActive'],
        include: [{ model: db.User, attributes: ['id', 'name', 'lastName', 'email'] }] }
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

    const reports = await getPendingProjectReports();
    ctx.body = { message: 'Pending project reports fetched successfully', data: reports };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: 'Failed to fetch pending project reports', error: error.message };
    ctx.status = 500;
  }
};





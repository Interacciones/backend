const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getAdminUser(token) {
  return await db.User.findOne({ where: { token }, attributes: ['id'] });
}

async function getReportById(reportId) {
  return await db.ReportOfEntrepreneurProject.findOne({ where: { id: reportId } });
}

async function addReportToHistory({ reportedByUserId, createdByUserId, handlerAdminUserId, decisionArgument }) {
  return await db.ReportHistoryOfEntrepreneurProjects.create({
    reportedByUserId,
    createdByUserId,
    handlerAdminUserId,
    status: 'Reporte de proyecto ignorado',
    decisionArgument,
  });
}

async function deleteReport(reportId) {
  return await db.ReportOfEntrepreneurProject.destroy({ where: { id: reportId } });
}

module.exports = async (ctx) => {
  try {
    const tokenAdmin = await checkAdmin(ctx);
    if (!tokenAdmin) {
      ctx.body = { message: 'User is not admin' };
      ctx.status = 401;
      return;
    }

    const { reportedByUserId, createdByUserId, reportId, decisionArgument } = ctx.request.body;

    const user = await getAdminUser(tokenAdmin.uid);
    if (!user) {
      ctx.body = { message: 'User not found' };
      ctx.status = 404;
      return;
    }

    const report = await getReportById(reportId);
    if (!report) {
      ctx.body = { message: 'Report not found' };
      ctx.status = 404;
      return;
    }

    await addReportToHistory({
      reportedByUserId,
      createdByUserId,
      handlerAdminUserId: user.id,
      decisionArgument,
    });

    await deleteReport(reportId);

    ctx.body = { message: 'Project report ignored successfully' };
    ctx.status = 200;

  } catch (error) {
    console.error(error);
    ctx.body = { message: 'Failed to ignore project report', error: error.message };
    ctx.status = 500;
  }
};





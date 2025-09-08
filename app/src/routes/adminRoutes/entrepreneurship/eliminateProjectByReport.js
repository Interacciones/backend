const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getAdminUser(token) {
  return await db.User.findOne({ where: { token }, attributes: ['id', 'email', 'name', 'lastName'] });
}

async function getReportById(reportId) {
  return await db.ReportOfEntrepreneurProject.findOne({ where: { id: reportId } });
}

async function addReportToHistory({ reportedByUserId, createdByUserId, handlerAdminUserId, decisionArgument }) {
  return await db.ReportHistoryOfEntrepreneurProjects.create({
    reportedByUserId,
    createdByUserId,
    handlerAdminUserId,
    status: 'Proyecto eliminado',
    decisionArgument,
  });
}

async function deleteProject(projectId) {
  await db.EntrepreneurProjectPhoto.destroy({ where: { projectId } });
  await db.EntrepreuneurProject.destroy({ where: { id: projectId } });
}

async function deleteReport(reportId) {
  await db.ReportOfEntrepreneurProject.destroy({ where: { id: reportId } });
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

    const adminUser = await getAdminUser(tokenAdmin.uid);
    if (!adminUser) {
      ctx.body = { message: 'Admin user not found' };
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
      handlerAdminUserId: adminUser.id,
      decisionArgument,
    });

    await deleteProject(report.projectId);
    await deleteReport(reportId);

    ctx.body = { message: 'Project and report handled successfully' };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { message: 'Failed to handle project report', error: error.message };
    ctx.status = 500;
  }
};





const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

async function getAdminUser(token) {
    return await db.User.findOne({
        where: { token },
        attributes: ['id'],
    });
}

async function getReportById(reportId) {
    return await db.ReportOfReview.findOne({
        where: { id: reportId },
    });
}

async function addReportToHistory({ reportedByUserId, createdByUserId, handlerAdminUserId, decisionArgument }) {
    return await db.ReportHistoryOfReviews.create({
        reportedByUserId: reportedByUserId,
        createdByUserId: createdByUserId,
        handlerAdminUserId: handlerAdminUserId,
        status: 'Comentario eliminado',
        decisionArgument: decisionArgument,
    });
}

async function deleteReviewMessage(reviewId) {
    return await db.ReviewMessage.destroy({
        where: { id: reviewId },
    });
}

async function deleteReport(reportId) {
    return await db.ReportOfReview.destroy({
        where: { id: reportId },
    });
}

async function getUserById(userId) {
    return await db.User.findOne({
        where: { id: userId },
        attributes: ['email'],
    });
}

module.exports = async (ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }

        const { reportedByUserId, createdByUserId, reportId, decisionArgument } = ctx.request.body;

        const user = await getAdminUser(tokenAdmin.uid);
        if (!user) {
            ctx.body = {
                message: 'User not found',
            };
            ctx.status = 404;
            return;
        }

        const report = await getReportById(reportId);
        if (!report) {
            ctx.body = {
                message: 'Report not found',
            };
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
        await deleteReviewMessage(report.reviewId);

        const reportedUser = await getUserById(reportedByUserId);
        const createdUser = await getUserById(createdByUserId);

        if (createdUser && createdUser.email) {
            await sendEmailNotification(
                createdUser.email,
                'Comentario eliminado',
                'Tu comentario ha sido eliminado debido a un reporte.'
            );
        }

        if (reportedUser && reportedUser.email) {
            await sendEmailNotification(
                reportedUser.email,
                'Reporte manejado',
                'Tu reporte ha sido manejado y el comentario ha sido eliminado.'
            );
        }

        ctx.body = {
            message: 'Review and report handled successfully',
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to handle review and report',
            error: error.message,
        };
        ctx.status = 500;
    }
};
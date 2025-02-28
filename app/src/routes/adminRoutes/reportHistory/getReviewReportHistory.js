const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getReviewReportHistory() {
    return await db.ReportHistoryOfReviews.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'reportedByUserId', 'createdByUserId', 'handlerAdminUserId', 'status', 'decisionArgument', 'createdAt'],
    });
}

async function getUserById(userId) {
    return await db.User.findOne({
        where: { id: userId },
        attributes: ['id', 'name', 'lastName', 'email'],
    });
}

function formatReviewReportHistory(reports, users) {
    return reports.map(report => {
        const reportedByUser = users.find(user => user.id === report.reportedByUserId);
        const createdByUser = users.find(user => user.id === report.createdByUserId);
        const handlerAdminUser = users.find(user => user.id === report.handlerAdminUserId);

        return {
            id: report.id,
            reportedBy: {
                id: reportedByUser.id,
                name: reportedByUser.name,
                lastName: reportedByUser.lastName,
                email: reportedByUser.email,
            },
            createdBy: {
                id: createdByUser.id,
                name: createdByUser.name,
                lastName: createdByUser.lastName,
                email: createdByUser.email,
            },
            handlerAdmin: {
                id: handlerAdminUser.id,
                name: handlerAdminUser.name,
                lastName: handlerAdminUser.lastName,
                email: handlerAdminUser.email,
            },
            status: report.status,
            decisionArgument: report.decisionArgument,
            createdAt: report.createdAt,
        };
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

        const reviewReportHistory = await getReviewReportHistory();

        const userIds = [
            ...new Set([
                ...reviewReportHistory.map(report => report.reportedByUserId),
                ...reviewReportHistory.map(report => report.createdByUserId),
                ...reviewReportHistory.map(report => report.handlerAdminUserId),
            ]),
        ];

        const users = await Promise.all(userIds.map(id => getUserById(id)));

        const formattedReports = formatReviewReportHistory(reviewReportHistory, users);

        ctx.body = {
            message: 'Review report history fetched successfully',
            data: formattedReports,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch review report history',
            error: error.message,
        };
        ctx.status = 500;
    }
};
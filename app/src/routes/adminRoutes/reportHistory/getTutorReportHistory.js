const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getTutorReportHistory() {
    return await db.ReportHistoryOfTutors.findAll({
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

function formatTutorReportHistory(reports, users) {
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

        const tutorReportHistory = await getTutorReportHistory();

        const userIds = [
            ...new Set([
                ...tutorReportHistory.map(report => report.reportedByUserId),
                ...tutorReportHistory.map(report => report.createdByUserId),
                ...tutorReportHistory.map(report => report.handlerAdminUserId),
            ]),
        ];

        const users = await Promise.all(userIds.map(id => getUserById(id)));

        const formattedReports = formatTutorReportHistory(tutorReportHistory, users);

        ctx.body = {
            message: 'Tutor report history fetched successfully',
            data: formattedReports,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch tutor report history',
            error: error.message,
        };
        ctx.status = 500;
    }
};
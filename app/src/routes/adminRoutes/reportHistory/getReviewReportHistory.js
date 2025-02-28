const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getReviewReportHistory() {
    return await db.ReportHistoryOfReview.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'reportedByUserId', 'createdById', 'handlerAdminUserId', 'decisionArgument', 'createdAt'],
        include: [
            {
                model: db.User,
                attributes: ['name', 'lastName', 'email'],
            },
            {
                model: db.User,
                attributes: ['name', 'lastName', 'email'],
            },
            {
                model: db.Admin,
                attributes: ['id'],
                include: [
                    {
                        model: db.User,
                        attributes: ['name', 'lastName', 'email'],
                    },
                ],
            },
        ],
    });
}

function formatReviewReportHistory(reports) {
    return reports.map(report => ({
        id: report.id,
        reportedBy: {
            name: report.User.name,
            lastName: report.User.lastName,
            email: report.User.email,
        },
        createdBy: {
            name: report.User.name,
            lastName: report.User.lastName,
            email: report.User.email,
        },
        handlerAdmin: {
            name: report.Admin.User.name,
            lastName: report.Admin.User.lastName,
            email: report.Admin.User.email,
        },
        decisionArgument: report.decisionArgument,
        createdAt: report.createdAt,
    }));
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
        const formattedReports = formatReviewReportHistory(reviewReportHistory);

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
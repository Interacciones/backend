const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getPendingReviewReports() {
    return await db.ReportOfReview.findAll({
        where: { status: 'pending' },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'userId', 'reviewId', 'description', 'status', 'createdAt'],
        include: [
            {
                model: db.User,
                attributes: ['name', 'lastName', 'email'],
            },
            {
                model: db.ReviewMessage,
                attributes: ['rating', 'content', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['name', 'lastName'],
                    },
                    {
                        model: db.TutorProfile,
                        attributes: ['id'],
                        include: [
                            {
                                model: db.User,
                                attributes: ['name', 'lastName'],
                            },
                        ],
                    },
                ],
            },
        ],
    });
}

function formatPendingReviewReports(reports) {
    return reports.map(report => ({
        id: report.id,
        userReporting: {
            name: report.User.name,
            lastName: report.User.lastName,
            email: report.User.email,
        },
        review: {
            rating: report.ReviewMessage.rating,
            content: report.ReviewMessage.content,
            createdAt: report.ReviewMessage.createdAt,
        },
        reviewer: {
            name: report.ReviewMessage.User.name,
            lastName: report.ReviewMessage.User.lastName,
        },
        tutor: {
            name: report.ReviewMessage.TutorProfile.User.name,
            lastName: report.ReviewMessage.TutorProfile.User.lastName,
        },
        description: report.description,
        status: report.status,
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

        const pendingReviewReports = await getPendingReviewReports();
        const formattedReports = formatPendingReviewReports(pendingReviewReports);

        ctx.body = {
            message: 'Pending review reports fetched successfully',
            data: formattedReports,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch pending review reports',
            error: error.message,
        };
        ctx.status = 500;
    }
};
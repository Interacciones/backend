const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getUnpublishedTutorsCount() {
    return await db.TutorProfile.count({
        where: { isPublished: false },
    });
}

async function getTotalUsersCount() {
    return await db.User.count();
}

async function getPendingReportsCount() {
    const pendingTutorReports = await db.ReportOfTutor.count({
        where: { status: 'pending' },
    });

    const pendingReviewReports = await db.ReportOfReview.count({
        where: { status: 'pending' },
    });

    return pendingTutorReports + pendingReviewReports;
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

        const unpublishedTutorsCount = await getUnpublishedTutorsCount();
        const totalUsersCount = await getTotalUsersCount();
        const pendingReportsCount = await getPendingReportsCount();

        ctx.body = {
            message: 'Admin stats fetched successfully',
            data: {
                unpublishedTutorsCount,
                totalUsersCount,
                pendingReportsCount,
            },
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch admin stats',
            error: error.message,
        };
        ctx.status = 500;
    }
};
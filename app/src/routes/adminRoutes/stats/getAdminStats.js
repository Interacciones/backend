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

async function getTotalComplainsCount() {
    return await db.Complain.count();
}

async function getTotalTutorPriorityCount() {
    return await db.TutorPriority.count();
}

async function getTotalTutorProfilesCount() {
    return await db.TutorProfile.count();
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
        const totalComplainsCount = await getTotalComplainsCount();
        const totalTutorPriorityCount = await getTotalTutorPriorityCount();
        const totalTutorProfilesCount = await getTotalTutorProfilesCount();

        ctx.body = {
            message: 'Admin stats fetched successfully',
            data: {
                unpublishedTutorsCount,
                totalUsersCount,
                pendingReportsCount,
                totalComplainsCount,
                totalTutorPriorityCount,
                totalTutorProfilesCount,
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
const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

async function getUserByToken(token) {
    return await db.User.findOne({ where: { token } });
}

async function getTutorById(tutorId) {
    return await db.TutorProfile.findByPk(tutorId);
}

async function createReport(userId, tutorId, description) {
    return await db.ReportOfTutor.create({
        userId,
        tutorId,
        description,
        status: 'pending',
    });
}

module.exports = async(ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        const { tutorId, description } = ctx.request.body;

        if (!userToken) {
            ctx.status = 401;
            ctx.body = { message: 'User is not verified' };
            return;
        }

        const user = await getUserByToken(userToken.uid);
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        const tutor = await getTutorById(tutorId);
        if (!tutor) {
            ctx.status = 404;
            ctx.body = { message: 'Tutor not found' };
            return;
        }

        const report = await createReport(user.id, tutorId, description);

        ctx.status = 201;
        ctx.body = {
            message: 'Report created successfully',
            data: report,
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = {
            message: 'Failed to create report',
            error: error.message,
        };
    }
};

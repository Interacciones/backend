const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getUserByEmail(email) {
    return await db.User.findOne({
        where: { email },
        attributes: ['id'],
    });
}

async function getTutorProfileByUserId(userId) {
    return await db.TutorProfile.findOne({
        where: { userId },
        attributes: ['id'],
    });
}

async function addTutorPriority(tutorId) {
    return await db.TutorPriority.create({
        idTutor: tutorId,
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

        const { email } = ctx.request.body;

        const user = await getUserByEmail(email);
        if (!user) {
            ctx.body = {
                message: 'User not found',
            };
            ctx.status = 404;
            return;
        }

        const tutorProfile = await getTutorProfileByUserId(user.id);
        if (!tutorProfile) {
            ctx.body = {
                message: 'Tutor profile not found',
            };
            ctx.status = 404;
            return;
        }

        await addTutorPriority(tutorProfile.id);

        ctx.body = {
            message: 'Tutor added to priority successfully',
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to add tutor to priority',
            error: error.message,
        };
        ctx.status = 500;
    }
};
const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

async function getUserProfile(userId) {
    return await db.User.findByPk(userId);
}

async function isUserBanned(userProfile) {
    return userProfile.isBanned;
}

async function banUserProfile(userProfile) {
    userProfile.isBanned = true;
    await userProfile.save();
}

async function deleteTutorProfile(userId) {
    const tutorProfile = await db.TutorProfile.findOne({
        where: { userId },
    });

    if (tutorProfile) {
        await tutorProfile.destroy();
    }
}

async function deleteReviewMessages(userId) {
    await db.ReviewMessage.destroy({
        where: { userId },
    });
}

async function notifyUserBan(userProfile) {
    if (userProfile && userProfile.email) {
        await sendEmailNotification(
            userProfile.email,
            'Cuenta Baneada',
            'Tu cuenta ha sido baneada debido a violaciones de nuestras políticas.'
        );
    }
}

module.exports = async (ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.status = 401;
            ctx.body = { message: 'User is not admin' };
            return;
        }

        const { id: userId } = ctx.params;
        const userProfile = await getUserProfile(userId);

        if (!userProfile) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        if (await isUserBanned(userProfile)) {
            ctx.status = 400;
            ctx.body = { message: 'User is already banned' };
            return;
        }

        await banUserProfile(userProfile);
        await deleteTutorProfile(userProfile.id);
        await deleteReviewMessages(userProfile.id);
        await notifyUserBan(userProfile);

        ctx.status = 200;
        ctx.body = { message: 'User banned successfully' };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = {
            message: 'Failed to ban user',
            error: error.message,
        };
    }
};
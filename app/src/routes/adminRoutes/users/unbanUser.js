const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

async function getUserProfile(userId) {
    return await db.User.findByPk(userId);
}

async function isUserBanned(userProfile) {
    return userProfile.isBanned;
}

async function unbanUserProfile(userProfile) {
    userProfile.isBanned = false;
    await userProfile.save();
}

async function notifyUserUnban(userProfile) {
    if (userProfile && userProfile.email) {
        await sendEmailNotification(
            userProfile.email,
            'Cuenta Desbaneada',
            'Tu cuenta ha sido desbaneada. Puedes volver a acceder a nuestros servicios.'
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

        if (!await isUserBanned(userProfile)) {
            ctx.status = 400;
            ctx.body = { message: 'User is not banned' };
            return;
        }

        await unbanUserProfile(userProfile);
        await notifyUserUnban(userProfile);

        ctx.status = 200;
        ctx.body = { message: 'User unbanned successfully' };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = {
            message: 'Failed to unban user',
            error: error.message,
        };
    }
};
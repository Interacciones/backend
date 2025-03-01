const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

module.exports = async (ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.status = 401;
            ctx.body = { message: 'User is not admin' };
            return;
        }

        const { id: userId } = ctx.params;
        const userProfile = await db.User.findByPk(userId);

        if (!userProfile) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        if (!userProfile.isBanned) {
            ctx.status = 400;
            ctx.body = { message: 'User is not banned' };
            return;
        }

        userProfile.isBanned = false;
        await userProfile.save();

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
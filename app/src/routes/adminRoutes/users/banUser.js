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

        if (userProfile.isBanned) {
            ctx.status = 400;
            ctx.body = { message: 'User is already banned' };
            return;
        }

        userProfile.isBanned = true;
        await userProfile.save();

        const tutorProfile = await db.TutorProfile.findOne({
            where: { userId: userProfile.id },
        });

        if (tutorProfile) {
            await tutorProfile.destroy();
        }

        await db.ReviewMessage.destroy({
            where: { userId: userProfile.id },
        });

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
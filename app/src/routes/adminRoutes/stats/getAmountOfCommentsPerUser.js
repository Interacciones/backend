const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

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

        const commentsPerUser = await db.ReviewMessage.findAll({
            attributes: [
                'userId',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('userId')), 'commentCount']
            ],
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'name', 'lastName', 'email']
                }
            ],
            group: ['userId', 'User.id', 'User.name', 'User.lastName', 'User.email']
        });

        ctx.body = {
            message: 'Comments per user fetched successfully',
            data: commentsPerUser,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch comments per user',
            error: error.message,
        };
        ctx.status = 500;
    }
};
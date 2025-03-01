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

        const users = await db.User.findAll({
            attributes: ['id', 'name', 'lastName', 'email', 'isBanned'],
        });

        ctx.body = {
            message: 'Users fetched successfully',
            data: users,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch users',
            error: error.message,
        };
        ctx.status = 500;
    }
};
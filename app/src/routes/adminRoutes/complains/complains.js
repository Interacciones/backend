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

        const complains = await db.Complain.findAll();

        ctx.body = {
        message: 'Complains fetched successfully',
        data: complains
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = { message: 'Failed to fetch complains', error: error.message };
        ctx.status = 500;
    }
};
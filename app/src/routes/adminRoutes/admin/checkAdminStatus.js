const checkAdmin = require('../../authorization/checkAdmin');

module.exports = async(ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
                isAdmin: false,
            };
            ctx.status = 401;
            return;
        }

        ctx.body = {
            message: 'Successfull',
            isAdmin: true,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to check admin status',
            error: error.message,
        };
        ctx.status = 500;
    }
};
/*
Para esta ruta hacer:
Hacer un update en el usuario en el isBanned a true
*/

const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

module.exports = async(ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }
        const {userId} = ctx.request.body;
        const userProfile = await db.User.findByPk(userId);
        userProfile.isBanned = true;
        await userProfile.save();
        ctx.body = {
            message: "User banned successfully",
        };
        ctx.status = 200;
        return;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to ban tutor',
            error: error.message,
        };
        ctx.status = 500;
    }
};
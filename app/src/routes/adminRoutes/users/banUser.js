/*
Para esta ruta hacer:
Hacer un update en el usuario en el isBanned a true
*/

const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

module.exports = async(ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        const {userId} = ctx.request.body;

        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }
        
        const userProfile = await db.User.findByPk(userId);
        if (userProfile.isBanned) {
            throw new Error('User is already banned');
        }
        
        userProfile.isBanned = true;
        await userProfile.save();

        const tutorProfile = await db.TutorProfile.findOne({
            where: {userId: userProfile.id},
        });
        if (tutorProfile) {
            await tutorProfile.destroy();
        }

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
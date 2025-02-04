/*
Para esta ruta hacer:
Pedir el perfil de tutor de la persona a través de buscar el token del usuario, encontrar el usuario y encontrar con esto el perfil de tutor
*/

const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

module.exports = async(ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        if (!userToken) {
            ctx.body = {
                message: 'User is not verified',
            };
            ctx.status = 401;
            return;
        }
        const user = await db.User.findOne({
            where : {token: userToken.uid},
        });
        const tutorProfile = await db.TutorProfile.findOne({
            where: {userId: user.id},
        });
        ctx.body = {
            message: 'Tutor profile fetched successfully',
            data: tutorProfile,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch tutor profile',
            error: error.message,
        };
        ctx.status = 500;
    }
}
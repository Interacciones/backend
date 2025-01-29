/*
Para esta ruta hacer:
Obtener todos los tutores que no han sido aceptados
*/

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

        const unacceptedTutors = await db.TutorProfile.findAll({
            where : {isPublished: false},
            attributes: ['id', 'description', 'photo', 'priceDescription', 'contactMail', 'isPublished'],
        });

        ctx.body = {
            message: 'Unaccepted tutor profiles fetched successfully',
            data: unacceptedTutors,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch unaccepted tutor profiles',
            error: error.message,
        };
        ctx.status = 500;
    }
};
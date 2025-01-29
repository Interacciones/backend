/*
Para esta ruta hacer:
Pedir los parametros que se piden de la review y guardarlos en el modelo de review. Pedir el token del usuario que será único y con esto buscar el usuario
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
        const {tutorId, rating, content} = ctx.request.body;
        const review = await db.ReviewMessage.create({
            userId: user.id,
            tutorId,
            rating,
            content,
        });
        ctx.body = {
            message: 'Review created successfully',
            data: review,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to create review',
            error: error.message,
        };
        ctx.status = 500;
    }
}
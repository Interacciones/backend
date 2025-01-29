/*
Para esta ruta hacer:
que se reciba a través de los params las cosas del usuario y se guarden en la tabla
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
        const {description, priceDescription, photo, contactMail} = ctx.request.body;
        const tutorProfile = await db.TutorProfile.create({
            userId: user.id,
            description,
            priceDescription,
            photo,
            contactMail,
            isPublished: false,
        });
        ctx.body = {
            message: 'Tutor profile created successfully',
            data: tutorProfile,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to create tutor profile',
            error: error.message,
        };
        ctx.status = 500;
    }
}
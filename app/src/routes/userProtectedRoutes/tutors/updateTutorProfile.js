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
        const tutorProfile = await db.TutorProfile.findOne({
            where: {userId: user.id},
        });

        tutorProfile.description = description || tutorProfile.description;
        tutorProfile.priceDescription = priceDescription || tutorProfile.priceDescription;
        tutorProfile.photo = photo || tutorProfile.photo
        tutorProfile.contactMail = contactMail || tutorProfile.contactMail;

        await tutorProfile.save();
        ctx.body = {
            message: 'Tutor profile updated successfully',
            data: tutorProfile,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to update tutor profile',
            error: error.message,
        };
        ctx.status = 500;
    }
}
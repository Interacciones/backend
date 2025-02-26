/*
Para esta ruta hacer:
Hacer un update en el tutor en el isAccepted a true
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
        const tutorId = ctx.params.id;
        const tutorProfile = await db.TutorProfile.findByPk(tutorId);
        if (!tutorProfile) {
            ctx.body = {
                message: 'Tutor not found',
            };
            ctx.status = 404;
            return;
        }
        if (tutorProfile.isPublished) {
            ctx.body = {
                message: 'Tutor is already accepted',
            };
            ctx.status = 400;
            return;
        }
        await tutorProfile.destroy();
        ctx.body = {
            message: "Tutor rejected successfully",
        };
        ctx.status = 200;
        return;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to reject tutor',
            error: error.message,
        };
        ctx.status = 500;
    }
};
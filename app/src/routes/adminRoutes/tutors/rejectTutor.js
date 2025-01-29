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
        const {tutorId} = ctx.request.body;
        const tutorProfile = await db.TutorProfile.findByPk(tutorId);
        tutorProfile.isPublished = false;
        await tutorProfile.save();
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
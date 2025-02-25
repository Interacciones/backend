/*
Para esta ruta hacer:
Hacer un update en el tutor en el isPublished a true
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
        tutorProfile.isPublished = true;
        await tutorProfile.save();
        ctx.body = {
            message: "Tutor accepted successfully",
        };
        ctx.status = 200;
        return;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to accept tutor',
            error: error.message,
        };
        ctx.status = 500;
    }
};
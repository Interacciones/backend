/*
Para esta ruta hacer:
Hacer un update en el tutor en el isAccepted a true
*/

const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

module.exports = async(ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        const {tutorId} = ctx.request.body;

        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }
        
        const tutorProfile = await db.TutorProfile.findByPk(tutorId);
        if (!tutorProfile) {
            throw new Error('Tutor profile does not exist');
        }
        
        if (tutorProfile.isPublished){
            throw new Error('Tutor is already accepted');
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
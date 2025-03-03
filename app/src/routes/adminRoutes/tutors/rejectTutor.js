const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

async function getTutorProfile(tutorId) {
    return await db.TutorProfile.findByPk(tutorId);
}

async function isTutorPublished(tutorProfile) {
    return tutorProfile.isPublished;
}

async function deleteTutorProfile(tutorProfile) {
    await tutorProfile.destroy();
}

async function notifyTutorRejection(tutorUser) {
    if (tutorUser && tutorUser.email) {
        await sendEmailNotification(
            tutorUser.email,
            'Perfil de Tutor Rechazado',
            'Tu perfil de tutor ha sido rechazado y eliminado de nuestra plataforma.'
        );
    }
}

module.exports = async(ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = { message: 'User is not admin' };
            ctx.status = 401;
            return;
        }

        const tutorId = ctx.params.id;
        const tutorProfile = await getTutorProfile(tutorId);
        if (!tutorProfile) {
            ctx.body = { message: 'Tutor not found' };
            ctx.status = 404;
            return;
        }

        if (await isTutorPublished(tutorProfile)) {
            ctx.body = { message: 'Tutor is already accepted' };
            ctx.status = 400;
            return;
        }

        await deleteTutorProfile(tutorProfile);

        const tutorUser = await db.User.findByPk(tutorProfile.userId);
        await notifyTutorRejection(tutorUser);

        ctx.body = { message: "Tutor rejected successfully" };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = { message: 'Failed to reject tutor', error: error.message };
        ctx.status = 500;
    }
};
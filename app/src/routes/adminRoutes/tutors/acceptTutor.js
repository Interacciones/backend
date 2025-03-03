const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

async function getTutorProfile(tutorId) {
    return await db.TutorProfile.findByPk(tutorId);
}

async function publishTutorProfile(tutorProfile) {
    tutorProfile.isPublished = true;
    await tutorProfile.save();
}

async function notifyTutorAcceptance(tutorUser) {
    if (tutorUser && tutorUser.email) {
        await sendEmailNotification(
            tutorUser.email,
            'Perfil de Tutor Aceptado',
            'Tu perfil de tutor ha sido aceptado y ahora está publicado en nuestra plataforma.'
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

        await publishTutorProfile(tutorProfile);

        const tutorUser = await db.User.findByPk(tutorProfile.userId);
        await notifyTutorAcceptance(tutorUser);

        ctx.body = { message: "Tutor accepted successfully" };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = { message: 'Failed to accept tutor', error: error.message };
        ctx.status = 500;
    }
};
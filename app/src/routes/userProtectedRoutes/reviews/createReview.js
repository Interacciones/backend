const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const updateReviewsPerTutor = require('../../auxilaryFunctions/ReviewsPerTutor/updateTable');
const createInitialReviewsPerTutorRecord = require('../../auxilaryFunctions/ReviewsPerTutor/createInitialRecord');
const { sendEmailNotification } = require('../../../services/emailService');

async function getUserByToken(token) {
    return await db.User.findOne({
        where: { token },
    });
}

async function getTutorProfile(tutorId) {
    return await db.TutorProfile.findByPk(tutorId);
}

async function createReview(userId, tutorId, rating, content) {
    return await db.ReviewMessage.create({
        userId,
        tutorId,
        rating,
        content,
    });
}

async function ensureReviewsPerTutorRecordExists(tutorId) {
    const reviewsPerTutor = await db.ReviewsPerTutor.findOne({
        where: { tutorId },
    });

    if (!reviewsPerTutor) {
        await createInitialReviewsPerTutorRecord(tutorId);
    }
}

async function notifyTutorOfNewReview(tutorUser, rating, content) {
    if (tutorUser && tutorUser.email) {
        await sendEmailNotification(
            tutorUser.email,
            'Nueva reseña recibida',
            `Has recibido una nueva reseña con una calificación de ${rating} estrellas. Comentario: ${content}`
        );
    }
}

module.exports = async(ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        const { tutorId, rating, content } = ctx.request.body;

        if (!userToken) {
            ctx.body = {
                message: 'User is not verified',
            };
            ctx.status = 401;
            return;
        }

        const user = await getUserByToken(userToken.uid);
        const tutor = await getTutorProfile(tutorId);

        if (user.id === tutor.userId) {
            throw new Error('User cannot review themselves');
        }

        const review = await createReview(user.id, tutorId, rating, content);

        await ensureReviewsPerTutorRecordExists(tutorId);
        await updateReviewsPerTutor(tutorId, rating, true);

        const tutorUser = await db.User.findByPk(tutor.userId);
        await notifyTutorOfNewReview(tutorUser, rating, content);

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
};
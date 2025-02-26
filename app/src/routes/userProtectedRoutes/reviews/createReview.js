const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const updateReviewsPerTutor = require('../../auxilaryFunctions/ReviewsPerTutor/updateTable');
const createInitialReviewsPerTutorRecord = require('../../auxilaryFunctions/ReviewsPerTutor/createInitialRecord');

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

        const user = await db.User.findOne({
            where: { token: userToken.uid },
        });

        const tutor = await db.TutorProfile.findByPk(tutorId);
        if (user.id == tutor.userId) {
            throw new Error('User cannot review themselves');
        }

        const review = await db.ReviewMessage.create({
            userId: user.id,
            tutorId,
            rating,
            content,
        });

        // Check if ReviewsPerTutor record exists, if not create it
        const reviewsPerTutor = await db.ReviewsPerTutor.findOne({
            where: { tutorId },
        });

        if (!reviewsPerTutor) {
            await createInitialReviewsPerTutorRecord(tutorId);
        }

        // Update the ReviewsPerTutor table
        await updateReviewsPerTutor(tutorId, rating, true);

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
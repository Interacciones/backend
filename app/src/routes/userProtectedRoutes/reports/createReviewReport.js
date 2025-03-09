const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

async function getUserByToken(token) {
    return await db.User.findOne({ where: { token } });
}

async function getReviewById(reviewId) {
    return await db.ReviewMessage.findByPk(reviewId);
}

async function createReviewReport(userId, reviewId, description) {
    return await db.ReportOfReview.create({
        userId,
        reviewId,
        description,
        status: 'pending',
    });
}

module.exports = async(ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        const { reviewId, description } = ctx.request.body;

        if (!userToken) {
            ctx.status = 401;
            ctx.body = { message: 'User is not verified' };
            return;
        }

        const user = await getUserByToken(userToken.uid);
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }

        const review = await getReviewById(reviewId);
        if (!review) {
            ctx.status = 404;
            ctx.body = { message: 'Review not found' };
            return;
        }

        const report = await createReviewReport(user.id, reviewId, description);

        ctx.status = 201;
        ctx.body = {
            message: 'Review report created successfully',
            data: report,
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = {
            message: 'Failed to create review report',
            error: error.message,
        };
    }
};
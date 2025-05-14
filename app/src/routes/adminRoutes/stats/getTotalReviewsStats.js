const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getTotalReviewsCount() {
    return await db.ReviewMessage.count();
}

async function getReviewsPerUser() {
    // First get users with their review counts
    const usersWithReviewCounts = await db.User.findAll({
        attributes: [
            'id',
            'name',
            'lastName',
            'email',
            [db.sequelize.fn('COUNT', db.sequelize.col('ReviewMessages.id')), 'count']
        ],
        include: [{
            model: db.ReviewMessage,
            attributes: []
        }],
        group: ['User.id', 'User.name', 'User.lastName', 'User.email'],
        having: db.sequelize.literal('COUNT("ReviewMessages"."id") > 0'),
        order: [[db.sequelize.fn('COUNT', db.sequelize.col('ReviewMessages.id')), 'DESC']]
    });

    // Then get detailed review information for each user
    const detailedResults = await Promise.all(usersWithReviewCounts.map(async (user) => {
        const reviews = await db.ReviewMessage.findAll({
            where: { userId: user.id },
            include: [{
                model: db.TutorProfile,
                include: [{
                    model: db.User,
                    attributes: ['id', 'name', 'lastName', 'email']
                }]
            }]
        });

        return {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            reviewCount: parseInt(user.getDataValue('count'), 10),
            reviewedTutors: reviews.map(review => ({
                tutorId: review.TutorProfile.id,
                tutorName: review.TutorProfile.User.name,
                tutorLastName: review.TutorProfile.User.lastName,
                tutorEmail: review.TutorProfile.User.email
            }))
        };
    }));

    return detailedResults;
}

module.exports = async (ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }

        const totalReviewsCount = await getTotalReviewsCount();
        const reviewsPerUser = await getReviewsPerUser();

        ctx.body = {
            message: 'Review stats fetched successfully',
            data: {
                totalReviewsCount,
                reviewsPerUser
            },
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch review stats',
            error: error.message,
        };
        ctx.status = 500;
    }
}; 
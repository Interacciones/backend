const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getTotalReviewsCount() {
    return await db.ReviewMessage.count();
}

async function getReviewsPerUser() {
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

    return usersWithReviewCounts;
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
                reviewsPerUser: reviewsPerUser.map(user => ({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    reviewCount: parseInt(user.getDataValue('count'), 10)
                }))
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
const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

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

        const { subject } = ctx.request.body;

        if (!subject) {
            ctx.body = {
                message: 'Subject is required',
            };
            ctx.status = 400;
            return;
        }

        const newSubject = await db.StudySubjects.create({ subject });

        ctx.body = {
            message: 'Subject added successfully',
            data: newSubject,
        };
        ctx.status = 201;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to add subject',
            error: error.message,
        };
        ctx.status = 500;
    }
};
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

        const { id } = ctx.params;

        if (!id) {
            ctx.body = {
                message: 'ID is required',
            };
            ctx.status = 400;
            return;
        }

        const subject = await db.StudySubjects.findByPk(id);

        if (!subject) {
            ctx.body = {
                message: 'Subject not found',
            };
            ctx.status = 404;
            return;
        }

        await subject.destroy();

        ctx.body = {
            message: 'Subject deleted successfully',
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to delete subject',
            error: error.message,
        };
        ctx.status = 500;
    }
};
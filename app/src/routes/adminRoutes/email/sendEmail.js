const checkAdmin = require('../../authorization/checkAdmin');
const sendEmail = require("../../../utils/mailer");

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

        const { to, subject, body } = ctx.request.body;

        if (!to || !subject || !body) {
            ctx.status = 400;
            ctx.body = { error: "Missing required parameters" };
            return;
        }

        await sendEmail(to, subject, body);
        
        ctx.body = { message: "Email sent successfully" };
        ctx.status = 200;
        return;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to send email',
            error: error.message,
        };
        ctx.status = 500;
    }
};

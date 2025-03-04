const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

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
		const { content, name, lastName, email } = ctx.request.body;

		const complain = await db.Complain.findByPk(id);
		if (!complain) {
		ctx.body = { message: 'Complain not found' };
		ctx.status = 404;
		return;
		}

		const subject = 'Response to Your Complain';
		const body = `
		Dear ${name} ${lastName},

		${content}

		Best regards,
		Your Support Team
		`;
		await sendEmailNotification(email, subject, body);

		await complain.destroy();

		ctx.body = { message: 'Complain handled and deleted successfully' };
		ctx.status = 200;
	} catch (error) {
		console.error(error);
		ctx.body = { message: 'Failed to handle complain', error: error.message };
		ctx.status = 500;
	}
};
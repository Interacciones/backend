const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { sendEmailNotification } = require('../../../services/emailService');
require('dotenv').config();

module.exports = async (ctx) => {
  try {
    const { name, lastName, email, content } = ctx.request.body;

    const gmailUser = process.env.GMAIL_USER;
    const subject = 'New Complain Received';
    const body = `
      Name: ${name}
      Last Name: ${lastName}
      Email: ${email}
      Content: ${content}
    `;
    await sendEmailNotification(gmailUser, subject, body);

    // Guardar la queja en la base de datos
    await db.Complain.create({
      name,
      lastName,
      email,
      content,
    });

    ctx.body = { message: 'Complain created successfully' };
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.body = { message: 'Failed to create complain', error: error.message };
    ctx.status = 500;
  }
};
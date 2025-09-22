const db = require('../../../models');
const { sendEmailNotification } = require('../../../services/emailService');
const fs = require('fs');
const path = require('path');

module.exports = async (ctx) => {
  try {
    const { name, lastName, email, token } = ctx.request.body;

    if (await isUserExists(email)) {
      return sendErrorResponse(ctx, 409, 'User already exists');
    }

    const newUser = await createUser({ name, lastName, email, token });

    // Send welcome email to new user
    try {
      const emailTemplatePath = path.join(__dirname, '../../../emailTemplates/welcomeEmailTemplate.html');
      const emailBody = fs.readFileSync(emailTemplatePath, 'utf8');
      
      await sendEmailNotification(email, '¡Bienvenid@ a Interacciones! 🎉', emailBody);
      console.log(`✅ Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail user creation if email fails
    }

    return sendSuccessResponse(ctx, 201, 'User created successfully', newUser);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(ctx, 500, 'Failed to create user', error.message);
  }
};

async function isUserExists(email) {
  return await db.User.findOne({ where: { email } });
}

async function createUser({ name, lastName, email, token }) {
  return await db.User.create({
    name,
    lastName,
    email,
    token,
    isBanned: false,
  });
}

function sendSuccessResponse(ctx, status, message, data) {
  ctx.status = status;
  ctx.body = {
    message,
    data: data.toJSON(),
  };
}

function sendErrorResponse(ctx, status, message, error = null) {
  ctx.status = status;
  ctx.body = {
    message,
    error,
  };
}
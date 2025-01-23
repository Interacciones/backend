const db = require('../../../models');

module.exports = async (ctx) => {
  try {
    const { name, lastName, email, token } = ctx.request.body;

    if (await isUserExists(email)) {
      return sendErrorResponse(ctx, 409, 'User already exists');
    }

    const newUser = await createUser({ name, lastName, email, token });

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
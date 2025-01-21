const db = require('../../../models'); // Importar modelos desde la carpeta models

module.exports = async (ctx) => {
  try {
    const { name, lastName, email, token, isBanned } = ctx.request.body;

    const newUser = await db.User.create({
      name,
      lastName,
      email,
      token,
      isBanned: isBanned || false,
    });

    ctx.status = 201;
    ctx.body = {
      message: 'User created successfully',
      data: newUser.toJSON(),
    };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: 'Failed to create user', error: error.message };
  }
};

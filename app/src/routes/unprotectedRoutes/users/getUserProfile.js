const db = require('../../../models');

module.exports = async (ctx) => {
    try {
      const userId = ctx.params.id; // CAMBIAR - una vez que se implemente la autenticación usar el token
  
      const user = await db.User.findByPk(userId, {
        attributes: ['id', 'name', 'lastName', 'email', 'isBanned'],
      });
  
      if (!user) {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
        return;
      }
  
      ctx.status = 200;
      ctx.body = {
        message: 'User profile fetched successfully',
        data: {
          user: user.toJSON(),
        },
      };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to fetch user profile', error: error.message };
    }
  };
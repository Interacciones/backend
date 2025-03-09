const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

module.exports = async (ctx) => {
    try {
      const userToken = await checkVerifiedUser(ctx);
      if (!userToken) {
        ctx.body = {
          message: 'User is not verified',
        };
        ctx.status = 401;
        return;
      }

      const user = await db.User.findOne({
        where: { token: userToken.uid },
        attributes: ['name', 'lastName', 'email'],
      });

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
        return;
      }
  
      ctx.status = 200;
      ctx.body = {
        message: 'User profile fetched successfully',
        data: user.toJSON()
      };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to fetch user profile', error: error.message };
    }
  };
const Middleware = require('../../middleware/index');

module.exports = async(ctx) =>{
    try {
        const userToken = await Middleware.decodeToken(ctx);
        if (userToken && userToken.email_verified == true) {
            return userToken
        } else {
            return false
        }
    } catch (err) {
        return false;
    }
  };

//  const checkUser = require('../../securityEndpoints/checkVerifiedUser');

      // Ejemplo de como hacer uso de la funcion checkUser
      // const tokenUser = await checkUser(ctx);
      // if (!tokenUser) {
      //   ctx.body = {
      //     message: 'User is not authorized',
      //   };
      //   ctx.status = 401;
      //   return;
      // }
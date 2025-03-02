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
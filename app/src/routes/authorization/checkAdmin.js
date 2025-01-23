const { User } = require('../../models');
const { Admin } = require('../../models');
const Middleware = require('../../middleware/index');

module.exports = async(ctx) => {
    try {
        const userToken = await Middleware.decodeToken(ctx);
        console.log(userToken)
        const token = userToken.uid;
        const user = await User.findOne({ where: { token } });
        const admin = await Admin.findOne({ where: { userId: user.id } });
        if (!admin) {
            return false;
        }
        if (userToken && userToken.email_verified == true) {
            return userToken
        } else {
            return false
        }
    } catch (err) {
        return false;
    }
};


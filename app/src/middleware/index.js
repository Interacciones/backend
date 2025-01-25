const admin = require("../firebase/firebase-config");

class Middleware {
    async decodeToken(ctx) {
        try {
            const token = ctx.request.headers.authorization.split(' ')[1];
            const decodeValue = await admin.auth().verifyIdToken(token);
            if (decodeValue) {
                return decodeValue;
            }
            return false
        } catch (error) {
            return false
        }

    }
}

module.exports = new Middleware();
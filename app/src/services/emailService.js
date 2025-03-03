const sendEmail = require("../utils/mailer");

async function sendEmailNotification(to, subject, body) {
    if (!to || !subject || !body) {
        throw new Error("Missing required parameters");
    }

    await sendEmail(to, subject, body);
}

module.exports = {
    sendEmailNotification,
};
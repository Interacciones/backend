const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Function to send an email
async function sendEmail(to, subject, body) {
  try {
    const info = await transporter.sendMail({
      from: `"Interacciones" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: body,
    });

    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
    throw error;
  }
}

module.exports = sendEmail;

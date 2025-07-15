const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS
  }
});

async function sendMail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Daily Tasks" <dailytasksoffice@gmail.com>',
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err);
  }
}

module.exports = sendMail;
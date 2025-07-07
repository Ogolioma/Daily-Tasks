const nodemailer = 
require("nodemailer");
require("dotenv").config();

const transporter = 
nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, text) {
  try {
    const mailOptions = {
      from: `"Daily Tasks" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} - ${subject}`);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}

module.exports = sendMail;


// backend/utils/sendMail.js
const SibApiV3Sdk = require('sib-api-v3-sdk');
require("dotenv").config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendMail(to, subject, html) {
  try {
    const data = await apiInstance.sendTransacEmail({
      sender: { name: "Daily Tasks", email: "dailytasksoffice@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html
    });
    console.log(`✅ Email sent to ${to} (Message ID: ${data.messageId})`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.response?.body || err);
  }
}

module.exports = sendMail;
// resendVerification.js
console.log("🔄 Starting resend script...");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./model/user.js");
const sendMail = require("./utils/sendMail");

dotenv.config();
console.log("✅ Loaded .env");

// connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    resendEmails();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

async function resendEmails() {
  try {
    console.log("🔍 Looking for unverified users...");
    const users = await User.find({ emailVerified: false });
    console.log(`📊 Found ${users.length} unverified users`);

    for (const user of users) {
      console.log(`⏳ Sending email to ${user.email}`);
      const link = `https://dailytasks.co/create-password.html?token=${user.verificationToken}`;
      await sendMail(
        user.email,
        "Confirm Your Email - Daily Tasks",
        `
        <div style="font-family:sans-serif;">
          <h2>Hello ${user.firstName},</h2>
          <p>Looks like you haven't completed your registration. Click below to confirm & create your password:</p>
          <a href="${link}" style="background:#000080;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
            Confirm & Create Password
          </a>
        </div>
        `
      );
      console.log(`✅ Email sent to ${user.email}`);
    }

    console.log("🎉 All emails resent!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
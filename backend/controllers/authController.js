// authController.js
const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// ✅ mailer
const sendMail = require("../utils/sendMail");

const sendEmail = async (email, subject, html) => {
  await sendMail(email, subject, html);
};

// ✅ Register & send verification
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender,
      dob, occupation, nationality, heard, referralCode } = req.body;

    if (!firstName || !email || !phone) return res.status(400).json({ msg: "Missing required fields." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists." });

    const myReferralCode = `${firstName.toUpperCase().slice(0,3)}${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      firstName, lastName, email, phone, gender,
      dob: new Date(dob), occupation, nationality, heard,
      referralCode, myReferralCode,
      emailVerified: false, verificationToken
    });

    await user.save();


    //send email separately
    try{
    const link = `https://dailytasks.co/create-password.html?token=${verificationToken}`;
    await sendEmail(email, "Confirm Your Email - Daily Tasks", `
      <div style="font-family:sans-serif;">
        <h2>Hello ${firstName},</h2>
        <p>Thanks for registering. Click below to confirm & create your password:</p>
        <a href="${link}" style="background:#000080;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Confirm & Create Password</a>
      </div>
    `);

    console.log(`verification email sent to ${email}`);
    } catch (mailErr) {
      console.error(`failed to send verification to ${email}:`, mailErr);
    }

    res.json({ msg: "Registration successful. Check your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

// ✅ Confirm Email & set password
exports.createPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ msg: "Password Created, PLease log in." });

    user.password = await bcrypt.hash(password, 10);
    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ msg: "Password created. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

// ✅ Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "No user with that email." });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const link = `https://dailytasks.co/reset-password.html?token=${token}`;
    await sendEmail(email, "Reset Your Password", `
      <div style="font-family:sans-serif;">
        <h3>Password Reset</h3>
        <p>Click below to reset your password. This link is valid for 1 hour:</p>
        <a href="${link}" style="background:#000080;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
      </div>
    `);

    res.json({ msg: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

// ✅ Reset password using token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Password has been rest. You can log in" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Password has been reset. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

// ✅ Login
exports.loginUser = async (req, res) => {
  console.log("login route hit");
  console.log("request body:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    });

    if (!user) return res.status(400).json({ msg: "User not found." });
    if (!user.emailVerified) return res.status(400).json({ msg: "Verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login failed. Try again." });
  }
};

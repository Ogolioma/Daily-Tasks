const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic Info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  dob: { type: Date, required: true },

  //Toluna Info
  tolunaMemberCode: { type: String, default: null },

  // Optional Info
  occupation: String,
  nationality: String,
  heard: String,
  referralCode: String,

  // System Fields
  myReferralCode: { type: String, unique: true },
  password: String,
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String }, // ✅ Token for email confirmation

  //reset password
  resetPasswordToken: String,
resetPasswordExpires: Date,

  // Points & Notifications
  points: { type: Number, default: 0 },
  notifications: [
    {
      message: String,
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
  ],

  completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);



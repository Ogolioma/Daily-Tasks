const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  screenshotUrl: { type: String, required: true },
  pointsAwarded: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Proof", proofSchema);

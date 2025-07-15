const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  selectHow: String,
  taskTitle: String,
  budget: String,
  company: String,
  enquiry: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("ParticipantRequest", participantSchema);

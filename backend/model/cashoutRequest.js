const mongoose = require("mongoose");

const cashoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fullName: String,
  accountName: String,
  accountNumber: String,
  bank: String,
  paypalEmail: {type: String, default: null},
  status: { type: String, default: "Pending" },
  amount: Number,
  pointsUsed: Number,
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CashoutRequest", cashoutSchema);




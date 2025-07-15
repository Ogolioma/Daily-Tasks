const express = require("express");
const router = express.Router();
const CashoutRequest = require("../model/cashoutRequest");
const sendMail = require("../utils/sendMail");

// GET all cashouts
router.get("/cashouts", async (req, res) => {
  const cashouts = await CashoutRequest.find().populate("userId").sort({ requestedAt: -1 });
  res.json(cashouts);
});

// PATCH mark paid
router.patch("/cashouts/:id/mark-paid", async (req, res) => {
  try {
    const cashout = await CashoutRequest.findById(req.params.id).populate("userId");
    if (!cashout) return res.status(404).json({ msg: "Cashout not found" });

    cashout.status = "Paid";
    await cashout.save();

    sendMail(
      cashout.userId.email,
      "Cashout Approved",
      `Hello ${cashout.userId.firstName}, your cashout of ${cashout.amount} points has been approved and paid.`
    );

    res.json({ msg: "Cashout marked as paid & user emailed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to mark paid." });
  }
});

module.exports = router;
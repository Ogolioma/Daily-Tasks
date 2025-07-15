const express = require("express");
const router = express.Router();
const CashoutRequest = require("../model/cashoutRequest");
const User = require("../model/user");
const auth = require("../middleware/auth");
const sendMail = require("../utils/sendMail");

// USER submits cashout
router.post("/", auth, async (req, res) => {
  const { amount, accountName, accountNumber, bank } = req.body;
  if (!amount || !accountName || !accountNumber || !bank) {
    return res.status(400).json({ msg: "All fields required." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (amount > user.points) {
      return res.status(400).json({ msg: "Insufficient points." });
    }

    user.points -= amount;
    await user.save();

    const request = await CashoutRequest.create({
      userId: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      accountName,
      accountNumber,
      bank,
      amount,
      pointsUsed: amount,
    });

    res.json({ msg: "Cashout request submitted!", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error submitting cashout." });
  }
});

// USER sees own history
router.get("/user", auth, async (req, res) => {
  try {
    const history = await CashoutRequest.find({ userId: req.user.id }).sort({ requestedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch cashout history." });
  }
});

// ADMIN views all cashouts
router.get("/admin", async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  try {
    const cashouts = await CashoutRequest.find()
      .populate("userId", "email firstName")
      .sort({ requestedAt: -1 });
    res.json(cashouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch cashout requests." });
  }
});

// ADMIN marks as paid
router.patch("/admin/:id/mark-paid", async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  try {
    const cashout = await CashoutRequest.findById(req.params.id).populate("userId");
    if (!cashout) return res.status(404).json({ msg: "Cashout not found." });

    cashout.status = "Paid";
    await cashout.save();

    // Send approval mail
    sendMail(
      cashout.userId.email,
      "Cashout Approved",
      `Hello ${cashout.userId.firstName}, your cashout of ${cashout.amount} points has been approved and paid.`
    );

    res.json({ msg: "Cashout marked as paid, user notified." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to mark as paid." });
  }
});

module.exports = router;



/*const express = require("express");
const router = express.Router();
const CashoutRequest = require("../model/cashoutRequest");
const User = require("../model/user");
const auth = require("../middleware/auth");
const sendMail = require("../utils/sendMail");

// USER submits cashout
router.post("/", auth, async (req, res) => {
  const { amount, accountName, accountNumber, bank } = req.body;
  if (!amount || !accountName || !accountNumber || !bank) {
    return res.status(400).json({ msg: "All fields required." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (amount > user.points) {
      return res.status(400).json({ msg: "Insufficient points." });
    }

    user.points -= amount;
    await user.save();

    const request = await CashoutRequest.create({
      userId: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      accountName,
      accountNumber,
      bank,
      amount,
      pointsUsed: amount,
    });

    res.json({ msg: "Cashout request submitted!", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error submitting cashout." });
  }
});

// USER sees their own history
router.get("/user", auth, async (req, res) => {
  try {
    const history = await CashoutRequest.find({ userId: req.user.id }).sort({ requestedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch cashout history." });
  }
});

// ADMIN views all cashouts (secured)
router.get("/admin", async (req, res) => {
  const adminHeader = req.headers.authorization;
  if (!adminHeader || adminHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const cashouts = await CashoutRequest.find()
      .populate("userId", "email firstName")
      .sort({ requestedAt: -1 });
    res.json(cashouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch cashout requests." });
  }
});

// ADMIN marks as paid (secured)
router.patch("/admin/:id/mark-paid", async (req, res) => {
  const adminHeader = req.headers.authorization;
  if (!adminHeader || adminHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const cashout = await CashoutRequest.findById(req.params.id).populate("userId");
    if (!cashout) return res.status(404).json({ msg: "Cashout not found." });

    cashout.status = "Paid";
    await cashout.save();

    // ✅ Send cashout approval email
    sendMail(
      cashout.userId.email,
      "Cashout Approved",
      `Hello ${cashout.userId.firstName}, your cashout of ${cashout.amount} points has been approved and paid.`
    );

    res.json({ msg: "Cashout marked as paid, user notified." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to mark as paid." });
  }
});

module.exports = router;*/


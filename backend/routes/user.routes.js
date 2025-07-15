// backend/routes/user.routes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth"); // ✅ Your existing file
const User = require("../model/user"); // ✅ User model
const auth = require("../middleware/auth")


// GET user by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ User fetch error:", err.message || err);
    res.status(500).json({ msg: "Error fetching user" });
  }
});

module.exports = router;

// PATCH /api/users/notifications/mark-read
router.patch("/:id/notifications/mark-read", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    user.notifications.forEach(notif => notif.read = true);
    await user.save();

    res.json({ msg: "Notifications marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to mark notifications as read." });
  }
});
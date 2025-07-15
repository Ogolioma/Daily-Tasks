const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/user");
const Proof = require("../model/proof");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadProof } = require("../utils/cloudinary");

// Upload proof directly (optional separate endpoint)
router.post("/upload", auth, upload.single("screenshot"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });

    const result = await uploadProof(req.file.path, user);

    // Save proof
    const proof = new Proof({
      user: user._id,
      email: user.email,
      task: null,
      screenshotUrl: result.secure_url,
      pointsAwarded: 0
    });
    await proof.save();

    res.json({
      msg: "Proof uploaded successfully!",
      url: result.secure_url,
      public_id: result.public_id,
      folder: result.folder
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ msg: "Server error uploading proof." });
  }
});

module.exports = router;

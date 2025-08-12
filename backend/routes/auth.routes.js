const express = require("express");
const router = express.Router();
const {
  registerUser,
  createPassword,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/confirm-email/:token", createPassword);
router.post("/sign-in", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

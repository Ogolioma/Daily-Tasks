const express = require("express");
const router = express.Router();
const {
  registerUser,
  createPassword,
  loginUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/confirm-email/:token", createPassword);
router.post("/sign-in", loginUser);

module.exports = router;

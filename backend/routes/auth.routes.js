// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register user (no password yet)
router.post("/register", (req, res, next) => {
    console.log("Register route hit");
    next();
}, authController.registerUser);
//router.post("/register", authController.registerUser);

// Confirm email and create password
router.post("/confirm-email/:token", authController.createPassword);

// Login user
router.post("/login", authController.loginUser);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password via token
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/create-password", authController.createPassword);
router.post("/sign-in", authController.loginUser);

module.exports = router;

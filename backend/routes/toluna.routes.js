const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const router = express.Router();

// ===== YOUR CONFIG =====
const GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738"; // EN-US GUID
const PARTNER_AUTH_KEY = "cab4f708-f81f-4ad6-b4d0-cfee0fb65a7d"; // Reference data API key
const SECRET_KEY = "AysetGaBgao7To83UlZd7aUTokMyP62"; // Secret key
const BASE_URL = "https://training.ups.toluna.com"; // Sandbox base URL

// ===== Utility: Generate secure HMAC =====
function signData(data) {
  return crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
}

// ===== Generate Toluna Survey URL =====
router.get("/generate-url/:userId", async (req, res) => {
  try {
    let { userId } = req.params;

    // ✅ Convert ObjectId to plain string (critical fix)
    userId = String(userId).replace(/ObjectId\(|\)|'|"/g, "");

    const isTesting = true; // change to false in production
    const device = "mobile";
    const timestamp = Math.floor(Date.now() / 1000);

    // ✅ Use correct signing format
    const dataToSign = `${GUID}${userId}${timestamp}${SECRET_KEY}`;
    const signature = signData(dataToSign);

    // ✅ Construct full survey URL
    const surveyUrl = `${BASE_URL}/external/sample/survey?panelGUID=${GUID}&partnerAuthKey=${PARTNER_AUTH_KEY}&partnerRespondentID=${userId}&signature=${signature}&timestamp=${timestamp}&isTesting=${isTesting}&device=${device}`;

    // Return valid URL
    res.json({ success: true, surveyUrl });
  } catch (err) {
    console.error("Toluna URL generation error:", err);
    res.status(500).json({ success: false, message: "Failed to generate Toluna survey URL" });
  }
});

module.exports = router;

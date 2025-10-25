const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const router = express.Router();

// ===== CONFIG =====
const GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738"; // Your EN-US GUID
const PARTNER_AUTH_KEY = "cab4f708-f81f-4ad6-b4d0-cfee0fb65a7d"; // Your Partner Auth Key
const SECRET_KEY = "AysetGABgao7To83UIZD7aUTokMyP62"; // Your Secret Key
const BASE_URL = "https://training.ups.toluna.com"; // Sandbox/Test base URL

// ===== Utility: HMAC signature =====
function signData(data) {
  return crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
}

// ===== Get Surveys (Test Environment) =====
router.get("/get-surveys/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    userId = String(userId).replace(/ObjectId\(|\)|'|"/g, "");

    const timestamp = Math.floor(Date.now() / 1000);
    const device = "mobile";
    const isTesting = true;

    // 🔐 Generate signature
    const dataToSign = `${GUID}${userId}${timestamp}${SECRET_KEY}`;
    const signature = signData(dataToSign);

    // 🧠 Construct full Toluna URL
    const url = `${BASE_URL}/external/sample/surveylist?panelGUID=${GUID}&partnerAuthKey=${PARTNER_AUTH_KEY}&partnerRespondentID=${userId}&signature=${signature}&timestamp=${timestamp}&isTesting=${isTesting}&device=${device}`;

    // 🛰 Fetch surveys from Toluna
    const response = await axios.get(url);
    const surveys = response.data?.Surveys || [];

    res.json({
      success: true,
      surveys,
      total: surveys.length,
    });
  } catch (err) {
    console.error("❌ Toluna get-surveys error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Toluna surveys",
    });
  }
});

module.exports = router;

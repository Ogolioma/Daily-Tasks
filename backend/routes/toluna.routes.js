const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const router = express.Router();

// ✅ Replace with your actual partner GUID from Alin
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

// ✅ GET Toluna surveys for a member
router.get("/get-surveys/:memberCode", async (req, res) => {
  const { memberCode } = req.params;

  const url = `http://training.ups.toluna.com/IntegratedPanelService/api/Surveys/?memberCode=${memberCode}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  console.log("🔍 Fetching Toluna surveys from:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Toluna error:", response.statusText);
      return res.status(response.status).json({ error: "Failed to fetch surveys" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Toluna get-surveys error:", err.message);
    res.status(500).json({ error: "Server error while fetching Toluna surveys" });
  }
});

module.exports = router;
const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

const BASE_URL = "https://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

// ===== Create a Respondent on Toluna Sandbox =====
router.post("/create-member/:userId", async (req, res) => {
  const { userId } = req.params;
  const memberCode = `test_${userId}`; // unique per user

  const body = {
    RespondentCode: memberCode,
    PartnerGuid: PARTNER_GUID,
    Email: `${memberCode}@example.com`,
    CountryISO2: "US",
    LanguageISO2: "EN",
    Gender: "M",
    BirthDate: "1995-01-01"
  };

  try {
    const response = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    console.log("Create Respondent Response:", text);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to create respondent",
        details: text
      });
    }

    res.json({ success: true, memberCode, data: text });
  } catch (err) {
    console.error("Create respondent error:", err.message);
    res.status(500).json({ success: false, message: "Server error creating respondent" });
  }
});

// ===== Get Surveys for a Respondent =====
router.get("/get-surveys/:userId", async (req, res) => {
  const { userId } = req.params;
  const memberCode = `test_${userId}`;

  const url = `${BASE_URL}/Surveys/?memberCode=${memberCode}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  console.log("🔍 Fetching Toluna surveys from:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("Toluna error:", response.statusText, text);
      return res.status(response.status).json({ error: "Failed to fetch surveys", details: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    res.json(data);
  } catch (err) {
    console.error("Toluna get-surveys error:", err.message);
    res.status(500).json({ error: "Server error while fetching Toluna surveys" });
  }
});

module.exports = router;


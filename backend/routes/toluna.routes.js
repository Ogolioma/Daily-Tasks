const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

const BASE_URL = "http://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

// ===== Create a Member on Toluna Sandbox =====
router.post("/create-member/:userId", async (req, res) => {
  const { userId } = req.params;
  const memberCode = `test_${userId}`; // unique member for each user

  const body = {
    MemberCode: memberCode,
    PartnerGUID: PARTNER_GUID,
    Email: `${memberCode}@example.com`,
    CountryISO2: "US",
    LanguageISO2: "EN",
    Gender: "M",
    BirthDate: "1995-01-01",
  };

  try {
    const response = await fetch(`${BASE_URL}/Member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Create Member Response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to create member",
        details: data,
      });
    }

    res.json({ success: true, memberCode, data });
  } catch (err) {
    console.error("Create member error:", err.message);
    res.status(500).json({ success: false, message: "Server error creating member" });
  }
});

// ===== Get Surveys for a Member =====
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
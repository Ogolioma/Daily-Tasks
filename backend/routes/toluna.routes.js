
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";
const BASE_URL = "http://training.ups.toluna.com/IntegratedPanelService/api";

// ✅ Create Member (must happen before fetching surveys)
router.post("/create-member/:userId", async (req, res) => {
  const { userId } = req.params;
  const memberCode = `test_${userId}`; // format Alin expects

  const body = {
    partnerGuid: PARTNER_GUID,
    memberCode,
    firstName: "Test",
    lastName: "User",
    email: `${memberCode}@example.com`,
    gender: "M",
    countryId: 840, // 840 = USA, use correct country if needed
    languageId: 1, // English
    postalCode: "10001",
  };

  try {
    const response = await fetch(`${BASE_URL}/Members/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Toluna create-member error:", data);
      return res.status(response.status).json({ error: data });
    }

    console.log("✅ Member created:", data);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Toluna create-member exception:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get Surveys (only works *after* member creation)
router.get("/get-surveys/:userId", async (req, res) => {
  const { userId } = req.params;
  const memberCode = `test_${userId}`;

  const url = `${BASE_URL}/Surveys/?memberCode=${memberCode}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  console.log("🔍 Fetching Toluna surveys from:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Toluna error:", data);
      return res.status(response.status).json({ error: data });
    }

    res.json(data);
  } catch (err) {
    console.error("Toluna get-surveys error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const BASE_URL = "http://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

// === Create Respondent ===
router.post("/create-respondent", async (req, res) => {
  const body = {
    MemberCode: req.body.MemberCode || "test_1",
    PartnerGUID: PARTNER_GUID,
    CountryISO2: "US",
    LanguageISO2: "EN",
    Gender: "M",
    BirthDate: "1995-01-01",
  };

  try {
    const response = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    // Handle already-existing respondent gracefully
    if (!response.ok && !text.includes("already exists")) {
      console.error("Toluna create error:", response.status, text);
      return res.status(400).json({ success: false, message: text });
    }

    console.log("✅ Toluna respondent created successfully:", body.MemberCode);
    return res.json({ success: true, memberCode: body.MemberCode });
  } catch (err) {
    console.error("Toluna create-respondent error:", err);
    res.status(500).json({ success: false, message: "Server error creating respondent" });
  }
});

// === Get Surveys ===
router.get("/get-surveys/:memberCode", async (req, res) => {
  const { memberCode } = req.params;
  const url = `${BASE_URL}/Surveys/?memberCode=${memberCode}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=false&deviceTypeIDs=1&deviceTypeIDs=2`;

  console.log("📡 Fetching Toluna surveys from:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("Toluna error:", response.statusText, text);
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch surveys",
        details: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    // ✅ Normalize the data to always include SurveyURL
    const normalized = Array.isArray(data)
      ? data.map((s) => ({
          SurveyName: s.SurveyName || s.Title || "Toluna Survey",
          SurveyURL:
            s.SurveyURL ||
            s.Url ||
            s.UrlToSurvey ||
            s.SurveyLink ||
            s.RedirectURL ||
            "#",
          EstimatedLength: s.EstimatedLength || s.EstimatedLOI || "N/A",
        }))
      : [];

    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error("Toluna get-surveys error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching Toluna surveys" });
  }
});

module.exports = router;

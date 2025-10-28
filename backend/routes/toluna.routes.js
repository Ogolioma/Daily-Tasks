const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// Toluna API base + your sandbox Partner GUID
const BASE_URL = "http://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

// ===============================
// ✅ CREATE RESPONDENT (REGISTER)
// ===============================
router.post("/create-respondent", async (req, res) => {
  try {
    // If frontend sends a memberCode, use it. Else default to test_1
    const { memberCode } = req.body;
    const respondentCode = memberCode || "test_1";

    const payload = {
      PartnerGUID: PARTNER_GUID,
      MemberCode: respondentCode,
      BirthDate: "06/21/1985",
      IsActive: true,
      IsTest: true,
      AnsweredQuestions: [
        {
          QuestionID: 1001007,
          AnswerID: 2000247,
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.text();
    console.log("Create Respondent response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to create respondent",
        details: data,
      });
    }

    res.json({ success: true, respondentCode, data });
  } catch (err) {
    console.error("Toluna create-respondent error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error creating Toluna respondent",
    });
  }
});

// ===============================
// ✅ GET SURVEYS FOR RESPONDENT
// ===============================
router.get("/get-surveys", async (req, res) => {
  try {
    const { respondentCode } = req.query;

    if (!respondentCode) {
      return res.status(400).json({
        success: false,
        message: "respondentCode is required",
      });
    }

    const url = `${BASE_URL}/Surveys/?memberCode=${respondentCode}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=false&deviceTypeIDs=1&deviceTypeIDs=2`;

    console.log("🔍 Fetching Toluna surveys from:", url);

    const response = await fetch(url);

    const text = await response.text();
    if (!response.ok) {
      console.error("Toluna error:", text);
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch surveys",
        details: text,
      });
    }

    const data = JSON.parse(text);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Toluna get-surveys error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching Toluna surveys",
    });
  }
});

// ===============================
// ✅ Health Check
// ===============================
router.get("/ping", (req, res) => {
  res.send("Toluna route working ✅");
});

module.exports = router;


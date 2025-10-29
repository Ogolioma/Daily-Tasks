const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// Base URL and Partner GUID from Alin
const BASE_URL = "http://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

/**
 * 🔹 Create a new respondent on Toluna
 * This automatically uses a unique memberCode each time.
 */
router.post("/create-respondent", async (req, res) => {
  try {
    // Create unique member code for each user/test
    const memberCode = `user_${Date.now()}`;

    const body = {
      PartnerGUID: PARTNER_GUID,
      MemberCode: memberCode,
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

    console.log("📤 Creating Toluna respondent:", memberCode);

    const response = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Toluna create-respondent failed:", text);
      return res.status(response.status).json({ success: false, error: text });
    }

    console.log("✅ Toluna respondent created successfully");
    res.json({ success: true, memberCode, details: text });
  } catch (err) {
    console.error("Toluna create-respondent error:", err.message);
    res.status(500).json({ success: false, message: "Server error while creating respondent" });
  }
});

/**
 * 🔹 Get surveys for a respondent
 */
router.get("/get-surveys/:memberCode", async (req, res) => {
  const { memberCode } = req.params;

  const url = `${BASE_URL}/Surveys/?memberCode=${memberCode}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=false&deviceTypeIDs=1&deviceTypeIDs=2`;

  console.log("🔍 Fetching Toluna surveys from:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("Toluna get-surveys error:", response.statusText, text);
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


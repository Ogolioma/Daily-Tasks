// routes/toluna.routes.js
const express = require("express");
const fetch = require("node-fetch"); // use node-fetch@2 in package.json
const router = express.Router();

const BASE_URL = "https://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";

// ---------------------------
// Create respondent (POST)
// ---------------------------
// Matches Alin sample exactly (plain JSON)
router.post("/create-respondent", async (req, res) => {
  try {
    // Allow caller to supply a MemberCode (e.g. test_1 or something you generate),
    // fall back to test_1 for sandbox convenience.
    const { MemberCode } = req.body;
    const memberCode = MemberCode || "test_1";

    const payload = {
      PartnerGUID: PARTNER_GUID,
      MemberCode: memberCode,
      BirthDate: "06/21/1985",
      IsActive: true,
      IsTest: true,
      AnsweredQuestions: [
        { QuestionID: 1001007, AnswerID: 2000247 }
      ]
    };

    const tolunaRes = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await tolunaRes.text();

    // If Toluna returned a non-2xx, forward the text for debugging
    if (!tolunaRes.ok) {
      console.error("Toluna create-respondent error:", tolunaRes.status, text);
      return res.status(tolunaRes.status).json({ success: false, details: text });
    }

    // Toluna often returns plain JSON; try parse, else return raw
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    // Return the Toluna response and the memberCode used
    return res.json({ success: true, memberCode, data });
  } catch (err) {
    console.error("create-respondent exception:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------------
// Get surveys (GET with query param) — uses the exact Alin link form
// ---------------------------
router.get("/get-surveys", async (req, res) => {
  try {
    const memberCode = req.query.memberCode;
    if (!memberCode) {
      return res.status(400).json({ success: false, message: "memberCode query parameter required" });
    }

    // Use the exact GET format Alin posted
    const url = `${BASE_URL}/Surveys/?memberCode=${encodeURIComponent(memberCode)}&partnerGuid=${PARTNER_GUID}&numberOfSurveys=10&mobileCompatible=false&deviceTypeIDs=1&deviceTypeIDs=2`;

    console.log("Fetching Toluna surveys from:", url);

    const tolunaRes = await fetch(url, { method: "GET" });
    const text = await tolunaRes.text();

    if (!tolunaRes.ok) {
      console.error("Toluna get-surveys error:", tolunaRes.status, text);
      return res.status(tolunaRes.status).json({ success: false, details: text });
    }

    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("get-surveys exception:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// health
router.get("/ping", (req, res) => res.json({ success: true, message: "Toluna OK" }));

module.exports = router;

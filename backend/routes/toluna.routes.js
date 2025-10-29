// routes/toluna.routes.js
const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const router = express.Router();

const BASE_URL = "https://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";
const PARTNER_AUTH_KEY = "cab4f708-f81f-4ad6-b4d0-cfee0fb65a7d";

// Fix key length (32 bytes)
const RAW_KEY = "AysetGaBgao7To83UlZd7aUTokMyP62";
const ENCRYPTION_KEY = Buffer.alloc(32);
Buffer.from(RAW_KEY).copy(ENCRYPTION_KEY);
ENCRYPTION_KEY.fill(0, RAW_KEY.length);

function encrypt(obj) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let enc = cipher.update(JSON.stringify(obj), "utf8", "base64");
  enc += cipher.final("base64");
  return { Data: enc, IV: iv.toString("base64") };
}

function decrypt({ Data, IV }) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, Buffer.from(IV, "base64"));
  let dec = decipher.update(Data, "base64", "utf8");
  dec += decipher.final("utf8");
  return JSON.parse(dec);
}

function sign(bodyStr) {
  return crypto.createHmac("sha256", PARTNER_AUTH_KEY).update(bodyStr).digest("hex");
}

// CREATE RESPONDENT - FIXED
router.post("/create-respondent", async (req, res) => {
  try {
    const { memberCode } = req.body;

    // REQUIRED: memberCode must exist
    if (!memberCode) {
      return res.status(400).json({
        success: false,
        message: "memberCode is required in request body"
      });
    }

    const plain = {
      PartnerGUID: PARTNER_GUID,
      MemberCode: memberCode, // EXACT FIELD NAME
      BirthDate: "06/21/1985",
      IsActive: true,
      IsTest: true,
      AnsweredQuestions: [
        { QuestionID: 1001007, AnswerID: 2000247 }
      ]
    };

    const encrypted = encrypt(plain);
    const bodyStr = JSON.stringify(encrypted);
    const signature = sign(bodyStr);

    const apiRes = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Toluna-Signature": signature
      },
      body: bodyStr
    });

    const raw = await apiRes.text();

    if (!apiRes.ok) {
      console.log("Toluna Error:", raw);
      return res.status(apiRes.status).json({
        success: false,
        error: raw,
        status: apiRes.status
      });
    }

    const decrypted = decrypt(JSON.parse(raw));
    res.json({ success: true, data: decrypted });
  } catch (e) {
    console.error("Create respondent error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET SURVEYS - FIXED
router.post("/get-surveys", async (req, res) => {
  try {
    const { respondentCode } = req.body;
    if (!respondentCode) {
      return res.status(400).json({ success: false, message: "respondentCode required" });
    }

    const plain = {
      PartnerGUID: PARTNER_GUID,
      MemberCode: respondentCode, // EXACT NAME
      NumberOfSurveys: 10,
      MobileCompatible: false,
      DeviceTypeIDs: [1, 2]
    };

    const encrypted = encrypt(plain);
    const bodyStr = JSON.stringify(encrypted);
    const signature = sign(bodyStr);

    const apiRes = await fetch(`${BASE_URL}/Surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Toluna-Signature": signature
      },
      body: bodyStr
    });

    const raw = await apiRes.text();
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ success: false, error: raw });
    }

    const decrypted = decrypt(JSON.parse(raw));
    res.json({ success: true, surveys: decrypted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/ping", (req, res) => res.json({ success: true, message: "Toluna OK" }));

module.exports = router;
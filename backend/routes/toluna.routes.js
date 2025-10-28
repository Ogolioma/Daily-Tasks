// routes/toluna.routes.js
const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const router = express.Router();

const BASE_URL = "https://training.ups.toluna.com/IntegratedPanelService/api";
const PARTNER_GUID = "674C993C-EEE5-468F-ACA7-B340D87CD738";
const PARTNER_AUTH_KEY = "cab4f708-f81f-4ad6-b4d0-cfee0fb65a7d";

// ✅ FIXED: Pad key to EXACTLY 32 bytes
const RAW_KEY = "AysetGaBgao7To83UlZd7aUTokMyP62";
const ENCRYPTION_KEY = Buffer.alloc(32);
Buffer.from(RAW_KEY).copy(ENCRYPTION_KEY);
ENCRYPTION_KEY.fill("0", RAW_KEY.length); // pad with null bytes

console.log("🔑 Encryption key length:", ENCRYPTION_KEY.length); // Should log: 32

// ✅ ENCRYPT
function encrypt(obj) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let enc = cipher.update(JSON.stringify(obj), "utf8", "base64");
  enc += cipher.final("base64");
  return { Data: enc, IV: iv.toString("base64") };
}

// ✅ DECRYPT
function decrypt({ Data, IV }) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, Buffer.from(IV, "base64"));
  let dec = decipher.update(Data, "base64", "utf8");
  dec += decipher.final("utf8");
  return JSON.parse(dec);
}

// ✅ HMAC SIGN
function sign(bodyStr) {
  return crypto.createHmac("sha256", PARTNER_AUTH_KEY).update(bodyStr).digest("hex");
}

// CREATE RESPONDENT
router.post("/create-respondent", async (req, res) => {
  try {
    const { memberCode = "test_1" } = req.body;

    const plain = {
      PartnerGUID,
      MemberCode: memberCode,
      BirthDate: "06/21/1985",
      IsActive: true,
      IsTest: true,
      AnsweredQuestions: [{ QuestionID: 1001007, AnswerID: 2000247 }]
    };

    const encrypted = encrypt(plain);
    const bodyStr = JSON.stringify(encrypted);
    const signature = sign(bodyStr);

    console.log("📤 Sending to Toluna...");

    const apiRes = await fetch(`${BASE_URL}/Respondent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Toluna-Signature": signature
      },
      body: bodyStr
    });

    const raw = await apiRes.text();
    console.log("📥 Toluna raw response:", raw.slice(0, 200) + "...");

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ 
        success: false, 
        error: raw,
        status: apiRes.status 
      });
    }

    const decrypted = decrypt(JSON.parse(raw));
    res.json({ success: true, data: decrypted });
  } catch (e) {
    console.error("❌ Toluna error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET SURVEYS
router.post("/get-surveys", async (req, res) => {
  try {
    const { respondentCode } = req.body;
    if (!respondentCode) return res.status(400).json({ success: false, message: "respondentCode required" });

    const plain = {
      PartnerGUID,
      MemberCode: respondentCode,
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
    console.error("❌ Surveys error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/ping", (req, res) => res.json({ success: true, message: "Toluna routes OK" }));

module.exports = router;
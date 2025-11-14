const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// ======================================================
// TOLUNA PRODUCTION SETTINGS
// ======================================================

// PRODUCTION BASE URLS
const MEMBER_BASE = "https://ip.surveyrouter.com";
const SURVEY_BASE = "https://tws.toluna.com";

// Partner GUIDs by culture
const CULTURE_GUIDS = {
  "EN-US": "71070C9C-8D9B-4B65-B11C-7406E5B8D52A",
  "EN-IN": "3FEC87CF-5B1C-4DE2-B420-E3E300553087",
  "EN-KE": "EEBA664D-AED2-409B-9211-664A4289BD09",
  "EN-NG": "C27A55FA-3EEE-4576-A985-149055B41A01",
  "EN-ZA": "7A9B6E1E-2426-4AD7-86E6-768BDD3A7898",
};

// Default End Pages
const END_PAGE_URLS = {
  FraudTerminate: "https://dailytasks.co/surveys/fraud",
  MaxSurveysReached: "https://dailytasks.co/surveys/max-reached",
  NoCookies: "https://dailytasks.co/surveys/no-cookies",
  NoSurveys: "https://dailytasks.co/surveys/no-surveys",
  NotQualified: "https://dailytasks.co/surveys/not-qualified",
  Qualified: "https://dailytasks.co/surveys/qualified",
  QuotaFull: "https://dailytasks.co/surveys/quota-full",
  SurveyNotAvailable: "https://dailytasks.co/surveys/unavailable",
  SurveyTaken: "https://dailytasks.co/surveys/already-taken",
  Terminated: "https://dailytasks.co/surveys/terminated",
};

// Notification URLs
const NOTIFICATION_URLS = {
  CompletionURL: "https://daily-tasks-556b.onrender.com/api/toluna/completed",
  TerminateNotification: "https://daily-tasks-556b.onrender.com/api/toluna/terminated",
  SurveyNotification: "https://daily-tasks-556b.onrender.com/api/toluna/survey",
  QuotaNotification: "https://daily-tasks-556b.onrender.com/api/toluna/quota",
};

// ======================================================
// AUTO-CULTURE DETECTION FROM IP
// ======================================================
async function detectCulture(req) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "8.8.8.8";

    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await geoRes.json();
    const country = geo.country_code;

    switch (country) {
      case "NG": return "EN-NG";
      case "IN": return "EN-IN";
      case "KE": return "EN-KE";
      case "ZA": return "EN-ZA";
      case "US": return "EN-US";
      default: return "EN-US";
    }
  } catch {
    return "EN-US";
  }
}

// ======================================================
// CULTURE LOOKUP
// ======================================================
function getCultureData(culture = "EN-NG") {
  const guid = CULTURE_GUIDS[culture] || CULTURE_GUIDS["EN-US"];
  const country = culture.split("-")[1] || "US";
  const language = culture.split("-")[0] || "EN";
  return { guid, country, language };
}

// ======================================================
// CREATE RESPONDENT
// ======================================================
router.post("/create-respondent", async (req, res) => {
  const autoCulture = await detectCulture(req);
  const culture = req.body.culture || autoCulture;

  const { guid, country, language } = getCultureData(culture);
  const { Gender = "M", BirthDate = "1995-01-01" } = req.body;

  // generate member code
  const MemberCode = `DT-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  const body = {
    PartnerGUID: guid,
    MemberCode,
    CountryISO2: country,
    LanguageISO2: language,
    Gender,
    BirthDate,
    isTesting: false,
    EndPageUrls: END_PAGE_URLS,
    NotificationUrls: NOTIFICATION_URLS,
  };

  try {
    const response = await fetch(`${MEMBER_BASE}/Respondent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok && !text.includes("already exists")) {
      console.error("❌ Toluna respondent error:", response.status, text);
      return res.status(400).json({ success: false, message: text });
    }

    console.log(`✅ Respondent created (${culture}) → ${MemberCode}`);
    return res.json({ success: true, memberCode: MemberCode });
  } catch (err) {
    console.error("Toluna create-respondent error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// GET SURVEYS FOR MEMBER
// ======================================================
router.get("/get-surveys/:memberCode/:culture", async (req, res) => {
  const { memberCode, culture = "EN-NG" } = req.params;
  const { guid } = getCultureData(culture);

  const url = `${SURVEY_BASE}/Surveys/?memberCode=${encodeURIComponent(
  memberCode
)}&partnerGuid=${guid}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;


  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("❌ Survey fetch error:", response.status, text);
      return res.status(response.status).json({ success: false, message: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = [];
    }

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
          CPI: s.CPI || s.Incentive || 0,
        }))
      : [];

    res.json({ success: true, data: normalized });
  } catch (err) {
    console.error("❌ Toluna get-surveys error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// NOTIFICATION HANDLERS
// Toluna sends these after the user completes / terminates surveys
//
// Points rule: 1$ CPI = 25 points
// ======================================================

function calculatePoints(cpi) {
  const numeric = parseFloat(cpi || 0);
  return Math.round(numeric * 25);
}

router.post("/completed", async (req, res) => {
  const { MemberCode, CPI } = req.body;

  const points = calculatePoints(CPI);

  console.log(`🎉 COMPLETED → ${MemberCode}, CPI=$${CPI}, Points=${points}`);

  // TODO update user balance in database
  // await User.updateOne({ memberCode: MemberCode }, { $inc: { points } });

  return res.json({ success: true });
});

router.post("/terminated", async (req, res) => {
  console.log("⚠️ USER TERMINATED SURVEY:", req.body);
  return res.json({ success: true });
});

router.post("/survey", async (req, res) => {
  console.log("📩 Survey Notification:", req.body);
  return res.json({ success: true });
});

router.post("/quota", async (req, res) => {
  console.log("🚫 Quota Full:", req.body);
  return res.json({ success: true });
});

module.exports = router;
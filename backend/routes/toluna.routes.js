// routes/toluna.routes.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// ======================================================
// CONFIG (exact URLs you requested — unchanged)
// ======================================================
const IP_CORE_URL = "https://ip.surveyrouter.com/IntegratedPanelService/api";

// Culture → Partner GUID (from your sheet)
const CULTURE_GUIDS = {
  "EN-US": "71070C9C-8D9B-4B65-B11C-7406E5B8D52A",
  "EN-IN": "3FEC87CF-5B1C-4DE2-B420-E3E300553087",
  "EN-KE": "EEBA664D-AED2-409B-9211-664A4289BD09",
  "EN-NG": "C27A55FA-3EEE-4576-A985-149055B41A01",
  "EN-ZA": "7A9B6E1E-2426-4AD7-86E6-768BDD3A7898",
};

// End pages
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

// Notifications
const NOTIFICATION_URLS = {
  CompletionURL: "https://daily-tasks-556b.onrender.com/api/toluna/completed",
  TerminateNotification: "https://daily-tasks-556b.onrender.com/api/toluna/terminated",
  SurveyNotification: "https://daily-tasks-556b.onrender.com/api/toluna/survey",
  QuotaNotification: "https://daily-tasks-556b.onrender.com/api/toluna/quota",
};

// ======================================================
// Helpers
// ======================================================
function getCultureData(culture = "EN-NG") {
  const c = (culture || "EN-NG").toUpperCase();
  const guid = CULTURE_GUIDS[c] || CULTURE_GUIDS["EN-US"];
  const country = (c.split("-")[1] || "US").toUpperCase();
  const language = (c.split("-")[0] || "EN").toUpperCase();
  return { guid, country, language };
}

async function detectCulture(req) {
  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket.remoteAddress ||
      "8.8.8.8";

    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await geoRes.json();

    const cc = geo?.country_code?.toUpperCase() || null;

    switch (cc) {
      case "NG": return "EN-NG";
      case "IN": return "EN-IN";
      case "KE": return "EN-KE";
      case "ZA": return "EN-ZA";
      case "US": return "EN-US";
      default: return "EN-US";
    }
  } catch (e) {
    console.warn("detectCulture failed:", e.message);
    return "EN-US";
  }
}

async function safeParseTextResponse(res) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

// ======================================================
// CREATE RESPONDENT
// POST https://ip.surveyrouter.com/IntegratedPanelService/api/Respondent
// ======================================================
router.post("/create-respondent", async (req, res) => {
  const autoCulture = await detectCulture(req);
  const culture = (req.body.culture || autoCulture).toUpperCase();
  const { guid, country, language } = getCultureData(culture);

  const MemberCode =
    req.body.MemberCode ||
    `DT-${Date.now()}-${Math.floor(Math.random() * 90000)}`;

  const payload = {
    PartnerGuid: guid,
    MemberCode,
    CountryISO2: country,
    LanguageISO2: language,
    Gender: req.body.Gender || "M",
    BirthDate: req.body.BirthDate || "1995-01-01",
    EndPageUrls: END_PAGE_URLS,
    NotificationUrls: NOTIFICATION_URLS,
  };

  const endpoint = `${IP_CORE_URL}/Respondent`;

  try {
    console.log("Toluna create-respondent ->", { endpoint, MemberCode, culture });

    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const parsed = await safeParseTextResponse(r);

    console.log("Toluna create response status:", r.status);
    if (!r.ok) {
      console.error("create-respondent failed:", parsed);
      return res.status(400).json({ success: false, detail: parsed });
    }

    const returnedMemberCode =
      parsed?.MemberCode ||
      parsed?.memberCode ||
      parsed?.MemberID ||
      MemberCode;

    return res.json({
      success: true,
      memberCode: returnedMemberCode,
      raw: parsed,
    });
  } catch (err) {
    console.error("create-respondent exception:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ======================================================
// UPDATE RESPONDENT
// ======================================================
router.put("/update-respondent", async (req, res) => {
  if (!req.body.MemberCode && !req.body.memberCode) {
    return res.status(400).json({ success: false, message: "Missing MemberCode" });
  }

  const endpoint = `${IP_CORE_URL}/Respondent`;

  try {
    console.log("Toluna update-respondent ->", {
      endpoint,
      keys: Object.keys(req.body).slice(0, 8),
    });

    const r = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const parsed = await safeParseTextResponse(r);

    if (!r.ok) {
      console.error("update-respondent failed:", parsed);
      return res.status(400).json({ success: false, detail: parsed });
    }

    return res.json({ success: true, raw: parsed });
  } catch (err) {
    console.error("update-respondent exception:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ======================================================
// GET SURVEYS (FIXED VERSION)
// ======================================================
router.get("/get-surveys/:memberCode/:culture?", async (req, res) => {
  const { memberCode, culture } = req.params;

  if (!memberCode) {
    return res.status(400).json({ success: false, message: "memberCode required" });
  }

  const chosenCulture = (culture || "EN-NG").toUpperCase();
  const { guid } = getCultureData(chosenCulture);

  const url =
    `${IP_CORE_URL}/Surveys/?memberCode=${encodeURIComponent(memberCode)}` +
    `&partnerGuid=${encodeURIComponent(guid)}` +
    `&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  try {
    console.log("Fetching Toluna surveys ->", url);

    const r = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    const text = await r.text();
    if (!r.ok) {
      console.error("Toluna surveys fetch failed:", r.status, text);
      return res.status(r.status).json({ success: false, detail: text });
    }

    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    // FIXED NORMALIZATION (Toluna uses "URL")
    const normalized = Array.isArray(data)
      ? data.map((s) => ({
          SurveyName: s.SurveyName || s.Title || s.Name || "Toluna Survey",

          // **** CRITICAL FIX ****
          SurveyURL:
            s.URL ||
            s.Url ||
            s.Link ||
            s.RedirectURL ||
            s.SurveyURL ||
            "#",

          EstimatedLength:
            s.EstimatedLength ||
            s.EstimatedLOI ||
            s.LengthOfInterview ||
            s.Duration ||
            "N/A",

          CPI: s.CPI || s.Incentive || s.MemberAmount || 0,
        }))
      : [];

    return res.json({
      success: true,
      data: normalized,
      raw: data,
    });
  } catch (err) {
    console.error("get-surveys exception:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ======================================================
// CALLBACKS
// ======================================================
function calculatePoints(cpi) {
  return Math.round((parseFloat(cpi || 0) || 0) * 25);
}

router.post("/completed", async (req, res) => {
  console.log("Toluna COMPLETED:", req.body);
  return res.json({ success: true });
});

router.post("/terminated", async (req, res) => {
  console.log("Toluna TERMINATED:", req.body);
  return res.json({ success: true });
});

router.post("/survey", async (req, res) => {
  console.log("Toluna SURVEY:", req.body);
  return res.json({ success: true });
});

router.post("/quota", async (req, res) => {
  console.log("Toluna QUOTA:", req.body);
  return res.json({ success: true });
});

module.exports = router;
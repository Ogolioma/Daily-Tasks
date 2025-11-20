// routes/toluna.routes.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// ======================================================
// CONFIG - do not change Toluna URLs (per your request)
// ======================================================
const IP_CORE_URL = "https://ip.surveyrouter.com/IntegratedPanelService/api";

// Culture -> GUID map (use your sheet values)
const CULTURE_GUIDS = {
  "EN-US": "71070C9C-8D9B-4B65-B11C-7406E5B8D52A",
  "EN-IN": "3FEC87CF-5B1C-4DE2-B420-E3E300553087",
  "EN-KE": "EEBA664D-AED2-409B-9211-664A4289BD09",
  "EN-NG": "C27A55FA-3EEE-4576-A985-149055B41A01",
  "EN-ZA": "7A9B6E1E-2426-4AD7-86E6-768BDD3A7898",
};

// End pages (keep exact urls you provided)
const END_PAGE_URLS = {
  FraudTerminate: "https://dailytasks.co/surveys/fraud?",
  MaxSurveysReached: "https://dailytasks.co/surveys/max-reached?",
  NoCookies: "https://dailytasks.co/surveys/no-cookies?",
  NoSurveys: "https://dailytasks.co/surveys/no-surveys?",
  NotQualified: "https://dailytasks.co/surveys/not-qualified?",
  Qualified: "https://dailytasks.co/surveys/qualified?",
  QuotaFull: "https://dailytasks.co/surveys/quota-full?",
  SurveyNotAvailable: "https://dailytasks.co/surveys/unavailable?",
  SurveyTaken: "https://dailytasks.co/surveys/already-taken?",
  Terminated: "https://dailytasks.co/surveys/terminated?",
};

// Notification URLs (kept exactly as you asked)
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
    // Works on Render, Netlify, Vercel, Cloudflare, Nginx
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      req.headers["x-real-ip"] ||
      req.headers["cf-connecting-ip"] ||
      (forwarded ? forwarded.split(",").shift().trim() : null) ||
      req.socket.remoteAddress ||
      "8.8.8.8";

    console.log("📌 DETECTED IP:", ip);

    // 🔥 SWITCHED TO ipwho.is → always JSON, never rate-limited
    const geoRes = await fetch(`https://ipwho.is/${ip}`);
    const geo = await geoRes.json();

    console.log("📌 GEO:", geo);

    const cc = geo.country_code?.toUpperCase();
    console.log("📌 COUNTRY CODE:", cc);

    if (!cc) return "EN-US";

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

// Small utility to safe-parse JSON
async function safeParseTextResponse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// ======================================================
// CREATE RESPONDENT (Dashboard / IntegratedPanelService)
// POST https://ip.surveyrouter.com/IntegratedPanelService/api/Respondent
// ======================================================
router.post("/create-respondent", async (req, res) => {
  const autoCulture = await detectCulture(req);
  const culture = (req.body.culture || autoCulture || "EN-NG").toUpperCase();
  const { guid, country, language } = getCultureData(culture);

  const MemberCode = req.body.MemberCode || `DT-${Date.now()}-${Math.floor(Math.random() * 90000)}`;

  // Build payload following Dashboard API expected keys (PartnerGuid capitalization varies; use PartnerGuid)
  const payload = {
    PartnerGuid: guid,
    MemberCode,
    CountryISO2: country,
    LanguageISO2: language,
    Gender: req.body.Gender || "M",
    BirthDate: req.body.BirthDate || "1995-01-01",
    EndPageUrls: END_PAGE_URLS,
    NotificationUrls: NOTIFICATION_URLS,
    // include any optional profile fields passed from frontend (only include safe keys)
  };

  const endpoint = `${IP_CORE_URL}/Respondent`;
  try {
    console.log("Toluna create-respondent ->", { endpoint, MemberCode, culture });

    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "DailyTasks/1.0",
      },
      body: JSON.stringify(payload),
    });

    const parsed = await safeParseTextResponse(r);

    console.log("Toluna create response status:", r.status);
    if (!r.ok) {
      console.error("Toluna create-respondent failed:", parsed);
      return res.status(400).json({ success: false, message: "Toluna create respondent error", detail: parsed });
    }

    // Toluna may return MemberCode or RespondentID - return both if available
    const returnedMemberCode = (parsed && (parsed.MemberCode || parsed.memberCode || parsed.MemberID)) || MemberCode;
    console.log("Toluna respondent created:", returnedMemberCode);

    // Return to frontend (you can store returnedMemberCode in localStorage there)
    return res.json({ success: true, memberCode: returnedMemberCode, raw: parsed });
  } catch (err) {
    console.error("create-respondent exception:", err && err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err && err.message });
  }
});

// ======================================================
// UPDATE RESPONDENT (PUT same endpoint)
// PUT https://ip.surveyrouter.com/IntegratedPanelService/api/Respondent
// ======================================================
router.put("/update-respondent", async (req, res) => {
  const body = req.body;
  if (!body || (!body.MemberCode && !body.memberCode && !body.MemberID)) {
    return res.status(400).json({ success: false, message: "Missing MemberCode in request body" });
  }

  const endpoint = `${IP_CORE_URL}/Respondent`;
  try {
    console.log("Toluna update-respondent ->", { endpoint, sampleKeys: Object.keys(body).slice(0,6) });

    const r = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "DailyTasks/1.0",
      },
      body: JSON.stringify(body),
    });

    const parsed = await safeParseTextResponse(r);
    if (!r.ok) {
      console.error("Toluna update-respondent failed:", parsed);
      return res.status(400).json({ success: false, message: "Toluna update error", detail: parsed });
    }

    return res.json({ success: true, raw: parsed });
  } catch (err) {
    console.error("update-respondent exception:", err && err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err && err.message });
  }
});

// ======================================================
// GET SURVEYS (Survey Router)
// ======================================================
router.get("/get-surveys/:memberCode/:culture", async (req, res) => {
  const { memberCode, culture } = req.params;
  if (!memberCode) {
    return res.status(400).json({ success: false, message: "memberCode required" });
  }

  let chosenCulture = (culture || "").toUpperCase();

// If frontend sent "auto", detect on backend
if (chosenCulture === "AUTO") {
  chosenCulture = await detectCulture(req);
}

const { guid } = getCultureData(chosenCulture);

  const url = `${IP_CORE_URL}/Surveys/?memberCode=${encodeURIComponent(memberCode)}&partnerGuid=${encodeURIComponent(guid)}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  try {
    console.log("Fetching Toluna surveys ->", url);

    const r = await fetch(url, {
      headers: { Accept: "application/json, text/plain, */*" },
    });

    const text = await r.text();
    if (!r.ok) {
      console.error("Toluna surveys fetch failed:", r.status, text);
      return res.status(r.status).json({ success: false, message: "Toluna survey fetch error", detail: text });
    }

    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    // -------------------------------------------
    // ✔ FIXED NORMALIZATION (THIS WAS THE BUG)
    // -------------------------------------------
    const normalized = Array.isArray(data)
      ? data.map((s) => ({
          SurveyName: s.SurveyName || s.Title || s.Name || "Toluna Survey",

          // IMPORTANT FIX — use URL (Toluna uses this)
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
    console.error("get-surveys exception:", err && err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err && err.message });
  }
});



// ======================================================
// CALLBACK HANDLERS
// Toluna will POST to these. Keep them simple & return 200 quickly.
// ======================================================
function calculatePoints(cpi) {
  const numeric = parseFloat(cpi || 0) || 0;
  return Math.round(numeric * 25);
}

router.post("/completed", async (req, res) => {
  console.log("Toluna COMPLETED callback:", req.body);
  const MemberCode = req.body.MemberCode || req.body.memberCode;
  const CPI = req.body.CPI || req.body.cpi || req.body.Incentive;
  const points = calculatePoints(CPI);

  // TODO: persist to DB: update user's points using MemberCode -> your mapping
  // await User.updateOne({ memberCode: MemberCode }, { $inc: { points } });

  return res.json({ success: true });
});

router.post("/terminated", async (req, res) => {
  console.log("Toluna TERMINATED callback:", req.body);
  return res.json({ success: true });
});

router.post("/survey", async (req, res) => {
  console.log("Toluna SURVEY callback:", req.body);
  return res.json({ success: true });
});

router.post("/quota", async (req, res) => {
  console.log("Toluna QUOTA callback:", req.body);
  return res.json({ success: true });
});

module.exports = router;

// toluna.routes.js (production-ready with robust respondent creation + debug)
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// ======================================================
// BASE URLS (PRODUCTION)
// ======================================================
const TOLUNA_BASE = "https://tws.toluna.com";
const IP_CORE_URL = "http://ip.surveyrouter.com";

// ======================================================
// CULTURE → Partner GUID MAP
// ======================================================
const CULTURE_GUIDS = {
  "EN-US": "71070C9C-8D9B-4B65-B11C-7406E5B8D52A",
  "EN-IN": "3FEC87CF-5B1C-4DE2-B420-E3E300553087",
  "EN-KE": "EEBA664D-AED2-409B-9211-664A4289BD09",
  "EN-NG": "C27A55FA-3EEE-4576-A985-149055B41A01",
  "EN-ZA": "7A9B6E1E-2426-4AD7-86E6-768BDD3A7898",
};

// ======================================================
// END PAGE URLS
// ======================================================
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

// ======================================================
// NOTIFICATION URLS
// ======================================================
const NOTIFICATION_URLS = {
  CompletionURL: "https://daily-tasks-556b.onrender.com/api/toluna/completed",
  TerminateNotification: "https://daily-tasks-556b.onrender.com/api/toluna/terminated",
  SurveyNotification: "https://daily-tasks-556b.onrender.com/api/toluna/survey",
  QuotaNotification: "https://daily-tasks-556b.onrender.com/api/toluna/quota",
};

// ======================================================
// AUTO CULTURE DETECTION
// ======================================================
async function detectCulture(req) {
  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket.remoteAddress ||
      "8.8.8.8";

    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await geoRes.json();
    const country = geo.country_code;

    switch (country) {
      case "NG":
        return "EN-NG";
      case "IN":
        return "EN-IN";
      case "KE":
        return "EN-KE";
      case "ZA":
        return "EN-ZA";
      case "US":
        return "EN-US";
      default:
        return "EN-US";
    }
  } catch (e) {
    console.warn("detectCulture failed, defaulting to EN-US:", e && e.message);
    return "EN-US";
  }
}

// ======================================================
// CULTURE LOOKUP
// ======================================================
function getCultureData(culture = "EN-NG") {
  const guid = CULTURE_GUIDS[culture] || CULTURE_GUIDS["EN-US"];
  const country = (culture.split("-")[1] || "US").toUpperCase();
  const language = (culture.split("-")[0] || "EN").toUpperCase();
  return { guid, country, language };
}

// ======================================================
// Robust Create Respondent (tries canonical payloads & logs debug info)
// ======================================================
router.post("/create-respondent", async (req, res) => {
  const autoCulture = await detectCulture(req);
  const culture = (req.body.culture || autoCulture).toUpperCase();

  const { guid, country, language } = getCultureData(culture);
  const { Gender = "M", BirthDate = "1995-01-01" } = req.body;

  // Create deterministic-ish member code if you want persistence; here we generate
  const MemberCode = `DT-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  // Two payload shapes commonly seen in partner examples
  const payloads = [
    {
      PartnerGUID: guid,
      MemberCode,
      CountryISO2: country,
      LanguageISO2: language,
      Gender,
      BirthDate,
      isTesting: false,
      EndPageUrls: END_PAGE_URLS,
      NotificationUrls: NOTIFICATION_URLS,
    },
    {
      partnerGuid: guid,
      memberCode: MemberCode,
      countryISO2: country,
      languageISO2: language,
      gender: Gender,
      birthDate: BirthDate,
      isTesting: false,
      endPageUrls: END_PAGE_URLS,
      notificationUrls: NOTIFICATION_URLS,
    },
  ];

  const attempts = [];

  // single canonical endpoint to call (ExternalSample/Respondent)
const endpoint = `${TOLUNA_BASE}/api/externalsample/respondent`;

  for (const payload of payloads) {
    try {
      console.log("Attempting Toluna Respondent create:", { endpoint, culture, samplePayloadKeys: Object.keys(payload).slice(0, 6) });

      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "User-Agent": "DailyTasks-Toluna-Integration/1.0",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await r.text();
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = rawText;
      }

      const attempt = {
        endpoint,
        status: r.status,
        ok: r.ok,
        headers: (() => {
          const h = {};
          r.headers.forEach((v, k) => (h[k] = v));
          return h;
        })(),
        body: parsed,
        sentPayloadPreview: JSON.stringify(payload).slice(0, 1000),
      };

      attempts.push(attempt);
      console.log("Toluna response attempt:", attempt);

      // Success / already exists cases:
      if (r.ok) {
        // Toluna may not echo the MemberCode; use the created one as fallback
        const returnedMember =
          (parsed && (parsed.MemberCode || parsed.memberCode || parsed.MemberID || parsed.Member)) ||
          MemberCode;

        console.log("Respondent created successfully:", returnedMember);
        return res.json({ success: true, memberCode: returnedMember, debugAttempts: attempts });
      }

      if (typeof parsed === "string" && parsed.toLowerCase().includes("already exists")) {
        console.log("Toluna says already exists; accepting MemberCode:", MemberCode);
        return res.json({ success: true, memberCode: MemberCode, debugAttempts: attempts });
      }

      // otherwise, try the next payload
    } catch (err) {
      console.error("Network/exception when calling Toluna:", err && err.message);
      attempts.push({ endpoint, error: err && err.message });
    }
  }

  // nothing succeeded
  console.error("All create-respondent attempts failed. Attempts:", attempts);
  return res.status(502).json({
    success: false,
    message:
      "Failed to create Toluna respondent. See debugAttempts for full details. If this persists, copy debugAttempts to Toluna support.",
    debugAttempts: attempts,
  });
});

// ======================================================
// GET SURVEYS
// ======================================================
router.get("/get-surveys/:memberCode/:culture", async (req, res) => {
  const { memberCode, culture } = req.params;
  const chosenCulture = (culture || "EN-NG").toUpperCase();
  const { guid } = getCultureData(chosenCulture);

  const url = `${TOLUNA_BASE}/Surveys?memberCode=${encodeURIComponent(
    memberCode
  )}&partnerGuid=${guid}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  try {
    console.log("Fetching Toluna surveys:", url);
    const response = await fetch(url, {
      headers: { Accept: "application/json, text/plain, */*" },
    });
    const text = await response.text();

    if (!response.ok) {
      console.error("Survey fetch error:", response.status, text);
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
          SurveyURL: s.SurveyURL || s.Url || s.UrlToSurvey || "#",
          EstimatedLength: s.EstimatedLength || s.EstimatedLOI || "N/A",
          CPI: s.CPI || s.Incentive || 0,
        }))
      : [];

    res.json({ success: true, data: normalized });
  } catch (err) {
    console.error("Toluna get-surveys exception:", err && err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// CALLBACK HANDLERS (PRODUCTION)
// ======================================================
function calculatePoints(cpi) {
  const numeric = parseFloat(cpi || 0);
  return Math.round(numeric * 25);
}

router.post("/completed", async (req, res) => {
  const { MemberCode, CPI } = req.body;
  const points = calculatePoints(CPI);

  console.log(`🎉 COMPLETED → ${MemberCode} | CPI=$${CPI} | Points=${points}`);

  // TODO: persist to DB, e.g. await User.updateOne({ memberCode: MemberCode }, { $inc: { points } });

  res.json({ success: true });
});

router.post("/terminated", async (req, res) => {
  console.log("⚠️ TERMINATED →", req.body);
  res.json({ success: true });
});

router.post("/survey", async (req, res) => {
  console.log("📩 SURVEY NOTIFICATION →", req.body);
  res.json({ success: true });
});

router.post("/quota", async (req, res) => {
  console.log("🚫 QUOTA FULL →", req.body);
  res.json({ success: true });
});

module.exports = router;
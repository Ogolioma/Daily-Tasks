// routes/toluna.routes.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const auth = require("../middleware/auth"); // requires your auth middleware
const User = require("../model/user")

// ======================================================
// CONFIG - exact Toluna / Survey Router URLs (do not change)
// ======================================================
const IP_CORE_URL = "https://ip.surveyrouter.com/IntegratedPanelService/api";

// Culture -> GUID map (keep your values)
const CULTURE_GUIDS = {
  "EN-US": "71070C9C-8D9B-4B65-B11C-7406E5B8D52A",
  "EN-IN": "3FEC87CF-5B1C-4DE2-B420-E3E300553087",
  "EN-KE": "EEBA664D-AED2-409B-9211-664A4289BD09",
  "EN-NG": "C27A55FA-3EEE-4576-A985-149055B41A01",
  "EN-ZA": "7A9B6E1E-2426-4AD7-86E6-768BDD3A7898",
};

// End pages — keep the URLs you provided. NOTE: trailing '?' so Toluna can append encValue=...
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
  Terminated: "https://dailytasks.co/surveys/terminated>",
};

// Notification/callback endpoint
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

// Reliable IP -> country lookup (ipwho.is returns JSON reliably)
// ======================================================
// NEW detectCulture() — NO paid APIs, no limits, fully automatic
// ======================================================
async function detectCulture(req) {
  try {
    // Render assigns X-Country-Code
    // Netlify/Cloudflare assign CF-IPCountry
    const countryHeader =
      req.headers["x-country-code"] ||
      req.headers["cf-ipcountry"] ||
      "NG"; // fallback default

    const cc = countryHeader.toUpperCase();

    switch (cc) {
      case "NG": return "EN-NG";
      case "IN": return "EN-IN";
      case "KE": return "EN-KE";
      case "ZA": return "EN-ZA";
      case "US": return "EN-US";
      default: return "EN-US";
    }
  } catch (e) {
    console.log("Failed culture detect:", e.message);
    return "EN-US";
  }
}

// safe text -> try JSON parse
async function safeParseTextResponse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// try load User model (support User.js or user.js filename)
function requireUserModel() {
  try {
    return require("../model/user"); // common filename
  } catch (e1) {
    try { return require("../model/user"); } catch (e2) { return null; }
  }
}

// small helper to extract authenticated user id from token-decoded payload
function getAuthUserId(req) {
  if (!req.user) return null;
  return req.user.id || req.user._id || req.user.userId || null;
}

// ======================================================
// CREATE RESPONDENT
// - Only runs for authenticated users (auth middleware)
// - If user already has tolunaMemberCode, returns it (no new MemberCodes)
// - Otherwise creates respondent at Toluna and saves member code on user document
// ======================================================
router.post("/create-respondent", auth, async (req, res) => {
  const User = requireUserModel();
  const userId = getAuthUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: "Auth required" });
  if (!User) {
    console.warn("User model not found. Can't persist member code — continuing but returning code to frontend.");
  }

  try {
    // If user already has tolunaMemberCode, return it — do not create another
    let existingCode = null;
    if (User) {
      const dbUser = await User.findById(userId).select("tolunaMemberCode");
      existingCode = dbUser && dbUser.tolunaMemberCode ? dbUser.tolunaMemberCode : null;
    }

    if (existingCode) {
      console.log("Toluna: user already has MemberCode — returning existing:", existingCode);
      return res.json({ success: true, memberCode: existingCode, fromDb: true });
    }

    // Determine culture from IP (backend)
    const autoCulture = await detectCulture(req);
    const culture = (req.body.culture || autoCulture || "EN-NG").toUpperCase();
    const { guid, country, language } = getCultureData(culture);

    // deterministic MemberCode for this call (we'll persist it)
    const MemberCode = req.body.MemberCode || `DT-${Date.now()}-${Math.floor(Math.random() * 90000)}`;

    // Build payload expected by Dashboard / IntegratedPanelService
    // Attempt to pick DOB & Gender from DB first, then body, then fallback
  let dbUser = null;
  if (User && userId) {
    try {
      dbUser = await User.findById(userId).select("dob gender");
    } catch (e) {
      console.warn("Could not load DB user for DOB:", e && e.message);
    }
  }

  // prefer explicitly-provided body value, then DB, then fallback
  let rawDob = (req.body && req.body.BirthDate) ? req.body.BirthDate : (dbUser && dbUser.dob ? dbUser.dob : null);
  // If rawDob is a Date object or ISO string, normalize to YYYY-MM-DD, otherwise fallback
  let birthDate = "1970-06-01";
  if (rawDob) {
    try {
      const d = new Date(rawDob);
      if (!isNaN(d.getTime())) {
        birthDate = d.toISOString().slice(0, 10); // YYYY-MM-DD
      } else if (typeof rawDob === "string" && /^\d{4}-\d{2}-\d{2}/.test(rawDob)) {
        birthDate = rawDob.slice(0, 10);
      }
    } catch (e) {
      // keep fallback
    }
  }

  // gender normalization: prefer req.body, then DB, default to "M"
  const rawGender = (req.body && req.body.Gender) ? req.body.Gender : (dbUser && dbUser.gender ? dbUser.gender : "M");
  const gender = (typeof rawGender === "string" && rawGender.toLowerCase().startsWith("f")) ? "F" : "M";

  // Build payload expected by Dashboard / IntegratedPanelService
  const payload = {
    PartnerGuid: guid,
    MemberCode,
    CountryISO2: country,
    LanguageISO2: language,
    Gender: gender,
    BirthDate: birthDate,
    EndPageUrls: END_PAGE_URLS,
    NotificationUrls: NOTIFICATION_URLS,
  };

    const endpoint = `${IP_CORE_URL}/Respondent`;
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

    // Toluna may return MemberCode or RespondentID
    const returnedMemberCode = (parsed && (parsed.MemberCode || parsed.memberCode || parsed.MemberID)) || MemberCode;
    console.log("Toluna respondent created:", returnedMemberCode);

    // Persist to user's record (if model available)
    if (User) {
      try {
        await User.findByIdAndUpdate(userId, { tolunaMemberCode: returnedMemberCode });
        console.log("Saved tolunaMemberCode to user:", userId);
      } catch (e) {
        console.warn("Failed to save tolunaMemberCode to DB:", e && e.message);
      }
    }

    // Return memberCode to frontend
    return res.json({ success: true, memberCode: returnedMemberCode, raw: parsed });
  } catch (err) {
    console.error("create-respondent exception:", err && err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err && err.message });
  }
});

// ======================================================
// UPDATE RESPONDENT (PUT)
/* Useful if frontend wants to update demographics later.
   Expects a body that includes MemberCode (or memberCode) and any fields to update.
*/
// ======================================================
router.put("/update-respondent", auth, async (req, res) => {
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

    // If frontend sent MemberCode and user is authenticated, store it if missing
    const User = requireUserModel();
    const userId = getAuthUserId(req);
    const returnedMemberCode = (parsed && (parsed.MemberCode || parsed.memberCode || parsed.MemberID)) || body.MemberCode || body.memberCode;
    if (User && userId && returnedMemberCode) {
      try { await User.findByIdAndUpdate(userId, { tolunaMemberCode: returnedMemberCode }); } catch (e) { /* ignore */ }
    }

    return res.json({ success: true, raw: parsed });
  } catch (err) {
    console.error("update-respondent exception:", err && err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err && err.message });
  }
});

// ======================================================
// GET SURVEYS
// - supports:
// GET /get-surveys/:memberCode/:culture
// GET /get-surveys/me/auto -> uses authenticated user's saved tolunaMemberCode
// ======================================================
router.get("/get-surveys/:memberCode/:culture", auth, async (req, res) => {
  const { memberCode: memberCodeParam, culture } = req.params;
  const User = requireUserModel();
  const userId = getAuthUserId(req);

  if (!memberCodeParam) {
    return res.status(400).json({ success: false, message: "memberCode required" });
  }

  // Special values:
  // - "me" -> use saved tolunaMemberCode for authenticated user
  // - "auto" -> detect culture on backend
  let memberCode = memberCodeParam;
  if (memberCodeParam.toLowerCase() === "me") {
    if (!User || !userId) return res.status(400).json({ success: false, message: "No user context to fetch memberCode" });
    const dbUser = await User.findById(userId).select("tolunaMemberCode");
    memberCode = dbUser && dbUser.tolunaMemberCode;
    if (!memberCode) return res.status(404).json({ success: false, message: "No saved tolunaMemberCode for user" });
  }

  // culture handling
  let chosenCulture = (culture || "").toUpperCase();
  if (!chosenCulture || chosenCulture === "AUTO") {
    chosenCulture = await detectCulture(req);
  }

  const { guid } = getCultureData(chosenCulture);
  const url = `${IP_CORE_URL}/Surveys/?memberCode=${encodeURIComponent(memberCode)}&partnerGuid=${encodeURIComponent(guid)}&numberOfSurveys=10&mobileCompatible=true&deviceTypeIDs=1&deviceTypeIDs=2`;

  try {
    console.log("Fetching Toluna surveys ->", url);
    const r = await fetch(url, { headers: { Accept: "application/json, text/plain, */*" } });
    const text = await r.text();

    if (!r.ok) {
      console.error("Toluna surveys fetch failed:", r.status, text);
      return res.status(r.status).json({ success: false, message: "Toluna survey fetch error", detail: text });
    }

    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    // Normalize survey list to format frontend expects
const normalized = Array.isArray(data)
  ? data.map((s) => {
      // PartnerAmount is ALWAYS the real payout Toluna sends you
      const partnerAmount = parseFloat(
        s.PartnerAmount ||
        s.CPI ||
        s.Incentive ||
        s.Reward ||
        s.Amount ||
        0
      ) || 0;

      // Member points = PartnerAmount * 25 (standard rounding)
      const points = Math.round(partnerAmount * 25);

      return {
        SurveyName: s.SurveyName || s.Title || s.Name || "Toluna Survey",

        SurveyURL:
          s.URL ||
          s.Url ||
          s.Link ||
          s.RedirectURL ||
          s.SurveyURL ||
          s.LinkUrl ||
          "#",

        EstimatedLength:
          s.EstimatedLength ||
          s.EstimatedLOI ||
          s.LengthOfInterview ||
          s.Duration ||
          "N/A",

        // CPI shown to member = points
        CPI: points,

        // Keep explicit points field too
        Points: points,
      };
    })
  : [];

    return res.json({ success: true, data: normalized, raw: data });
  } catch (err) {
    console.error("get-surveys exception:", err && err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err && err.message });
  }
});

// ======================================================
// CALLBACK HANDLERS (Toluna will POST to these endpoints)
// ======================================================
function calculatePoints(cpi) {
  const numeric = parseFloat(cpi || 0) || 0;
  return Math.round(numeric * 25);
}

router.post("/completed", async (req, res) => {
  try {
    console.log("Toluna COMPLETED callback:", req.body);

    // ✅ Toluna real fields
    const memberCode = req.body.UniqueCode;
    const revenue = req.body.Revenue;
    const surveyRef = req.body.SurveyRef; // ✅ used for deduplication

    if (!memberCode || !revenue || !surveyRef) {
      console.warn("Toluna completed: missing required fields");
      return res.json({ success: true });
    }

    // Convert revenue → points
    const points = Math.round(parseFloat(revenue) * 1);

    if (points <= 0) {
      console.warn("Toluna completed: invalid points calculation");
      return res.json({ success: true });
    }

    const User = requireUserModel();
    if (!User) return res.json({ success: true });

    const user = await User.findOne({ tolunaMemberCode: memberCode });

    if (!user) {
      console.warn("No user found for Toluna memberCode:", memberCode);
      return res.json({ success: true });
    }

    // 🔒 DUPLICATE PROTECTION (safe + lightweight)
    user.tolunaCompletedSurveys = user.tolunaCompletedSurveys || [];

    if (user.tolunaCompletedSurveys.includes(surveyRef)) {
      console.warn("Duplicate Toluna callback ignored:", surveyRef);
      return res.json({ success: true });
    }

    // ✅ Credit user ONCE
    user.points += points;
    user.tolunaCompletedSurveys.push(surveyRef);

    user.notifications.push({
      message: `🎉 You earned ${points} points for completing a Toluna survey.`,
    });

    await user.save();

    console.log(
      `✅ Toluna credit successful: ${points} points → ${user.email}`
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Toluna completed error:", err);
    return res.json({ success: true });
  }
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

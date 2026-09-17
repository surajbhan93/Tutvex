// import ChatbotLead from "../models/chatbotLead.model";
import ChatbotLead from "../models/ChatbotLead.model";
import { chatbotIntents } from "../data/chatbotIntents";
import { detectLanguage } from "../utils/languageDetector";

type Role = "guest" | "parent" | "student" | "tutor" | "admin";

type ChatInput = {
  message: string;
  sessionId: string;
};

/* ===================== CONSTANTS ===================== */

const GREETINGS = ["hi", "hello", "hey", "namaste", "hii", "hy"];

/* ===================== MOOD PRIORITY ===================== */

const MOOD_PRIORITY = [
  "mood_sad",
  "mood_angry",
  "mood_lazy",
  "mood_happy",
];


/**
 * Hindi / Hinglish spelling normalization map
 * (You can keep extending this)
 */
const WEAK_WORDS = [
  "kya",
  "kaise",
  "hai",
  "h",
  "process",
  "ke",
  "ki",
  "ka",
];

const SYNONYMS_MAP: Record<string, string[]> = {
  salary: ["earning", "income", "payment"],
  authentic: ["genuine", "real", "trusted"],
  selection: ["interview", "verification", "documents"],
  fees: ["fee", "charges", "amount", "price"],
};

const SPELLING_MAP: Record<string, string> = {
  kease: "kaise",
  kesse: "kaise",
  kese: "kaise",
  kaisee: "kaise",
  bne: "bane",
  bano: "bane",
  h: "hai",
  hia: "hai",
  haii: "hai",
  kya: "kya",
  ky: "kya",
  tutorji: "tutor",
  teacherji: "teacher",
  registation: "registration",
  registrtion: "registration",
};

/* ===================== HELPERS ===================== */

// Step 1: normalize text
const normalizeText = (text: string) => {
  let cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Step 2: spelling correction
  for (const wrong in SPELLING_MAP) {
    const correct = SPELLING_MAP[wrong];
    const regex = new RegExp(`\\b${wrong}\\b`, "g");
    cleaned = cleaned.replace(regex, correct);
  }

  return cleaned;
};
const expandText = (text: string) => {
  let expanded = text;

  for (const key in SYNONYMS_MAP) {
    if (text.includes(key)) {
      expanded += " " + SYNONYMS_MAP[key].join(" ");
    }
  }

  return expanded;
};

/* ===================== MOOD DETECTION ===================== */

const detectMoodIntent = (text: string, role: Role) => {
  for (const mood of MOOD_PRIORITY) {
    const intent = chatbotIntents.find(
      (i) => i.intent === mood && i.roles.includes(role)
    );

    if (!intent) continue;

    for (const keyword of intent.keywords) {
      if (text.includes(normalizeText(keyword))) {
        return intent;
      }
    }
  }
  return null;
};


// Detect role from free text
const detectRoleFromText = (text: string): Role | null => {
  if (text.includes("parent")) return "parent";
  if (text.includes("student")) return "student";
  if (text.includes("tutor") || text.includes("teacher")) return "tutor";
  if (text.includes("admin")) return "admin";
  return null;
};

/**
 * AI-style fallback (safe, rule-based)
 * Future ready for OpenAI / Gemini
 */
const aiFallbackReply = (lang: "hi" | "en") => {
  return lang === "hi"
    ? "🤖 Main fees, tutor registration, selection process, cities, cashback aur contact jaise sawalon me madad kar sakta hoon. Kripya thoda clear likhein."
    : "🤖 I can help with fees, tutor registration, selection process, cities, cashback, and contact details. Please rephrase your question.";
};

/* ===================== MAIN SERVICE ===================== */

export const getChatbotReply = async ({
  message,
  sessionId,
}: ChatInput): Promise<string> => {
  const lang = detectLanguage(message);
  const text = normalizeText(message);

  let lead = await ChatbotLead.findOne({ sessionId });

  /* ===================== STEP 0 : FIRST OPEN ===================== */
  if (!lead) {
    await ChatbotLead.create({ sessionId, role: "guest" });
    return lang === "hi"
      ? "👋 Namaste! Tutvex me aapka swagat hai.\nAapka naam kya hai?"
      : "👋 Hello! Welcome to Tutvex.\nMay I know your name?";
  }

  /* ===================== GREETINGS ===================== */
  if (GREETINGS.includes(text)) {
    return lang === "hi"
      ? "😊 Namaste! Aap apna sawal pooch sakte hain."
      : "😊 Hello! You can ask your question.";
  }

  /* ===================== STEP 1 : NAME ===================== */
  if (!lead.name) {
    if (detectRoleFromText(text) || /^[6-9]\d{9}$/.test(text)) {
      return lang === "hi"
        ? "Kripya apna naam batayein 🙂"
        : "Please tell me your name 🙂";
    }

    lead.name = message;
    await lead.save();

    return lang === "hi"
      ? `Dhanyavaad ${lead.name}! Aap kaun ho? (Parent / Student / Tutor)`
      : `Thanks ${lead.name}! Are you a Parent, Student, or Tutor?`;
  }

  /* ===================== STEP 2 : ROLE ===================== */
  if (!lead.role || lead.role === "guest") {
    const detectedRole = detectRoleFromText(text);

    if (!detectedRole) {
      return lang === "hi"
        ? "Kripya batayein: Parent, Student ya Tutor?"
        : "Please tell me: Parent, Student, or Tutor?";
    }

    lead.role = detectedRole;
    await lead.save();

    if (detectedRole === "admin") {
      lead.completed = true;
      await lead.save();
      return "✅ Admin access confirmed. You can ask your question.";
    }

    return lang === "hi"
      ? "Apna mobile number batayein 📱"
      : "Please share your mobile number 📱";
  }

  /* ===================== STEP 3 : PHONE ===================== */
  if (!lead.phone && lead.role !== "admin") {
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(text)) {
      return lang === "hi"
        ? "Kripya valid 10 digit mobile number likhein."
        : "Please enter a valid 10-digit mobile number.";
    }


    lead.phone = text;
    lead.completed = true;
    await lead.save();

  

    return lang === "hi"
      ? "✅ Dhanyavaad! Ab aap apna sawal pooch sakte hain."
      : "✅ Thank you! You can now ask your question.";
  }

  /* ===================== NORMAL CHAT : CONFIDENCE SCORING ===================== */
/* ===================== NORMAL CHAT : SMART MATCH ===================== */

let bestIntent: any = null;
let bestScore = 0;

const expandedText = expandText(text);

for (const intent of chatbotIntents) {
  let intentScore = 0;

  for (const rawKeyword of intent.keywords) {
    const keyword = normalizeText(rawKeyword);
    const words = keyword.split(" ");

    let matched = 0;
    let strongMatches = 0;

    for (const word of words) {
      if (WEAK_WORDS.includes(word)) continue;

      if (expandedText.includes(word)) {
        matched++;
        strongMatches++;
      }
    }

    const score =
      words.length === 1
        ? strongMatches // single-word intent
        : matched / words.length;

    intentScore = Math.max(intentScore, score);
  }

  if (intentScore > bestScore) {
    bestScore = intentScore;
    bestIntent = intent;
  }
}

/* 🎯 DYNAMIC THRESHOLD */
const threshold = text.split(" ").length <= 2 ? 0.2 : 0.35;

/* ✅ ROLE CHECK (SOFT) */
if (
  bestIntent &&
  bestScore >= threshold &&
  (bestIntent.roles.includes(lead.role) || bestScore >= 0.7)
) {
  return bestIntent.answers[lang] || bestIntent.answers.en;
}

  /* ===================== MOOD BASED RESPONSE (AFTER BUSINESS INTENTS) ===================== */

  if (!bestIntent || bestScore < threshold) {
    const moodIntent = detectMoodIntent(text, lead.role);
    if (moodIntent) {
      return moodIntent.answers[lang] || moodIntent.answers.en;
    }
  }

  /* ===================== FUN ROAST FALLBACK ===================== */

  const roastIntent = chatbotIntents.find(
    (i) =>
      i.intent === "fun_roast" &&
      i.roles.includes(lead.role)
  );

  if (roastIntent && bestScore < 0.2) {
    return roastIntent.answers[lang] || roastIntent.answers.en;
  }

  /* ===================== AI FALLBACK ===================== */
  return aiFallbackReply(lang);
};

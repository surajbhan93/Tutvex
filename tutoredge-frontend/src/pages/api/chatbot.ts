import type { NextApiRequest, NextApiResponse } from "next";
import { aiReply } from "@/lib/aiFallback";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { language, role, step, message } = req.body;
  const isHindi = language === "hi";

  /* =====================
     STEP 1: LANGUAGE
  ===================== */
  if (!language) {
    return res.status(200).json({
      reply: "🌐 Choose language / भाषा चुनें",
      options: [
        { label: "English", value: "en" },
        { label: "हिंदी", value: "hi" },
      ],
    });
  }

  /* =====================
     STEP 2: ROLE
  ===================== */
  if (!role) {
    return res.status(200).json({
      reply: isHindi ? "आप कौन हैं?" : "Who are you?",
      options: [
        { label: "👨‍🏫 Tutor", value: "tutor" },
        { label: "👩‍👦 Parent", value: "parent" },
        { label: "🎓 Student", value: "student" },
      ],
    });
  }

  /* =====================
     STEP 3: WHATSAPP HANDOFF
  ===================== */
  if (step === "whatsapp") {
    return res.status(200).json({
      reply: isHindi
        ? "ठीक है 🙂 हमारी टीम आपसे WhatsApp पर जुड़ेगी।"
        : "Alright 🙂 our team will connect with you on WhatsApp.",
      end: true,
      whatsappMessage: isHindi
        ? "नमस्ते, मुझे Tutvex के बारे में जानकारी चाहिए।"
        : "Hello, I want to know more about Tutvex.",
    });
  }

  /* =====================
     STEP 4: GREETING
  ===================== */
  if (message && !step) {
    const msg = message.toLowerCase();

    if (msg.includes("hi") || msg.includes("hello")) {
      return res.status(200).json({
        reply: isHindi
          ? "नमस्ते 🙂 आप क्या जानना चाहते हैं?"
          : "Hello 🙂 What would you like to know?",
        options: [
          { label: "💰 Fees", value: "fees" },
          { label: "⏰ Timing", value: "timing" },
          { label: "🎓 Demo", value: "demo" },
        ],
      });
    }
  }

  /* =====================
     STEP 5: KEYWORD INTENTS
  ===================== */
  if (message && !step) {
    const msg = message.toLowerCase();

    if (msg.includes("fee")) {
      return res.status(200).json(parentFees(isHindi));
    }
    if (msg.includes("time")) {
      return res.status(200).json(parentTiming(isHindi));
    }
    if (msg.includes("demo")) {
      return res.status(200).json(parentDemo(isHindi));
    }
  }

  /* =====================
     STEP 6: AI FALLBACK
  ===================== */
  if (message) {
    const aiText = await aiReply(message, language);

    return res.status(200).json({
      reply: aiText,
      options: [{ label: "💬 Talk to Team on WhatsApp", value: "whatsapp" }],
    });
  }

  /* =====================
     ROLE DEFAULT MENU
  ===================== */
  if (role === "parent") {
    return res.status(200).json({
      reply: isHindi
        ? "आप क्या जानना चाहते हैं?"
        : "What would you like to know?",
      options: [
        { label: "💰 Fees", value: "fees" },
        { label: "⏰ Timing", value: "timing" },
        { label: "🎓 Demo", value: "demo" },
      ],
    });
  }

  if (role === "tutor") {
    return res.status(200).json({
      reply: isHindi
        ? "Tutor बनने के लिए हमारी टीम से WhatsApp पर बात करें।"
        : "Please talk to our team on WhatsApp to become a tutor.",
      end: true,
      whatsappMessage: isHindi
        ? "नमस्ते, मैं Tutvex पर Tutor बनना चाहता हूँ।"
        : "Hello, I want to register as a tutor.",
    });
  }

  if (role === "student") {
    return res.status(200).json({
      reply: isHindi
        ? "कृपया अपने Parent से संपर्क करवाएं।"
        : "Please ask your parent to contact us.",
      end: true,
      whatsappMessage: isHindi
        ? "नमस्ते, मैं एक छात्र हूँ और जानकारी चाहता हूँ।"
        : "Hello, I am a student and need guidance.",
    });
  }

  return res.status(200).json({
    reply: isHindi
      ? "मुझे समझ नहीं आया, कृपया विकल्प चुनें।"
      : "I didn’t understand. Please choose an option.",
  });
}

/* =====================
   HELPERS
===================== */

function parentFees(isHindi: boolean) {
  return {
    reply: isHindi
      ? "कक्षा 6–8: ₹1500\nकक्षा 9–10: ₹2000"
      : "Class 6–8: ₹1500\nClass 9–10: ₹2000",
    end: true,
    whatsappMessage: isHindi
      ? "नमस्ते, मैं अपने बच्चे की फीस की जानकारी चाहता हूँ।"
      : "Hello, I want to know the fees for my child.",
  };
}

function parentTiming(isHindi: boolean) {
  return {
    reply: isHindi
      ? "कक्षाएँ: सोमवार–शनिवार | शाम 4–8 बजे"
      : "Classes: Mon–Sat | 4 PM – 8 PM",
    end: true,
    whatsappMessage: isHindi
      ? "नमस्ते, कृपया कक्षा का समय बताएं।"
      : "Hello, please share class timings.",
  };
}

function parentDemo(isHindi: boolean) {
  return {
    reply: isHindi
      ? "डेमो क्लास उपलब्ध है ✅"
      : "Demo class available ✅",
    end: true,
    whatsappMessage: isHindi
      ? "नमस्ते, मैं डेमो क्लास बुक करना चाहता हूँ।"
      : "Hello, I want to book a demo class.",
  };
}

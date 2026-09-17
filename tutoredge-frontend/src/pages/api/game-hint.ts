import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type, question, word, scrambled } = req.body;

  let prompt = "";

  if (type === "math") {
    prompt = `You are a warm, encouraging tutor for kids aged 6–12 in India.
Give a SHORT helpful hint (max 2 sentences) for this maths problem: "${question}".
Do NOT reveal the answer directly. Use simple language. End with one fun emoji.`;
  } else if (type === "word") {
    prompt = `You are a friendly kids tutor.
Give a SHORT creative hint (max 2 sentences) to help a child unscramble "${scrambled}" into "${word}".
Hint about meaning or first letter only — do NOT spell the word. Use child-friendly language. One emoji at the end.`;
  } else {
    prompt = "Give one short encouragement sentence for a kid playing a memory matching game. Add 1 emoji.";
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 120,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const hint = data.content?.[0]?.text?.trim() || "You can do it! Think step by step 💡";
    return res.status(200).json({ hint });
  } catch {
    return res.status(200).json({ hint: "Stay focused and try again! You've got this 💪" });
  }
}

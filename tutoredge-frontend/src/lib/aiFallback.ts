export async function aiReply(
  message: string,
  language: string
): Promise<string> {
  try {
    const prompt =
      language === "hi"
        ? `User ka sawal hai: "${message}". Simple jawab do.`
        : `User question: "${message}". Give a short helpful reply.`;

    const res = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await res.json();

    // Blenderbot response
    if (data?.generated_text) {
      return data.generated_text;
    }

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }

    if (data?.error) {
      return language === "hi"
        ? "मैं आपकी मदद कर सकता हूँ। कृपया थोड़ा साफ़ लिखें।"
        : "I can help you. Please ask your question clearly.";
    }

    return language === "hi"
      ? "कृपया अपना सवाल थोड़ा विस्तार से लिखें।"
      : "Please write your question in more detail.";
  } catch (e) {
    return language === "hi"
      ? "अभी AI उपलब्ध नहीं है।"
      : "AI is temporarily unavailable.";
  }
}

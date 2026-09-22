export const detectLanguage = (text: string): "hi" | "en" => {
  // Hindi Unicode range
  const hindiRegex = /[\u0900-\u097F]/;
  
  // Hinglish common words (Roman script but Hindi meaning)
  const hinglishKeywords = [
    "kaise", "kya", "hai", "chahiye", "bane", "mujhe", "aap", "apna",
    "kaha", "kab", "kitna", "kitni", "hoga", "hogi", "karein", "karo",
    "milega", "milegi", "tha", "thi", "acha", "nahi", "haan", "ji",
    "mere", "tumhara", "tera", "uska", "yaha", "waha", "kyu", "kyun"
  ];
  
  // Check for Devanagari script
  if (hindiRegex.test(text)) return "hi";
  
  // Check for Hinglish (romanized Hindi words)
  const lowerText = text.toLowerCase();
  const hasHinglish = hinglishKeywords.some(word => 
    lowerText.includes(` ${word} `) || 
    lowerText.startsWith(`${word} `) || 
    lowerText.endsWith(` ${word}`)
  );
  
  return hasHinglish ? "hi" : "en";
};

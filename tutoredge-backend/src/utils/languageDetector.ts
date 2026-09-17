export const detectLanguage = (text: string): "hi" | "en" => {
  // Hindi Unicode range
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(text) ? "hi" : "en";
};

const hinglishMap: Record<string, string> = {
  fees: "fees",
  fee: "fees",
  paisa: "fees",
  payment: "fees",
  attendance: "attendance",
  present: "attendance",
  absent: "attendance",
  chhutti: "holiday",
  holiday: "holiday",
  exam: "exam",
  paper: "exam",
  test: "exam",
  result: "result",
  marks: "result",
  homework: "homework",
  kaam: "homework",
  teacher: "teacher",
  sir: "teacher",
  madam: "teacher",
  timing: "timing",
  samay: "timing",
};

export const normalizeText = (text: string): string[] => {
  const words = text.toLowerCase().split(/\s+/);

  return words.map((word) => hinglishMap[word] || word);
};

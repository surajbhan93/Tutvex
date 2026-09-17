// lib/filterTutor.ts

export interface TutorFilters {
  q: string; // Free text search
  subject: string;
  classLevel: string;
  board: string;
  city: string;
  area: string;
  radius: string; // "", "near", "2km", "5km", "10km"
  teachingMode: string; // "", "home", "online", "hybrid"
  experience: string; // "", "0-2", "3-5", "5-10", "10+"
  price: number; // max budget
  priceType: "per_hour" | "per_month";
  gender: string; // "", "male", "female"
  minRating: number; // 0, 4, 4.5, 5
  isVerifiedOnly: boolean;
  sortBy: "recommended" | "rating" | "experience" | "price_asc" | "price_desc" | "relevant";
}

export const DEFAULT_FILTERS: TutorFilters = {
  q: "",
  subject: "",
  classLevel: "",
  board: "",
  city: "",
  area: "",
  radius: "",
  teachingMode: "",
  experience: "",
  price: 15000,
  priceType: "per_month",
  gender: "",
  minRating: 0,
  isVerifiedOnly: false,
  sortBy: "recommended",
};

/* 🔹 HIERARCHICAL CITIES & LOCALITIES */
export const CITY_LOCATIONS: Record<string, string[]> = {
  "Prayagraj": [
    "Civil Lines",
    "Naini",
    "Katra",
    "George Town",
    "Tagore Town",
    "Allahpur",
    "Mumfordganj",
    "Salori",
    "Teliyarganj",
    "Ashok Nagar",
    "Jhalwa",
    "Rajrooppur",
  ],
  "Noida": [
    "Sector 15",
    "Sector 18",
    "Sector 62",
    "Sector 63",
    "Greater Noida West",
    "Indirapuram",
    "Techzone 4",
    "Sector 76",
    "Sector 137",
  ],
  "Varanasi": [
    "Mahmoorganj",
    "Lanka",
    "Assi",
    "Sigra",
    "Chetganj",
    "Bhelupur",
    "Nadesar",
  ],
  "Lucknow": [
    "Gomti Nagar",
    "Hazratganj",
    "Alambagh",
    "Vibhuti Khand",
    "Hasanganj",
    "Indira Nagar",
    "Mahanagar",
  ],
  "Kanpur": [
    "Civil Lines",
    "Swaroop Nagar",
    "Yashoda Nagar",
    "Kakadeo",
    "Kidwai Nagar",
  ],
  "Agra": [
    "Civil Lines",
    "Kamla Nagar",
    "Dayalbagh",
    "Sanjay Place",
    "Tajganj",
  ],
  "Meerut": [
    "Begum Bridge",
    "Jagriti Vihar",
    "Shastri Nagar",
    "Kanker Khera",
  ],
};

/* 🔹 POPULAR SEARCH CHIPS */
export const POPULAR_SEARCH_CHIPS = [
  { label: "Maths Tutor", filter: { subject: "Maths" } },
  { label: "Class 10 Tutor", filter: { classLevel: "Class 10" } },
  { label: "JEE Preparation", filter: { subject: "JEE Preparation" } },
  { label: "NEET Preparation", filter: { subject: "NEET Preparation" } },
  { label: "Home Tutor in Prayagraj", filter: { city: "Prayagraj", teachingMode: "home" } },
  { label: "Female Tutor", filter: { gender: "female" } },
  { label: "Online Tutor", filter: { teachingMode: "online" } },
];

const normalize = (v?: unknown) => {
  if (typeof v !== "string") return "";
  return v.toLowerCase().trim().replace(/s$/, "");
};

/**
 * SMART NATURAL LANGUAGE PARSER
 * Parses queries like "Maths tutor in Civil Lines" or "Class 10 physics teacher in Prayagraj"
 */
export function parseNaturalLanguageQuery(queryText: string): Partial<TutorFilters> {
  const parsed: Partial<TutorFilters> = {};
  if (!queryText.trim()) return parsed;

  const lower = queryText.toLowerCase();

  // Gender
  if (/\bfemale\b|\bwoman\b|\bgirl\b/.test(lower)) parsed.gender = "female";
  else if (/\bmale\b|\bman\b|\bboy\b/.test(lower)) parsed.gender = "male";

  // Teaching Mode
  if (/\bhome\b|\bdoorstep\b|\boffline\b/.test(lower)) parsed.teachingMode = "home";
  else if (/\bonline\b|\bvirtual\b|\bremote\b/.test(lower)) parsed.teachingMode = "online";
  else if (/\bhybrid\b/.test(lower)) parsed.teachingMode = "hybrid";

  // Classes
  const classMatch = lower.match(/\b(class|grade|std)\s*(\d{1,2})\b/i);
  if (classMatch) {
    parsed.classLevel = `Class ${classMatch[2]}`;
  } else if (/\bjee\b/.test(lower)) {
    parsed.subject = "JEE Preparation";
  } else if (/\bneet\b/.test(lower)) {
    parsed.subject = "NEET Preparation";
  }

  // Known subjects
  const knownSubjects = [
    "mathematics", "maths", "math", "physics", "chemistry", "biology",
    "english", "hindi", "computer science", "coding", "programming", "accounts", "economics"
  ];
  for (const s of knownSubjects) {
    if (new RegExp(`\\b${s}\\b`, "i").test(lower)) {
      if (s === "math" || s === "mathematics") parsed.subject = "Maths";
      else parsed.subject = s.charAt(0).toUpperCase() + s.slice(1);
      break;
    }
  }

  // Known cities & areas
  for (const [city, areas] of Object.entries(CITY_LOCATIONS)) {
    if (new RegExp(`\\b${city.toLowerCase()}\\b`, "i").test(lower)) {
      parsed.city = city;
    }
    for (const area of areas) {
      if (new RegExp(`\\b${area.toLowerCase()}\\b`, "i").test(lower)) {
        parsed.area = area;
        parsed.city = city;
        break;
      }
    }
  }

  return parsed;
}

/**
 * FILTER TUTORS
 */
export const filterTutors = (
  tutors: any[],
  filters: TutorFilters
) => {
  let result = [...tutors];

  /* FREE TEXT / SEARCH QUERY */
  if (filters.q && filters.q.trim()) {
    const qLower = filters.q.toLowerCase().trim();
    result = result.filter((t) => {
      const name = (t.fullName || t.name || "").toLowerCase();
      const headline = (t.headline || "").toLowerCase();
      const city = (t.location?.city || t.city || "").toLowerCase();
      const area = (t.location?.area || t.area || "").toLowerCase();
      const subjects = Array.isArray(t.subjects) ? t.subjects.join(" ").toLowerCase() : "";
      const classes = Array.isArray(t.classesTaught) ? t.classesTaught.join(" ").toLowerCase() : "";

      return (
        name.includes(qLower) ||
        headline.includes(qLower) ||
        city.includes(qLower) ||
        area.includes(qLower) ||
        subjects.includes(qLower) ||
        classes.includes(qLower)
      );
    });
  }

  /* SUBJECT */
  if (filters.subject) {
    const sub = normalize(filters.subject);
    result = result.filter((t) =>
      Array.isArray(t.subjects)
        ? t.subjects.some((s: string) => normalize(s) === sub || normalize(s).includes(sub))
        : false
    );
  }

  /* CLASS LEVEL */
  if (filters.classLevel) {
    const clsTarget = normalize(filters.classLevel);
    result = result.filter((t) =>
      Array.isArray(t.classesTaught)
        ? t.classesTaught.some((c: string) => normalize(c) === clsTarget || c === filters.classLevel)
        : true
    );
  }

  /* CITY */
  if (filters.city) {
    const targetCity = normalize(filters.city);
    result = result.filter((t) => {
      const c = normalize(t.location?.city || t.city);
      return c.includes(targetCity) || targetCity.includes(c);
    });
  }

  /* AREA */
  if (filters.area) {
    const targetArea = normalize(filters.area);
    result = result.filter((t) => {
      const a = normalize(t.location?.area || t.area);
      return a.includes(targetArea) || targetArea.includes(a);
    });
  }

  /* TEACHING MODE */
  if (filters.teachingMode) {
    const mode = filters.teachingMode.toLowerCase();
    result = result.filter((t) => {
      if (!t.teachingMode) return true;
      if (Array.isArray(t.teachingMode)) {
        return t.teachingMode.some((m: string) => m.toLowerCase().includes(mode));
      }
      return String(t.teachingMode).toLowerCase().includes(mode);
    });
  }

  /* EXPERIENCE */
  if (filters.experience) {
    result = result.filter((t) => {
      const exp = Number(t.yearsOfExperience) || 0;
      if (filters.experience === "0-2") return exp <= 2;
      if (filters.experience === "3-5") return exp >= 3 && exp <= 5;
      if (filters.experience === "5-10") return exp >= 5 && exp <= 10;
      if (filters.experience === "10+") return exp >= 10;
      return true;
    });
  }

  /* PRICE (MAX BUDGET) */
  if (filters.price < 15000) {
    result = result.filter((t) => {
      if (!t.price || Number(t.price) === 0) return true;
      return Number(t.price) <= filters.price;
    });
  }

  /* GENDER */
  if (filters.gender) {
    const targetGen = filters.gender.toLowerCase();
    result = result.filter((t) => {
      if (!t.gender) return true;
      return String(t.gender).toLowerCase() === targetGen;
    });
  }

  /* MIN RATING */
  if (filters.minRating > 0) {
    result = result.filter((t) => (t.rating || 0) >= filters.minRating);
  }

  /* VERIFIED ONLY */
  if (filters.isVerifiedOnly) {
    result = result.filter((t) => t.status === "approved" || t.isProfileComplete || t.isVerified);
  }

  /* SORTING */
  return sortTutors(result, filters.sortBy);
};

/**
 * SORT TUTORS
 */
export function sortTutors(tutors: any[], sortBy: TutorFilters["sortBy"]): any[] {
  const list = [...tutors];

  switch (sortBy) {
    case "rating":
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "experience":
      return list.sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
    case "price_asc":
      return list.sort((a, b) => (a.price || 99999) - (b.price || 99999));
    case "price_desc":
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    case "relevant":
    case "recommended":
    default:
      return list.sort((a, b) => {
        const scoreA = (a.rating || 4.5) * 10 + (a.yearsOfExperience || 0) * 2 + (a.profileViews || 0) * 0.1;
        const scoreB = (b.rating || 4.5) * 10 + (b.yearsOfExperience || 0) * 2 + (b.profileViews || 0) * 0.1;
        return scoreB - scoreA;
      });
  }
}

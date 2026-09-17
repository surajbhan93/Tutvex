// seo.config.ts
// Exact routes derived ONLY from onlineLinks + internationalSections

// ─── Types ────────────────────────────────────────────────────────────────────

export type OnlineSubject = "maths" | "science" | "jee" | "neet" | "cbse";
export type CountrySlug   = "uk" | "canada" | "uae" | "singapore" | "australia";
export type SubLocation   = "toronto" | "dubai" | "abu-dhabi" | "sydney" | "melbourne";
export type LocationType  =
  | "home-tutor" | "online-tutor" | "gcse-tutor" | "a-level-tutor"
  | "tutor-job"  | "maths-tutor"  | "cbse-tutor" | "primary-tutor" | "tutor";

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
}

// ─── /online-tuition (index) ──────────────────────────────────────────────────

export const ONLINE_TUITION_SEO: SEOMeta = {
  title: "Online Tuition | Live 1-on-1 Online Tutoring",
  description:
    "Find expert online tutors for Maths, Science, JEE, NEET, CBSE and more. Book live one-on-one tuition sessions from anywhere.",
  keywords: ["online tuition", "online tutoring", "live tuition online", "online tutor india"],
};

// ─── /online-tuition/[subject] ───────────────────────────────────────────────

export interface OnlineSubjectConfig {
  slug: OnlineSubject;
  label: string;
  seo: SEOMeta;
}

export const ONLINE_SUBJECTS: OnlineSubjectConfig[] = [
  {
    slug: "maths",
    label: "Maths Online",
    seo: {
      title: "Maths Online Tuition | Expert Online Maths Tutors",
      description: "Learn maths online with expert tutors. Personalised 1-on-1 sessions for all levels — primary to A-Level.",
      keywords: ["maths online tuition", "online maths tutor", "maths tutor online", "learn maths online"],
    },
  },
  {
    slug: "science",
    label: "Science Online",
    seo: {
      title: "Science Online Tuition | Physics, Chemistry & Biology Tutors",
      description: "Online science tuition for Physics, Chemistry and Biology. Expert tutors, live interactive sessions.",
      keywords: ["science online tuition", "online science tutor", "physics tutor online", "chemistry tutor online"],
    },
  },
  {
    slug: "jee",
    label: "JEE Online Coaching",
    seo: {
      title: "JEE Online Coaching | Best JEE Preparation Online",
      description: "Crack JEE Main & Advanced with expert online coaching. Personalised study plans and live doubt sessions.",
      keywords: ["jee online coaching", "jee preparation online", "jee main online", "jee advanced coaching"],
    },
  },
  {
    slug: "neet",
    label: "NEET Online Coaching",
    seo: {
      title: "NEET Online Coaching | Best NEET Preparation Online",
      description: "Prepare for NEET with top online coaches. Live Biology, Physics and Chemistry classes.",
      keywords: ["neet online coaching", "neet preparation online", "neet tutor online", "neet classes online"],
    },
  },
  {
    slug: "cbse",
    label: "CBSE Online Tutor",
    seo: {
      title: "CBSE Online Tutor | Live CBSE Tuition Classes",
      description: "Best CBSE online tutors for Class 6 to 12. All subjects with experienced CBSE teachers.",
      keywords: ["cbse online tutor", "cbse online tuition", "cbse classes online", "cbse tuition online"],
    },
  },
];

// ─── Country landing pages (unique slugs from nav) ───────────────────────────
// /online-learning-united-kingdom-uk
// /online-learning-canada
// (uae, singapore, australia use /<countrySlug> directly with no landing page in nav)

export interface CountryLandingConfig {
  // The full path segment after the leading slash
  landingSlug: string;
  countrySlug: CountrySlug;
  flag: string;
  label: string;
  seo: SEOMeta;
}

export const COUNTRY_LANDINGS: CountryLandingConfig[] = [
  {
    landingSlug: "online-learning-united-kingdom-uk",
    countrySlug: "uk",
    flag: "🇬🇧",
    label: "United Kingdom",
    seo: {
      title: "Online Tutoring UK | Home & Online Tuition United Kingdom",
      description:
        "Find top tutors across the UK for GCSE, A-Level, home tuition and online sessions. Verified UK tutors available now.",
      keywords: ["uk tutoring", "online tutor uk", "home tutor uk", "gcse tutor uk", "a-level tutor uk"],
    },
  },
  {
    landingSlug: "online-learning-canada",
    countrySlug: "canada",
    flag: "🇨🇦",
    label: "Canada",
    seo: {
      title: "Online Tutoring Canada | Home & Online Tuition",
      description:
        "Connect with expert tutors across Canada. Maths, Science, English and more — home visits and online sessions.",
      keywords: ["canada tutoring", "online tutor canada", "home tutor canada", "toronto tutor"],
    },
  },
];

// ─── /[country]/[type] routes (exact from nav) ───────────────────────────────

export interface CountryTypeRoute {
  country: CountrySlug;
  type: LocationType;
  seo: SEOMeta;
}

export const COUNTRY_TYPE_ROUTES: CountryTypeRoute[] = [
  // UK — /uk/home-tutor, /uk/online-tutor, /uk/gcse-tutor, /uk/a-level-tutor, /uk/tutor-job
  { country: "uk", type: "home-tutor",    seo: { title: "Home Tutor UK | Private Tutors Across the UK",        description: "Hire verified home tutors across the UK. Personalised one-on-one tuition for all subjects and levels.",   keywords: ["home tutor uk", "private tutor uk", "tutor near me uk"] } },
  { country: "uk", type: "online-tutor",  seo: { title: "Online Tutor UK | Live 1-on-1 Online Tuition",         description: "Find expert online tutors in the UK. Book live interactive sessions for GCSE, A-Level and more.",        keywords: ["online tutor uk", "online tuition uk", "virtual tutor uk"] } },
  { country: "uk", type: "gcse-tutor",    seo: { title: "GCSE Tutor UK | Expert GCSE Tuition",                  description: "Top GCSE tutors across the UK for all subjects. Home visits and online sessions available.",            keywords: ["gcse tutor uk", "gcse tuition uk", "gcse help uk"] } },
  { country: "uk", type: "a-level-tutor", seo: { title: "A-Level Tutor UK | Expert A-Level Tuition",            description: "Find A-Level tutors across the UK. Expert guidance for Biology, Chemistry, Maths and more.",            keywords: ["a-level tutor uk", "a-level tuition uk", "a level help uk"] } },
  { country: "uk", type: "tutor-job",     seo: { title: "Tutor Jobs UK | Teaching & Tutoring Vacancies",        description: "Looking for tutoring jobs in the UK? Register and connect with students seeking expert help.",           keywords: ["tutor job uk", "teaching job uk", "tuition job uk"] } },

  // Canada — /canada/home-tutor, /canada/online-tutor, /canada/maths-tutor, /canada/tutor-job
  { country: "canada", type: "home-tutor",   seo: { title: "Home Tutor Canada | Private Tutors Across Canada",  description: "Hire verified home tutors across Canada. Personalised sessions for all subjects.",                       keywords: ["home tutor canada", "private tutor canada", "tutor near me canada"] } },
  { country: "canada", type: "online-tutor", seo: { title: "Online Tutor Canada | Live Online Tuition",          description: "Find expert online tutors in Canada. Live interactive sessions for all grades and subjects.",           keywords: ["online tutor canada", "online tuition canada", "virtual tutor canada"] } },
  { country: "canada", type: "maths-tutor",  seo: { title: "Maths Tutor Canada | Expert Math Tuition",           description: "Top maths tutors across Canada for all levels. Home and online sessions available.",                  keywords: ["maths tutor canada", "math tutor canada", "maths tuition canada"] } },
  { country: "canada", type: "tutor-job",    seo: { title: "Tutor Jobs Canada | Teaching & Tutoring Vacancies",  description: "Looking for tutoring jobs in Canada? Register and connect with students.",                            keywords: ["tutor job canada", "teaching job canada", "tuition job canada"] } },

  // UAE — /uae/home-tutor, /uae/cbse-tutor, /uae/maths-tutor, /uae/tutor-job
  { country: "uae", type: "home-tutor",   seo: { title: "Home Tutor UAE | Private Tutors Dubai & Abu Dhabi",  description: "Hire verified home tutors across UAE. Sessions in Dubai, Abu Dhabi and more.",                         keywords: ["home tutor uae", "private tutor uae", "home tuition uae"] } },
  { country: "uae", type: "cbse-tutor",   seo: { title: "CBSE Tutor UAE | CBSE Tuition Dubai & Abu Dhabi",    description: "Find expert CBSE tutors across UAE. Home visits and online sessions for all CBSE classes.",             keywords: ["cbse tutor uae", "cbse tutor dubai", "cbse tuition uae"] } },
  { country: "uae", type: "maths-tutor",  seo: { title: "Maths Tutor UAE | Expert Maths Tuition Dubai & UAE", description: "Top maths tutors across UAE for all levels. Home and online sessions available.",                     keywords: ["maths tutor uae", "math tutor dubai", "maths tuition uae"] } },
  { country: "uae", type: "tutor-job",    seo: { title: "Tutor Jobs UAE | Tutoring Vacancies Dubai & UAE",    description: "Looking for tutoring jobs in UAE? Register and connect with students.",                              keywords: ["tutor job uae", "teaching job dubai", "tuition job uae"] } },

  // Singapore — /singapore/home-tutor, /singapore/online-tutor, /singapore/maths-tutor, /singapore/primary-tutor, /singapore/tutor-job
  { country: "singapore", type: "home-tutor",    seo: { title: "Home Tutor Singapore | Private Tutors Singapore",      description: "Hire verified home tutors in Singapore. Sessions for primary, secondary and O-Level.",               keywords: ["home tutor singapore", "private tutor singapore", "home tuition singapore"] } },
  { country: "singapore", type: "online-tutor",  seo: { title: "Online Tutor Singapore | Live Online Tuition SG",      description: "Find expert online tutors in Singapore. Live sessions for all grades and subjects.",                 keywords: ["online tutor singapore", "online tuition singapore", "virtual tutor sg"] } },
  { country: "singapore", type: "maths-tutor",   seo: { title: "Maths Tutor Singapore | Expert Maths Tuition SG",     description: "Top maths tutors in Singapore for primary, secondary and O-Level. Home and online.",               keywords: ["maths tutor singapore", "math tutor sg", "maths tuition singapore"] } },
  { country: "singapore", type: "primary-tutor", seo: { title: "Primary Tutor Singapore | Primary School Tuition SG", description: "Find qualified primary school tutors in Singapore. All subjects, all levels covered.",               keywords: ["primary tutor singapore", "primary school tutor sg", "primary tuition singapore"] } },
  { country: "singapore", type: "tutor-job",     seo: { title: "Tutor Jobs Singapore | Teaching Vacancies SG",        description: "Looking for tutoring jobs in Singapore? Register and connect with students.",                      keywords: ["tutor job singapore", "teaching job singapore", "tuition job sg"] } },

  // Australia — /australia/home-tutor, /australia/online-tutor, /australia/maths-tutor, /australia/tutor-job
  { country: "australia", type: "home-tutor",   seo: { title: "Home Tutor Australia | Private Tutors Across Australia", description: "Hire verified home tutors across Australia. Sessions in Sydney, Melbourne and more.",              keywords: ["home tutor australia", "private tutor australia", "home tuition australia"] } },
  { country: "australia", type: "online-tutor", seo: { title: "Online Tutor Australia | Live Online Tuition AU",        description: "Find expert online tutors in Australia. Live sessions for all grades and subjects.",              keywords: ["online tutor australia", "online tuition au", "virtual tutor australia"] } },
  { country: "australia", type: "maths-tutor",  seo: { title: "Maths Tutor Australia | Expert Maths Tuition AU",       description: "Top maths tutors across Australia for all levels. Home and online sessions.",                     keywords: ["maths tutor australia", "math tutor au", "maths tuition australia"] } },
  { country: "australia", type: "tutor-job",    seo: { title: "Tutor Jobs Australia | Teaching Vacancies AU",           description: "Looking for tutoring jobs in Australia? Register and connect with students.",                    keywords: ["tutor job australia", "teaching job australia", "tuition job au"] } },
];

// ─── /[country]/[city]/[type] routes (exact from nav) ────────────────────────
// /canada/toronto/tutor
// /uae/dubai/online-tutor
// /uae/abu-dhabi/tutor
// /australia/sydney/tutor
// /australia/melbourne/tutor

export interface SubLocationTypeRoute {
  country: CountrySlug;
  city: SubLocation;
  type: LocationType;
  seo: SEOMeta;
}

export const SUB_LOCATION_TYPE_ROUTES: SubLocationTypeRoute[] = [
  {
    country: "canada", city: "toronto", type: "tutor",
    seo: {
      title: "Tutor in Toronto | Private & Online Tutors Toronto Canada",
      description: "Find the best tutors in Toronto, Canada. Home visits and online sessions for all subjects and grades.",
      keywords: ["tutor toronto", "home tutor toronto", "online tutor toronto", "private tutor toronto"],
    },
  },
  {
    country: "uae", city: "dubai", type: "online-tutor",
    seo: {
      title: "Online Tutor Dubai | Live Online Tuition in Dubai UAE",
      description: "Find expert online tutors in Dubai. Live, interactive sessions for CBSE, IB and British curriculum.",
      keywords: ["online tutor dubai", "online tuition dubai", "virtual tutor dubai", "live tutor dubai"],
    },
  },
  {
    country: "uae", city: "abu-dhabi", type: "tutor",
    seo: {
      title: "Tutor in Abu Dhabi | Home & Online Tutors Abu Dhabi UAE",
      description: "Find verified tutors in Abu Dhabi for all subjects and curricula. Home and online sessions available.",
      keywords: ["tutor abu dhabi", "home tutor abu dhabi", "online tutor abu dhabi", "private tutor abu dhabi"],
    },
  },
  {
    country: "australia", city: "sydney", type: "tutor",
    seo: {
      title: "Tutor in Sydney | Home & Online Tutors Sydney Australia",
      description: "Find top-rated tutors in Sydney, Australia. Home visits and online sessions for all levels.",
      keywords: ["tutor sydney", "home tutor sydney", "online tutor sydney", "private tutor sydney"],
    },
  },
  {
    country: "australia", city: "melbourne", type: "tutor",
    seo: {
      title: "Tutor in Melbourne | Home & Online Tutors Melbourne Australia",
      description: "Find expert tutors in Melbourne, Australia. Personalised home and online tuition for all subjects.",
      keywords: ["tutor melbourne", "home tutor melbourne", "online tutor melbourne", "private tutor melbourne"],
    },
  },
];

// ─── generateStaticParams helpers ─────────────────────────────────────────────

/** For: app/online-tuition/[subject]/page.tsx */
export function getOnlineSubjectParams() {
  return ONLINE_SUBJECTS.map((s) => ({ subject: s.slug }));
}

/** For: app/[landing]/page.tsx  (UK + Canada landing pages) */
export function getCountryLandingParams() {
  return COUNTRY_LANDINGS.map((c) => ({ landing: c.landingSlug }));
}

/** For: app/[country]/[type]/page.tsx */
export function getCountryTypeParams() {
  return COUNTRY_TYPE_ROUTES.map((r) => ({ country: r.country, type: r.type }));
}

/** For: app/[country]/[city]/[type]/page.tsx */
export function getSubLocationTypeParams() {
  return SUB_LOCATION_TYPE_ROUTES.map((r) => ({
    country: r.country,
    city: r.city,
    type: r.type,
  }));
}
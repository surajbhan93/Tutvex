# TUTVEX - EXACT CODE FIXES FOR CANONICAL ISSUES

**Implementation Priority:** CRITICAL  
**Estimated Time:** 12-17 hours  
**Impact:** Fixes 4,690 GSC errors (3,220 redirects + 1,470 canonical issues)

---

## IMPLEMENTATION ORDER

**DO IN THIS EXACT ORDER:**

1. ✅ Update city config files (Lucknow example first)
2. ✅ Update intents config
3. ✅ Update `/india/[city]/[location]/[intent].tsx` route
4. ✅ Update `/[city]/[location]/[intent].tsx` route  
5. ✅ Update `/allahabad/[location]/[intent].tsx` route
6. ✅ Test locally
7. ✅ Update remaining city configs
8. ✅ Update sitemap generation
9. ✅ Deploy

---

## STEP 1: UPDATE LUCKNOW CONFIG (EXAMPLE)

### File: `src/components/seoIndia/locations/up/lucknow.ts`

**CURRENT CODE:**
```typescript
export const city = {
  name: "Lucknow",
  state: "Uttar Pradesh",
  slug: "Lucknow",  // ❌ Title case
  aliases: ["Lucknow", "Lucknow"],
  locations: [
    // ❌ Plain strings
    "Hazratganj",
    "Aminabad",
    "Gomti Nagar",
    "Gomti Nagar Extension",
    // ... rest
  ]
}
```

**NEW CODE:**
```typescript
export const city = {
  name: "Lucknow",
  state: "Uttar Pradesh",
  slug: "lucknow",  // ✅ lowercase
  aliases: ["lucknow"],
  
  locations: [
    // ✅ Object with both name and slug
    { name: "Hazratganj", slug: "hazratganj" },
    { name: "Aminabad", slug: "aminabad" },
    { name: "Charbagh", slug: "charbagh" },
    { name: "Alambagh", slug: "alambagh" },
    { name: "Nishatganj", slug: "nishatganj" },
    { name: "Qaiserbagh", slug: "qaiserbagh" },
    { name: "Kaiserbagh", slug: "kaiserbagh" },
    { name: "Hussainganj", slug: "hussainganj" },
    { name: "Mahanagar", slug: "mahanagar" },
    { name: "Daliganj", slug: "daliganj" },
    { name: "Hasanganj", slug: "hasanganj" },

    // Gomti Nagar Side
    { name: "Gomti Nagar", slug: "gomti-nagar" },
    { name: "Gomti Nagar Extension", slug: "gomti-nagar-extension" },
    { name: "Vibhuti Khand", slug: "vibhuti-khand" },
    { name: "Vijayant Khand", slug: "vijayant-khand" },
    { name: "Vikas Khand", slug: "vikas-khand" },
    { name: "Patrakarpuram", slug: "patrakarpuram" },
    { name: "Viraj Khand", slug: "viraj-khand" },
    { name: "Malhaur", slug: "malhaur" },
    { name: "Kathauta Chauraha", slug: "kathauta-chauraha" },

    // Indira Nagar Side
    { name: "Indira Nagar", slug: "indira-nagar" },
    { name: "Munshi Pulia", slug: "munshi-pulia" },
    { name: "Bhootnath", slug: "bhootnath" },
    { name: "Takrohi", slug: "takrohi" },
    { name: "Alambagh Extension", slug: "alambagh-extension" },

    // Aliganj / Jankipuram
    { name: "Aliganj", slug: "aliganj" },
    { name: "Jankipuram", slug: "jankipuram" },
    { name: "Jankipuram Extension", slug: "jankipuram-extension" },
    { name: "Vikas Nagar", slug: "vikas-nagar" },
    { name: "Tedhi Pulia", slug: "tedhi-pulia" },
    { name: "Sector A Aliganj", slug: "sector-a-aliganj" },
    { name: "Sector B Aliganj", slug: "sector-b-aliganj" },

    // Residential Colonies
    { name: "Rajajipuram", slug: "rajajipuram" },
    { name: "Aishbagh", slug: "aishbagh" },
    { name: "Balaganj", slug: "balaganj" },
    { name: "Kakori", slug: "kakori" },
    { name: "Dubagga", slug: "dubagga" },
    { name: "Nadarganj", slug: "nadarganj" },
    { name: "Ashiyana", slug: "ashiyana" },
    { name: "LDA Colony", slug: "lda-colony" },
    { name: "Krishna Nagar", slug: "krishna-nagar" },
    { name: "Ruchi Khand", slug: "ruchi-khand" },
    { name: "Bangla Bazar", slug: "bangla-bazar" },
    { name: "Para", slug: "para" },

    // High Rise / Apartment Zones
    { name: "Omaxe City", slug: "omaxe-city" },
    { name: "Omaxe Residency", slug: "omaxe-residency" },
    { name: "Shalimar Garden", slug: "shalimar-garden" },
    { name: "Shalimar Gallant", slug: "shalimar-gallant" },
    { name: "Eldeco Greens", slug: "eldeco-greens" },
    { name: "Eldeco Udyan", slug: "eldeco-udyan" },
    { name: "Eldeco II", slug: "eldeco-ii" },
    { name: "Sushant Golf City", slug: "sushant-golf-city" },
    { name: "Rishita Manhattan", slug: "rishita-manhattan" },
    { name: "Rishita Mulberry Heights", slug: "rishita-mulberry-heights" },
    { name: "Rohtas Plumeria", slug: "rohtas-plumeria" },
    { name: "Ansal API Township", slug: "ansal-api-township" },

    // Educational Hubs
    { name: "University of Lucknow", slug: "university-of-lucknow" },
    { name: "IIM Road", slug: "iim-road" },
    { name: "IIT Lucknow", slug: "iit-lucknow" },
    { name: "Integral University", slug: "integral-university" },
    { name: "BBAU", slug: "bbau" },
    { name: "Babasaheb Bhimrao Ambedkar University", slug: "babasaheb-bhimrao-ambedkar-university" },

    // Transport / Connectivity
    { name: "Charbagh Railway Station", slug: "charbagh-railway-station" },
    { name: "Amausi Airport", slug: "amausi-airport" },
    { name: "Chaudhary Charan Singh Airport", slug: "chaudhary-charan-singh-airport" },

    // Emerging / Peripheral
    { name: "Sultanpur Road", slug: "sultanpur-road" },
    { name: "Kanpur Road", slug: "kanpur-road" },
    { name: "Faizabad Road", slug: "faizabad-road" },
    { name: "Raebareli Road", slug: "raebareli-road" },
    { name: "Sitapur Road", slug: "sitapur-road" },
    { name: "Hardoi Road", slug: "hardoi-road" },
    { name: "Deva Road", slug: "deva-road" },
    { name: "Chinhat", slug: "chinhat" },
    { name: "Gosainganj", slug: "gosainganj" },
    { name: "Matiyari", slug: "matiyari" },
    { name: "Cantt Area", slug: "cantt-area" },
    { name: "Ekana Stadium Area", slug: "ekana-stadium-area" },
    { name: "Gomti Nagar IT Park", slug: "gomti-nagar-it-park" },
    { name: "Vibhuti Khand IT Area", slug: "vibhuti-khand-it-area" }
  ]
};
```

**How to convert quickly:**
```typescript
// Use this helper if you want:
import { slugify } from "@/utils/slugify";

// Then:
locations: [
  "Gomti Nagar",
  "Civil Lines"
].map(name => ({ name, slug: slugify(name) }))

// Or manually ensure each location has correct slug
```

---

## STEP 2: UPDATE INTENTS CONFIG

### File: `src/components/seoIndia/intents.ts`

**CURRENT CODE:**
```typescript
export const INTENTS = {
  tutorSearch: [
    "home tutor",
    "home tuition",
    "private tutor",
    // ... more strings
  ],
  // ... more categories
};
```

**NEW CODE:**
```typescript
export const INTENTS = {
  tutorSearch: [
    { name: "Home Tutor", slug: "home-tutor" },
    { name: "Home Tuition", slug: "home-tuition" },
    { name: "Private Tutor", slug: "private-tutor" },
    { name: "Tutor Near Me", slug: "tutor-near-me" },
    { name: "Home Teacher", slug: "home-teacher" },
    { name: "Private Tuition", slug: "private-tuition" },
    { name: "Best Tutor", slug: "best-tutor" },
    { name: "Top Tutor", slug: "top-tutor" },
    { name: "Verified Tutor", slug: "verified-tutor" },
    { name: "Trusted Tutor", slug: "trusted-tutor" },
    { name: "Experienced Tutor", slug: "experienced-tutor" },
    { name: "Local Tutor", slug: "local-tutor" },
    { name: "Personal Tutor", slug: "personal-tutor" },
    { name: "Individual Tutor", slug: "individual-tutor" },
    { name: "One on One Tutor", slug: "one-on-one-tutor" },
    { name: "One to One Tuition", slug: "one-to-one-tuition" },
    { name: "1 to 1 Tuition", slug: "1-to-1-tuition" }
  ],
  
  tutorJobs: [
    { name: "Tutor Job", slug: "tutor-job" },
    { name: "Teaching Job", slug: "teaching-job" },
    { name: "Become Tutor", slug: "become-tutor" },
    { name: "Become Home Tutor", slug: "become-home-tutor" },
    { name: "Home Tutor Job", slug: "home-tutor-job" },
    { name: "Private Tutor Job", slug: "private-tutor-job" },
    { name: "Offline Tutor Job", slug: "offline-tutor-job" },
    { name: "Online Tutor Job", slug: "online-tutor-job" },
    { name: "Part Time Tutor", slug: "part-time-tutor" },
    { name: "Part Time Teaching Job", slug: "part-time-teaching-job" },
    { name: "Tuition Teacher Job", slug: "tuition-teacher-job" },
    { name: "Home Tuition Vacancy", slug: "home-tuition-vacancy" },
    { name: "Private Tutor Vacancy", slug: "private-tutor-vacancy" },
    { name: "Teacher Requirement", slug: "teacher-requirement" },
    { name: "Tutor Requirement", slug: "tutor-requirement" },
    { name: "Earn by Teaching", slug: "earn-by-teaching" },
    { name: "Teaching for Students", slug: "teaching-for-students" }
  ],
  
  subjectTutors: [
    { name: "Maths Tutor", slug: "maths-tutor" },
    { name: "Math Tutor", slug: "math-tutor" },
    { name: "Science Tutor", slug: "science-tutor" },
    { name: "Physics Tutor", slug: "physics-tutor" },
    { name: "Chemistry Tutor", slug: "chemistry-tutor" },
    { name: "Biology Tutor", slug: "biology-tutor" },
    { name: "English Tutor", slug: "english-tutor" }
  ],
  
  classTutors: [
    { name: "Class 6 Tutor", slug: "class-6-tutor" },
    { name: "Class 7 Tutor", slug: "class-7-tutor" },
    { name: "Class 8 Tutor", slug: "class-8-tutor" },
    { name: "Class 9 Tutor", slug: "class-9-tutor" },
    { name: "Class 10 Tutor", slug: "class-10-tutor" },
    { name: "Class 11 Tutor", slug: "class-11-tutor" },
    { name: "Class 12 Tutor", slug: "class-12-tutor" }
  ],
  
  boardTutors: [
    { name: "CBSE Tutor", slug: "cbse-tutor" },
    { name: "ICSE Tutor", slug: "icse-tutor" },
    { name: "Board Exam Tutor", slug: "board-exam-tutor" }
  ],
  
  examTutors: [
    { name: "JEE Tutor", slug: "jee-tutor" },
    { name: "NEET Tutor", slug: "neet-tutor" },
    { name: "Competitive Exam Tutor", slug: "competitive-exam-tutor" },
    { name: "Exam Preparation Tutor", slug: "exam-preparation-tutor" }
  ],
  
  tuitionServices: [
    { name: "Tuition Classes", slug: "tuition-classes" },
    { name: "Tuition Teacher", slug: "tuition-teacher" },
    { name: "Local Tuition Center", slug: "local-tuition-center" },
    { name: "Coaching Near Me", slug: "coaching-near-me" },
    { name: "Best Tuition", slug: "best-tuition" },
    { name: "Top Tuition", slug: "top-tuition" },
    { name: "Academic Help", slug: "academic-help" },
    { name: "Study Help", slug: "study-help" },
    { name: "Verified Tutors", slug: "verified-tutors" }
  ]
};
```

**TypeScript Type (add this):**
```typescript
export interface IntentItem {
  name: string;
  slug: string;
}

export const INTENTS: Record<string, IntentItem[]> = {
  // ... as above
};
```

---

## STEP 3: UPDATE `/india/[city]/[location]/[intent].tsx`

### File: `src/pages/india/[city]/[location]/[intent].tsx`

**SECTION 1: Update Validation Helper**

**CURRENT:**
```typescript
function isValidIndiaCombination(city: string, location: string, intent: string): boolean {
  const cityData = CITY_MAP[city];
  if (!cityData) return false;

  const validLocations = cityData.locations.map((l: any) => l.slug.toLowerCase());
  if (!validLocations.includes(location.toLowerCase())) return false;

  const allIntents = Object.values(INTENTS).flat();
  const normalizedIntent = intent.toLowerCase().replace(/-/g, ' ');
  const intentExists = allIntents.some(
    validIntent => validIntent.toLowerCase() === normalizedIntent
  );

  return intentExists;
}
```

**NEW:**
```typescript
function isValidIndiaCombination(city: string, location: string, intent: string): boolean {
  const cityData = CITY_MAP[city];
  if (!cityData) return false;

  // ✅ Check if location slug exists
  const validLocationSlugs = cityData.locations.map((l: any) => 
    typeof l === 'string' ? l.toLowerCase().replace(/\s+/g, '-') : l.slug
  );
  if (!validLocationSlugs.includes(location)) return false;

  // ✅ Check if intent slug exists
  const allIntents = Object.values(INTENTS).flat();
  const intentExists = allIntents.some((validIntent: any) =>
    (typeof validIntent === 'string' 
      ? validIntent.toLowerCase().replace(/\s+/g, '-')
      : validIntent.slug) === intent
  );

  return intentExists;
}
```

**SECTION 2: Update Component Props Interface**

**CURRENT:**
```typescript
interface PageProps {
  city: string;
  location: string;
  intent: string;
  notFound?: boolean;
}
```

**NEW:**
```typescript
interface PageProps {
  citySlug: string;
  cityName: string;
  locationSlug: string;
  locationName: string;
  intentSlug: string;
  intentName: string;
  notFound?: boolean;
}
```

**SECTION 3: Update Component Declaration**

**CURRENT:**
```typescript
export default function IndiaCityAutoPage({
  city,
  location,
  intent,
  notFound,
}: PageProps) {
  const cityData = CITY_MAP[city];

  if (notFound || !cityData) {
    return null;
  }

  const intentLower = intent.toLowerCase();
  const formattedIntent = intent.charAt(0).toUpperCase() + intent.slice(1);
  // ...
}
```

**NEW:**
```typescript
export default function IndiaCityAutoPage({
  citySlug,
  cityName,
  locationSlug,
  locationName,
  intentSlug,
  intentName,
  notFound,
}: PageProps) {
  const cityData = CITY_MAP[citySlug];

  if (notFound || !cityData) {
    return null;
  }

  // ✅ Use names for display, slugs for URLs
  const intentLower = intentSlug.toLowerCase();
  const formattedIntent = intentName;  // Already formatted from config
  // ...
}
```

**SECTION 4: Update Canonical Tag**

**CURRENT:**
```typescript
<Head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link
    rel="canonical"
    href={`https://tutvex.com/india/${city}/${location}/${intent}`}
  />
  <meta property="og:url" content={`https://tutvex.com/india/${city}/${location}/${intent}`} />
</Head>
```

**NEW:**
```typescript
<Head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link
    rel="canonical"
    href={`https://tutvex.com/india/${citySlug}/${locationSlug}/${intentSlug}`}
  />
  <meta property="og:url" content={`https://tutvex.com/india/${citySlug}/${locationSlug}/${intentSlug}`} />
</Head>
```

**SECTION 5: Update Display Content**

**CURRENT:**
```typescript
const title = `${formattedIntent} in ${location}, ${cityData.name} | Verified Tutors`;
const description = `Find ${formattedIntent} in ${location}, ${cityData.name}. Hire verified tutors for home and online tuition.`;
```

**NEW:**
```typescript
const title = `${intentName} in ${locationName}, ${cityName} | Verified Tutors`;
const description = `Find ${intentName} in ${locationName}, ${cityName}. Hire verified tutors for home and online tuition.`;
```

**SECTION 6: Update getStaticPaths**

**CURRENT:**
```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  Object.values(CITY_MAP).forEach((city: any) => {
    city.locations.forEach((location: any) => {
      const slug =
        typeof location === "string"
          ? location.toLowerCase().replace(/\s+/g, "-")
          : location.slug;

      const allIntents = Object.values(INTENTS).flat();
      
      allIntents.forEach((intent: string) => {
        paths.push({
          params: {
            city: city.slug,
            location: slug,
            intent: intent.toLowerCase().replace(/\s+/g, "-"),
          },
        });
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
};
```

**NEW:**
```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  Object.values(CITY_MAP).forEach((city: any) => {
    city.locations.forEach((location: any) => {
      // ✅ Get slug from config (backward compatible with strings)
      const locationSlug = typeof location === "string"
        ? location.toLowerCase().replace(/\s+/g, "-")
        : location.slug;

      // ✅ Get all intent slugs
      const allIntents = Object.values(INTENTS).flat();
      
      allIntents.forEach((intent: any) => {
        const intentSlug = typeof intent === "string"
          ? intent.toLowerCase().replace(/\s+/g, "-")
          : intent.slug;

        paths.push({
          params: {
            city: city.slug,        // ✅ lowercase from config
            location: locationSlug,  // ✅ hyphenated slug
            intent: intentSlug,      // ✅ hyphenated slug
          },
        });
      });
    });
  });

  console.log(`✅ Generated ${paths.length} static paths for /india/[city]/[location]/[intent]`);

  return {
    paths,
    fallback: false,
  };
};
```

**SECTION 7: Update getStaticProps**

**CURRENT:**
```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city?.toString().toLowerCase() || '';
  const location = params?.location?.toString().toLowerCase() || '';
  const intent = params?.intent?.toString().toLowerCase() || '';

  if (!isValidIndiaCombination(city, location, intent)) {
    return {
      notFound: true,
    };
  }

  const locationFormatted = location.replace(/-/g, ' ');
  const intentFormatted = intent.replace(/-/g, ' ');

  return {
    props: {
      city,
      location: locationFormatted,
      intent: intentFormatted,
    },
    revalidate: 86400,
  };
};
```

**NEW:**
```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const citySlug = params?.city?.toString() || '';
  const locationSlug = params?.location?.toString() || '';
  const intentSlug = params?.intent?.toString() || '';

  // ✅ Validate combination
  if (!isValidIndiaCombination(citySlug, locationSlug, intentSlug)) {
    return {
      notFound: true,
    };
  }

  // ✅ Get city data
  const cityData = CITY_MAP[citySlug];
  if (!cityData) {
    return { notFound: true };
  }

  // ✅ Find location name from slug
  const locationData = cityData.locations.find((loc: any) =>
    (typeof loc === 'string' 
      ? loc.toLowerCase().replace(/\s+/g, '-')
      : loc.slug) === locationSlug
  );
  const locationName = typeof locationData === 'string' 
    ? locationData 
    : locationData?.name || locationSlug;

  // ✅ Find intent name from slug
  const allIntents = Object.values(INTENTS).flat();
  const intentData = allIntents.find((intent: any) =>
    (typeof intent === 'string'
      ? intent.toLowerCase().replace(/\s+/g, '-')
      : intent.slug) === intentSlug
  );
  const intentName = typeof intentData === 'string'
    ? intentData
    : intentData?.name || intentSlug;

  return {
    props: {
      citySlug,
      cityName: cityData.name,
      locationSlug,
      locationName,
      intentSlug,
      intentName,
    },
    revalidate: 86400,
  };
};
```

---

## STEP 4: UPDATE `/[city]/[location]/[intent].tsx`

### File: `src/pages/[city]/[location]/[intent].tsx`

Apply the SAME pattern as Step 3 but for the Kanpur/Lucknow specific route.

**Key changes:**
1. Update props interface to include slug and name pairs
2. Update canonical to use slugs
3. Update display to use names
4. Update getStaticPaths to use `.slug` from config
5. Update getStaticProps to pass both slug and name

**Import the config:**
```typescript
import { KANPUR_LOCATIONS, LUCKNOW_LOCATIONS, INTENTS } from "@/components/seo/seo.config";
```

**Update CITY_CONFIG:**
```typescript
const CITY_CONFIG: Record<string, { name: string; slug: string; locations: any[] }> = {
  lucknow: {
    name: "Lucknow",
    slug: "lucknow",  // ✅ Add explicit slug
    locations: LUCKNOW_LOCATIONS,
  },
  kanpur: {
    name: "Kanpur",
    slug: "kanpur",   // ✅ Add explicit slug
    locations: KANPUR_LOCATIONS,
  },
};
```

**Update canonical:**
```typescript
<link
  rel="canonical"
  href={`https://tutvex.com/${citySlug}/${locationSlug}/${intentSlug}`}
/>
```

---

## STEP 5: UPDATE SEO CONFIG FILES

### File: `src/components/seo/seo.config.ts`

**CURRENT:**
```typescript
export const LUCKNOW_LOCATIONS = [
  "Gomti Nagar",
  "Hazratganj",
  // ... strings
];

export const KANPUR_LOCATIONS = [
  "Civil Lines",
  "Kalyanpur",
  // ... strings
];

export const INTENTS = {
  tutorSearch: ["home tutor", "home tuition", ...],
  // ...
};
```

**NEW:**
```typescript
export const LUCKNOW_LOCATIONS = [
  { name: "Gomti Nagar", slug: "gomti-nagar" },
  { name: "Hazratganj", slug: "hazratganj" },
  { name: "Alambagh", slug: "alambagh" },
  { name: "Indira Nagar", slug: "indira-nagar" },
  { name: "Aliganj", slug: "aliganj" },
  { name: "Vikas Nagar", slug: "vikas-nagar" },
  { name: "Munshi Pulia", slug: "munshi-pulia" },
  { name: "Jankipuram", slug: "jankipuram" },
  { name: "Rajajipuram", slug: "rajajipuram" },
  { name: "LDA Colony", slug: "lda-colony" },
  { name: "Sushant Golf City", slug: "sushant-golf-city" },
  { name: "Eldeco Udyan", slug: "eldeco-udyan" },
  { name: "Vibhuti Khand", slug: "vibhuti-khand" },
  { name: "Charbagh Railway Station", slug: "charbagh-railway-station" },
  { name: "Amausi Airport", slug: "amausi-airport" },
  { name: "University of Lucknow", slug: "university-of-lucknow" },
  { name: "IIT Lucknow", slug: "iit-lucknow" },
  { name: "Babasaheb Bhimrao Ambedkar University", slug: "babasaheb-bhimrao-ambedkar-university" }
];

export const KANPUR_LOCATIONS = [
  { name: "Civil Lines", slug: "civil-lines" },
  { name: "Arya Nagar", slug: "arya-nagar" },
  { name: "Swaroop Nagar", slug: "swaroop-nagar" },
  { name: "Vijay Nagar", slug: "vijay-nagar" },
  { name: "Kidwai Nagar", slug: "kidwai-nagar" },
  { name: "Kalyanpur", slug: "kalyanpur" },
  { name: "Govind Nagar", slug: "govind-nagar" },
  { name: "Mall Road", slug: "mall-road" },
  { name: "Kakadeo", slug: "kakadeo" },
  { name: "IIT Kanpur", slug: "iit-kanpur" },
  { name: "Kanpur Central Station", slug: "kanpur-central-station" }
];

export const INTENTS = {
  tutorSearch: [
    { name: "Home Tutor", slug: "home-tutor" },
    { name: "Home Tuition", slug: "home-tuition" },
    { name: "Private Tutor", slug: "private-tutor" },
    // ... rest as in Step 2
  ],
  // ... rest of categories
};
```

---

## STEP 6: UPDATE SITEMAP GENERATION

### File: `scripts/generate-sitemap.js`

**Add at top:**
```javascript
// ✅ Import slugify
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ✅ Validate URL format
function isValidSeoUrl(url) {
  // Must be lowercase, hyphenated, no spaces, no [brackets]
  const urlPath = url.replace('https://tutvex.com', '');
  
  // Check for invalid patterns
  if (urlPath.includes('[') || urlPath.includes(']')) return false;
  if (urlPath.includes(' ')) return false;
  if (urlPath !== urlPath.toLowerCase()) return false;
  if (urlPath.endsWith('/') && urlPath.length > 1) return false;
  
  return true;
}
```

**Update URL generation section:**
```javascript
Object.values(CITY_MAP).forEach((city) => {
  city.locations.forEach((location) => {
    // ✅ Get slug properly
    const locationSlug = typeof location === 'string'
      ? slugify(location)
      : location.slug;

    const allIntents = Object.values(INTENTS).flat();
    
    allIntents.forEach((intent) => {
      // ✅ Get intent slug
      const intentSlug = typeof intent === 'string'
        ? slugify(intent)
        : intent.slug;

      // ✅ Build URL with slugs
      const url = `${BASE_URL}/india/${city.slug}/${locationSlug}/${intentSlug}`;

      // ✅ Validate before adding
      if (isValidSeoUrl(url)) {
        urls.push({
          url,
          changefreq: 'monthly',
          priority: 0.7,
        });
      } else {
        console.warn(`⚠️ Invalid URL skipped: ${url}`);
      }
    });
  });
});

console.log(`✅ Generated ${urls.length} valid SEO URLs`);
console.log(`✅ All URLs validated: lowercase, hyphenated, no spaces`);
```

---

## STEP 7: TESTING LOCALLY

### Before Build:

```powershell
# 1. Check config files
node -e "const c = require('./src/components/seoIndia/locations/up/lucknow.ts'); console.log(c.city.slug);"
# Should output: lucknow (lowercase)

# 2. Check location format
node -e "const c = require('./src/components/seoIndia/locations/up/lucknow.ts'); console.log(c.city.locations[0]);"
# Should output: { name: '...', slug: '...' }
```

### Build & Test:

```powershell
# 1. Clean build
Remove-Item -Recurse -Force .next
npm run build

# Expected output:
# ○ /india/[city]/[location]/[intent] (5000+ paths)
# All paths should be lowercase-hyphenated

# 2. Generate sitemap
npm run generate-sitemap

# 3. Check sitemap
Get-Content public/sitemap.xml | Select-String -Pattern "\[city\]|\[location\]|%20| [A-Z]"
# Should return NO results

# 4. Start local server
npm run start

# 5. Test sample URLs
curl -I http://localhost:3000/india/lucknow/gomti-nagar/home-tutor
# Should return 200

curl -s http://localhost:3000/india/lucknow/gomti-nagar/home-tutor | Select-String -Pattern 'rel="canonical"'
# Should show: href="https://tutvex.com/india/lucknow/gomti-nagar/home-tutor"

# 6. Test invalid URL
curl -I http://localhost:3000/india/lucknow/invalid-place/home-tutor
# Should return 404

# 7. Test case redirect (via middleware)
curl -IL http://localhost:3000/india/Lucknow/gomti-nagar/home-tutor
# Should show:
# HTTP/1.1 301 Moved Permanently
# Location: /india/lucknow/gomti-nagar/home-tutor
# HTTP/1.1 200 OK
```

---

## STEP 8: DEPLOYMENT CHECKLIST

### Pre-Deployment:

- [ ] All city config files updated with slug format
- [ ] All intents configs updated with slug format
- [ ] All route files updated to use slug/name pairs
- [ ] Sitemap generation updated
- [ ] Local build successful (0 errors)
- [ ] Sitemap contains ONLY valid URLs
- [ ] Test 20 sample URLs locally - all canonical = URL
- [ ] Git commit with clear message

### Deploy:

```bash
git add .
git commit -m "Fix: Canonical URLs - use pre-defined slugs from config

- Updated all city configs: slug format with name/slug objects
- Updated intents configs: object format with name/slug
- Updated route files: use slugs for URLs, names for display
- Updated canonical tags: use slugs consistently
- Updated sitemap generation: validate all URLs
- Fixes 1,470 alternate canonical issues
- Fixes 3,220 redirect issues"

git push origin main
```

### Post-Deployment Validation:

```powershell
# Test production URLs
$testUrls = @(
  "https://tutvex.com/india/lucknow/gomti-nagar/home-tutor",
  "https://tutvex.com/india/meerut/modipuram/chemistry-tutor",
  "https://tutvex.com/kanpur/civil-lines/home-tuition",
  "https://tutvex.com/india/noida/sector-63/private-tutor"
)

foreach ($url in $testUrls) {
  Write-Host "Testing: $url"
  
  # Check status
  $response = curl -I $url 2>&1
  if ($response -match "HTTP/\d\.\d 200") {
    Write-Host "✅ Returns 200" -ForegroundColor Green
  } else {
    Write-Host "❌ Does not return 200" -ForegroundColor Red
  }
  
  # Check canonical
  $page = curl -s $url
  if ($page -match "rel=`"canonical`" href=`"$url`"") {
    Write-Host "✅ Canonical matches URL" -ForegroundColor Green
  } else {
    Write-Host "❌ Canonical mismatch" -ForegroundColor Red
  }
  
  Write-Host ""
}
```

### Google Search Console:

1. Wait 24 hours after deployment
2. Go to Google Search Console
3. Navigate to "Pages" → "Why pages aren't indexed"
4. Click on "Alternate page with proper canonical tag"
5. Click "Validate Fix"
6. Monitor validation progress over next 7-14 days

---

## EXPECTED RESULTS

### Immediate (After Deployment):

- ✅ All new URLs have matching canonical tags
- ✅ URL in browser = canonical in HTML
- ✅ No more 301 redirects for valid URLs
- ✅ Sitemap contains only valid lowercase-hyphenated URLs

### After Google Recrawl (1-2 weeks):

- ✅ "Alternate page with proper canonical tag": 1,470 → ~100 (old URLs still in index)
- ✅ "Page with redirect": 3,220 → ~50 (only external old links)
- ✅ New pages indexed with correct URLs

### After Full Reindex (4-6 weeks):

- ✅ "Alternate page with proper canonical tag": ~100 → 0
- ✅ "Page with redirect": ~50 → ~20 (permanent external links)
- ✅ All issues resolved

---

## ROLLBACK PLAN (if needed)

If deployment causes issues:

```bash
# 1. Revert commit
git revert HEAD
git push origin main

# 2. Or rollback to previous commit
git reset --hard HEAD~1
git push origin main --force

# 3. Redeploy previous working version
```

---

## TROUBLESHOOTING

### Issue: Build fails with TypeScript errors

**Solution:** Update TypeScript interfaces to match new prop structure.

### Issue: Some URLs still show old format

**Solution:** Clear Next.js cache and rebuild:
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

### Issue: Canonical still doesn't match URL

**Solution:** Check that you're using `slug` not `name` in canonical tag.

### Issue: 404 on valid URLs after deployment

**Solution:** Verify getStaticPaths is generating all combinations. Check build output for path count.

---

**END OF EXACT CODE FIXES**

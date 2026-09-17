/**
 * Generate SEO metadata for tutor profile pages
 * Optimized for local search queries and parent/student intent
 */

export interface TutorSEOInput {
  name: string;
  subject?: string | string[];
  city?: string;
  area?: string;
  state?: string;
  experience?: number;
  qualification?: string;
  classesTaught?: string[];
  teachingMode?: string;
  rating?: number;
  profileImage?: string;
  slug?: string;
}

export interface TutorSEOOutput {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

const BASE_URL = "https://www.tutvex.com";

/**
 * Generate SEO-optimized title
 * Format: "Best [Subject] Tutor in [City] | [Name] | Tutvex"
 */
function generateTitle(input: TutorSEOInput): string {
  const { name, subject, city } = input;
  
  // Handle multiple subjects
  const subjectText = Array.isArray(subject) 
    ? subject[0] // Use primary subject
    : subject || "Academic";
  
  const cityText = city || "Your Area";
  
  return `Best ${subjectText} Tutor in ${cityText} | ${name} | Tutvex`;
}

/**
 * Generate SEO-optimized meta description
 * Includes key value propositions and call-to-action
 */
function generateDescription(input: TutorSEOInput): string {
  const { name, subject, city, experience, qualification, teachingMode } = input;
  
  const subjectText = Array.isArray(subject)
    ? subject.slice(0, 2).join(" & ")
    : subject || "all subjects";
  
  const cityText = city || "your area";
  const expText = experience ? `${experience}+ years of teaching experience` : "extensive teaching experience";
  const qualText = qualification ? `, ${qualification}` : "";
  const modeText = teachingMode ? ` | ${teachingMode} available` : "";
  
  return `Looking for the best ${subjectText} tutor in ${cityText}? Learn with ${name}, an experienced tutor with ${expText}${qualText}. Book a free demo class today${modeText}.`;
}

/**
 * Generate SEO Slug for Tutor Profile
 * Format: name-class-city-area (e.g. suraj-bhan-maths-prayagraj-salori)
 */
export function generateTutorSlug(tutor: {
  fullName?: string;
  name?: string;
  classesTaught?: string[] | string;
  subjects?: string[];
  location?: { city?: string; area?: string; state?: string };
  city?: string;
  area?: string;
}): string {
  const rawName = tutor.fullName || tutor.name || "tutor";
  const name =
    rawName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") || "tutor";

  let cls = "";
  if (Array.isArray(tutor.classesTaught) && tutor.classesTaught.length > 0) {
    cls = tutor.classesTaught[0] || "";
  } else if (typeof tutor.classesTaught === "string" && tutor.classesTaught) {
    cls = tutor.classesTaught.split(",")[0] || "";
  } else if (Array.isArray(tutor.subjects) && tutor.subjects.length > 0) {
    cls = tutor.subjects[0] || "";
  }

  const cleanClass = cls
    ? cls
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    : "";

  const rawCity = tutor.location?.city || tutor.city || "";
  const city = rawCity
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const rawArea = tutor.location?.area || tutor.area || "";
  const area = rawArea
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const parts = [name, cleanClass, city, area].filter(Boolean);
  return parts.join("-");
}

/**
 * Generate canonical URL
 */
function generateCanonical(tutorIdOrSlug: string): string {
  return `${BASE_URL}/tutor/${tutorIdOrSlug}`;
}

/**
 * Generate relevant keywords for the tutor profile
 */
function generateKeywords(input: TutorSEOInput): string[] {
  const { subject, city, area, classesTaught, teachingMode } = input;
  
  const keywords: string[] = [];
  
  // Core keywords
  const subjects = Array.isArray(subject) ? subject : [subject].filter(Boolean);
  const cityName = city || "";
  const areaName = area || "";
  
  // Location-based keywords
  if (cityName) {
    subjects.forEach(sub => {
      keywords.push(`${sub} tutor in ${cityName}`);
      keywords.push(`${sub} home tutor ${cityName}`);
      keywords.push(`best ${sub} tutor ${cityName}`);
    });
  }
  
  if (areaName && cityName) {
    keywords.push(`tutor in ${areaName} ${cityName}`);
  }
  
  // Class-based keywords
  if (classesTaught && classesTaught.length > 0) {
    classesTaught.forEach(cls => {
      keywords.push(`${cls} tutor`);
      if (cityName) {
        keywords.push(`${cls} tutor ${cityName}`);
      }
    });
  }
  
  // Teaching mode keywords
  if (teachingMode) {
    const mode = teachingMode.toLowerCase();
    if (mode.includes("home")) {
      keywords.push(`home tuition ${cityName}`, "home tutor");
    }
    if (mode.includes("online")) {
      keywords.push(`online tuition ${cityName}`, "online tutor");
    }
  }
  
  // Generic high-intent keywords
  keywords.push(
    "experienced tutor",
    "qualified tutor",
    "private tutor",
    "tuition teacher"
  );
  
  return keywords.filter(Boolean).slice(0, 20); // Limit to 20 keywords
}

/**
 * Main function to generate all SEO metadata
 */
export function generateTutorSEO(
  input: TutorSEOInput,
  tutorId: string
): TutorSEOOutput {
  const title = generateTitle(input);
  const description = generateDescription(input);
  const canonical = generateCanonical(tutorId);
  const keywords = generateKeywords(input);
  
  // Open Graph uses slightly different formatting
  const ogTitle = title.replace(" | Tutvex", ""); // Cleaner for social sharing
  const ogDescription = description.substring(0, 200); // FB/LinkedIn limit
  
  // Twitter optimized
  const twitterTitle = title.length > 70 ? ogTitle : title;
  const twitterDescription = description.substring(0, 200);
  
  return {
    title,
    description,
    canonical,
    keywords,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
  };
}

/**
 * Generate FAQ schema data for rich snippets
 */
export function generateTutorFAQSchema(input: TutorSEOInput) {
  const { name, subject, city, teachingMode } = input;
  
  const subjects = Array.isArray(subject) ? subject.join(", ") : subject || "various subjects";
  const cityText = city || "the area";
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What subjects does ${name} teach?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${name} teaches ${subjects}.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${name} provide home tuition in ${cityText}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": teachingMode?.toLowerCase().includes("home") 
            ? `Yes, ${name} provides home tuition in ${cityText}.`
            : `Please contact ${name} to discuss available teaching modes in ${cityText}.`
        }
      },
      {
        "@type": "Question",
        "name": "Can I book a free demo class?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, you can book a free demo class with ${name}. Click the "Book Free Demo Class" button to schedule your session.`
        }
      },
      {
        "@type": "Question",
        "name": `What are ${name}'s tuition fees?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Tuition fees vary based on class, subject, and teaching mode. Please book a demo or contact ${name} directly for specific pricing information.`
        }
      }
    ]
  };
}

/**
 * Generate Person schema for the tutor
 */
export function generateTutorPersonSchema(input: TutorSEOInput, tutorId: string) {
  const { name, subject, city, area, state, qualification, profileImage, rating } = input;
  
  const subjects = Array.isArray(subject) ? subject : [subject].filter(Boolean);
  const location = [area, city, state].filter(Boolean).join(", ");
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": `${subjects[0] || "Academic"} Tutor`,
    "description": generateDescription(input),
    "image": profileImage,
    "url": `${BASE_URL}/tutors/${tutorId}`,
    "alumniOf": qualification,
    "knowsAbout": subjects,
    "address": location ? {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": "India"
    } : undefined,
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "offers": {
      "@type": "Offer",
      "description": "Private tutoring services",
      "availability": "https://schema.org/InStock"
    }
  };
}

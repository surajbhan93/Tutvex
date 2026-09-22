import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { CITY_MAP } from "@/components/seoIndia/cities";
import { INTENTS } from "@/components/seoIndia/intents";
import { SUBJECTS } from "@/components/seoIndia/subjects";
import BreadcrumbSchema from "@/components/seoIndia/BreadcrumbSchema";
import FAQSchema from "@/components/seoIndia/FAQSchema";
import LocalBusinessSchema from "@/components/seoIndia/LocalBusinessSchema";
import { INTENT_CONTENT } from "@/components/seoIndia/content/intentContent";
import { LOCATION_SNIPPETS } from "@/components/seoIndia/content/locationSnippets";

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import {
  CheckCircle,
  BookOpen,
  Laptop,
  ShieldCheck,
  Wallet,
  PhoneCall,
} from "lucide-react"
import { motion } from "framer-motion";

interface PageProps {
  citySlug: string;
  cityName: string;
  locationSlug: string;
  locationName: string;
  intentSlug: string;
  intentName: string;
  notFound?: boolean;
}

/* ===============================
   VALIDATION HELPER
================================ */
function isValidIndiaCombination(city: string, location: string, intent: string): boolean {
  const cityData = CITY_MAP[city];
  if (!cityData) return false;

  // Check if location slug exists (support both string and object formats)
  const validLocationSlugs = cityData.locations.map((l: any) => 
    typeof l === 'string' ? l.toLowerCase().replace(/\s+/g, '-') : l.slug
  );
  if (!validLocationSlugs.includes(location)) return false;

  // Check if intent slug exists (support both string and object formats)
  const allIntents = Object.values(INTENTS).flat();
  const intentExists = allIntents.some((validIntent: any) =>
    (typeof validIntent === 'string' 
      ? validIntent.toLowerCase().replace(/\s+/g, '-')
      : validIntent.slug) === intent
  );

  return intentExists;
}

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

  // Server-side validation handled - this won't render
  if (notFound || !cityData) {
    return null;
  }

  const intentLower = intentSlug.toLowerCase();
  const formattedIntent = intentName; // Already formatted from config

  // 🔥 CTA LOGIC (same as Allahabad)
  const isFindTutor =
    intentLower.includes("home-tutor") ||
    intentLower.includes("home-tuition") ||
    intentLower.includes("private-tutor") ||
    intentLower.includes("tutor-near");

  const isBecomeTutor =
    intentLower.includes("become-tutor") ||
    intentLower.includes("tutor-job") ||
    intentLower.includes("teaching-job");

  const primaryCTA = isFindTutor
    ? {
        text: "Find a Tutor",
        href: "/find-tutor-flow/create-account/?source=MOBILE_NAV&campaign=FIND_TUTOR",
      }
    : isBecomeTutor
    ? {
        text: "Become a Tutor",
        href: "/tutor-flow/tutor-registration/?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR",
      }
    : {
        text: "View Tutors",
        href: "/tutors/",
      };

  const title = `${intentName} in ${locationName}, ${cityName} | Verified Tutors`;
  const description = `Find ${intentName} in ${locationName}, ${cityName}. Hire verified tutors for home and online tuition.`;

  return (
    <>
      {/* SEO */}
      {/* //setup */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://tutvex.com/india/${citySlug}/${locationSlug}/${intentSlug}`}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://tutvex.com/india/${citySlug}/${locationSlug}/${intentSlug}`} />
        <meta property="og:type" content="website" />
      </Head>

      <BreadcrumbSchema
        city={citySlug}
        cityName={cityName}
        location={locationName}
        intent={intentName}
      />
    
       <LocalBusinessSchema
          city={citySlug}
          cityName={cityData.name}
          location={locationName}
        />


      {/* NAVBAR */}
      <NavBar />

   <main className="min-h-screen bg-gradient-to-b from-[#f8faff] via-white to-[#f1f5ff] overflow-hidden">

  {/* ================= HERO ================= */}
  <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 text-white">
    {/* Animated gradient blobs */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0"
    >
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-400/30 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[120px]" />
    </motion.div>

    <div className="relative max-w-6xl mx-auto px-6 py-24">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold leading-tight"
      >
        {formattedIntent} in <br />
        <span className="text-yellow-300">
          {location}, {cityData.name}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 text-lg md:text-xl text-indigo-100 max-w-3xl"
      >
        Find verified and experienced tutors in {location}, {cityData.name} for
        CBSE, ICSE, state boards and competitive exams. Learn at home or online
        with flexible timings.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 flex flex-wrap gap-5"
      >
        <Link
          href={primaryCTA.href}
          className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition"
        >
          {primaryCTA.text}
        </Link>
      </motion.div>
    </div>
  </section>

  {/* ================= FLOATING CTA ================= */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
    className="fixed bottom-6 right-6 z-50"
  >
    <Link
      href={primaryCTA.href}
      className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-4 rounded-full shadow-2xl hover:scale-105 hover:shadow-indigo-400/40 transition"
    >
      <PhoneCall />
      Talk to a Tutor
    </Link>
  </motion.div>
</main>
 
  


    <FAQSchema
          cityName={cityData.name}
          location={locationName}
          intent={formattedIntent}
        />
      {/* FOOTER */}
      <Footer />
    </>
  );
}

/* ===============================
   🔥 STATIC GENERATION
================================ */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  Object.values(CITY_MAP).forEach((city: any) => {
    city.locations.forEach((location: any) => {
      const slug =
        typeof location === "string"
          ? location.toLowerCase().replace(/\s+/g, "-")
          : location.slug;

      // Flatten all intents
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

  console.log(`Generated ${paths.length} static paths for /india/[city]/[location]/[intent]`);

  return {
    paths,
    fallback: false, // Changed from "blocking" to false - invalid URLs will get proper 404
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const citySlug = params?.city?.toString() || '';
  const locationSlug = params?.location?.toString() || '';
  const intentSlug = params?.intent?.toString() || '';

  // Validate the combination
  if (!isValidIndiaCombination(citySlug, locationSlug, intentSlug)) {
    return {
      notFound: true, // Returns proper 404 HTTP status
    };
  }

  // Get city data
  const cityData = CITY_MAP[citySlug];
  if (!cityData) {
    return { notFound: true };
  }

  // Find location name from slug
  const locationData = cityData.locations.find((loc: any) =>
    (typeof loc === 'string' 
      ? loc.toLowerCase().replace(/\s+/g, '-')
      : loc.slug) === locationSlug
  );
  const locationName = typeof locationData === 'string' 
    ? locationData 
    : locationData?.name || locationSlug;

  // Find intent name from slug
  const allIntents = Object.values(INTENTS).flat();
  const intentData = allIntents.find((intent: any) =>
    (typeof intent === 'string'
      ? intent.toLowerCase().replace(/\s+/g, '-')
      : intent.slug) === intentSlug
  );
  const intentName = typeof intentData === 'string'
    ? intentData
    : (intentData as any)?.name || intentSlug;

  return {
    props: {
      citySlug,
      cityName: cityData.name,
      locationSlug,
      locationName,
      intentSlug,
      intentName,
    },
    revalidate: 86400, // 24 hours
  };
};

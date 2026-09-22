import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import { INTENT_CONTENT } from "@/components/seoIndia/content/intentContent";
import { LOCATION_SNIPPETS } from "@/components/seoIndia/content/locationSnippets";
import FAQSchema from "@/components/seoIndia/FAQSchema";
import {
  KANPUR_LOCATIONS,
  LUCKNOW_LOCATIONS,
  INTENTS,
  SUBJECTS,
} from "@/components/seo/seo.config";
import LocalSchema from "@/components/seo/LocalSchema";
import { ArrowRight, Loader2 } from "lucide-react";

/* ===============================
   TYPES
================================ */
interface PageProps {
  city: string;
  location: string;
  intent: string;
}

/* ===============================
   CITY CONFIG
================================ */
const CITY_CONFIG: Record<string, { name: string; locations: string[] }> = {
  lucknow: {
    name: "Lucknow",
    locations: LUCKNOW_LOCATIONS,
  },
  kanpur: {
    name: "Kanpur",
    locations: KANPUR_LOCATIONS,
  },
};

/* ===============================
   CITY TUTOR COUNT
================================ */
const CITY_TUTOR_COUNT: Record<string, number> = {
  lucknow: 1200,
  kanpur: 950,
};

/* ===============================
   PAGE
================================ */
export default function CityAutoPage({
  city,
  location,
  intent = "home-tutor",
}: PageProps) {
  const cityData = CITY_CONFIG[city];
  const [redirecting, setRedirecting] = useState(false);

  if (!cityData) return null;

  const safeIntent = intent || "home-tutor";
  const intentText = safeIntent.replace(/-/g, " ");
  const formattedIntent = intentText.replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${formattedIntent} in ${location}, ${cityData.name} | Verified Tutors`;
  const description = `Looking for ${formattedIntent} in ${location}, ${cityData.name}? Hire verified tutors for all subjects and classes.`;

  /* ---------- delayed redirect ---------- */
  const handleDelayedRedirect = (url: string) => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  };

  return (
    <>
      <NavBar />

      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://tutvex.com/${city}/${location}/${intent}`}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://tutvex.com/${city}/${location}/${intent}`} />
        <meta property="og:type" content="website" />
      </Head>

      <LocalSchema />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                {formattedIntent}
              </span>{" "}
              in {location}, {cityData.name}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-indigo-100">
              Find verified and experienced tutors in {location},{" "}
              {cityData.name} for CBSE, ICSE and competitive exams.
            </p>

            {/* Tutor Count Badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
              <span className="font-semibold">
                {CITY_TUTOR_COUNT[city] ?? 500}+ Tutors Available
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/subjects/?source=NAVBAR&campaign=SUBJECTS_NAV&medium=website"
              className="inline-block mt-8"
            >
              <button className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 font-semibold text-gray-900 shadow-lg transition-all hover:scale-105">
                Browse Your Subject
              </button>
            </Link>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          {/* Intent Intro */}
          {INTENT_CONTENT[intentText] && (
            <p className="text-gray-700 text-lg leading-relaxed">
              {INTENT_CONTENT[intentText].intro
                .replace("{location}", location)
                .replace("{city}", cityData.name)}
            </p>
          )}

          {/* Location Snippet */}
          {LOCATION_SNIPPETS[location.toLowerCase()] && (
            <p className="mt-6 text-gray-600">
              {LOCATION_SNIPPETS[location.toLowerCase()]}
            </p>
          )}

          {/* ================= SUBJECTS ================= */}
          <h2 className="mt-14 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Subjects Available
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => handleDelayedRedirect("/tutors/")}
                className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <span className="font-semibold">{sub}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          {/* ================= MID PAGE CTA ================= */}
          <div className="my-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-14 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold">
              Need a Tutor in {location}, {cityData.name}?
            </h2>

            <p className="mt-4 text-indigo-100 text-lg">
              Get matched with verified tutors within minutes.
            </p>

            <button
              onClick={() =>
                handleDelayedRedirect(
                  "/tutors/?source=SEO_PAGE&campaign=FIND_TUTOR"
                )
              }
              className="mt-8 rounded-xl bg-white px-8 py-3 font-semibold text-indigo-700 shadow-lg transition hover:scale-105"
            >
              Find a Tutor Now
            </button>
          </div>

          {/* ================= RELATED SEARCHES ================= */}
          <h2 className="mt-20 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Related Searches in {cityData.name}
          </h2>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {cityData.locations.slice(0, 6).map((area) => (
              <Link
                key={area}
                href={`/${city}/${area
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/${intent}`}
                className="rounded-xl bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {formattedIntent} in {area}, {cityData.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <FAQSchema
        cityName={cityData.name}
        location={location}
        intent={formattedIntent}
      />

      <Footer />

      {/* ================= LOADER ================= */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="font-medium text-gray-800">
              Finding best tutors for you…
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  Object.entries(CITY_CONFIG).forEach(([city, data]) => {
    data.locations.forEach((location) => {
      paths.push({
        params: {
          city,
          location: location.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    });
  });

  console.log(`Generated ${paths.length} static paths for [city]/[location]/st`);
  
  return { paths, fallback: false }; // Changed from "blocking" to false
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city?.toString().toLowerCase() || "";
  const location = params?.location?.toString().toLowerCase() || "";

  // Validate combination
  const cityData = CITY_CONFIG[city];
  if (!cityData) {
    return { notFound: true };
  }

  const normalizedLocation = location.replace(/-/g, ' ');
  const locationExists = cityData.locations.some(
    loc => loc.toLowerCase() === normalizedLocation
  );

  if (!locationExists) {
    return { notFound: true };
  }

  return {
    props: {
      city,
      location: normalizedLocation,
      intent: "home-tutor",
    },
    revalidate: 86400,
  };
};

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
import CountUp from "react-countup";

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
   UX HELPERS
================================ */
const FALLBACK_DEMAND = [
  20, 34, 40, 56, 10, 28, 45, 62,
  30, 25, 23, 56, 9, 10, 32, 42,
];

const AREA_RATINGS: Record<string, number> = {
  "Civil Lines": 4.8,
  Kalyanpur: 4.4,
  Kakadeo: 4.5,
  "Gomti Nagar": 4.9,
  Alambagh: 4.6,
  Hazratganj: 4.8,
};

const getHeatmapClass = (count: number) =>
  count >= 60
    ? "bg-red-50 border-red-200"
    : count >= 40
    ? "bg-orange-50 border-orange-200"
    : "bg-blue-50 border-blue-200";

const getTrend = (count: number) =>
  count >= 50 ? "↑" : count >= 30 ? "→" : "↓";

/* ===============================
   PAGE
================================ */
export default function CityAutoPage({
  city,
  location,
  intent,
}: PageProps) {
  const cityData = CITY_CONFIG[city];
  const [redirecting, setRedirecting] = useState(false);

  if (!cityData) return null;

  const intentText = intent.replace(/-/g, " ");
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
   const demand =
    FALLBACK_DEMAND[
      Math.abs(
        `${city}-${location}`.length % FALLBACK_DEMAND.length
      )
    ] ?? 20;

  const rating = AREA_RATINGS[location] ?? 4.4;

  return (
    <>
      <NavBar />

      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://yourdomain.com/${city}/${location}/${intent}`}
        />
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
       
        <div className="mt-6 flex flex-wrap gap-4">
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
                <CountUp end={CITY_TUTOR_COUNT[city] ?? 500} duration={2} />+ Tutors
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                ⭐ {rating} Rating
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                Demand {getTrend(demand)}
              </span>
            </div>

            
            
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


            {/* ================= LOCAL DEMAND ================= */}
          <div
            className={`mt-16 rounded-2xl border p-6 ${getHeatmapClass(
              demand
            )}`}
          >
            <h3 className="font-bold text-gray-800">
              Tutor Availability in {location}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              <CountUp end={demand} duration={1.5} />+ tutors actively available ·
              Popular choice {getTrend(demand)}
            </p>

            {demand >= 50 && (
              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                High Demand Area
              </span>
            )}
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

/* ===============================
   STATIC GENERATION
================================ */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  Object.entries(CITY_CONFIG).forEach(([city, data]) => {
    data.locations.forEach((location) => {
      Object.values(INTENTS).forEach((intentGroup) => {
        intentGroup.forEach((intent) => {
          paths.push({
            params: {
              city,
              location: location.toLowerCase().replace(/\s+/g, "-"),
              intent: intent.toLowerCase().replace(/\s+/g, "-"),
            },
          });
        });
      });
    });
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      city: params?.city?.toString(),
      location: params?.location?.toString().replace(/-/g, " "),
      intent: params?.intent?.toString(),
    },
    revalidate: 86400,
  };
};

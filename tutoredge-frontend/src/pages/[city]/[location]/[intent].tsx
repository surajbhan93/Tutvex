import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
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

interface PageProps {
  city: string;
  location: string;
  intent: string;
}

/* ===============================
   CITY CONFIG
================================ */
const CITY_CONFIG: Record<
  string,
  { name: string; locations: string[] }
> = {
  lucknow: {
    name: "Lucknow",
    locations: LUCKNOW_LOCATIONS,
  },
  kanpur: {
    name: "Kanpur",
    locations: KANPUR_LOCATIONS,
  },
};

export default function CityAutoPage({
  city,
  location,
  intent,
}: PageProps) {
  const cityData = CITY_CONFIG[city];
  const formattedIntent = intent
  .replace(/-/g, " ")
  .replace(/\b\w/g, (c) => c.toUpperCase());

  if (!cityData) return null;

  const intentText = intent.replace(/-/g, " ");

  const title = `${intentText} in ${location}, ${cityData.name} | Verified Tutors`;
  const description = `Looking for ${intentText} in ${location}, ${cityData.name}? Hire verified tutors for all subjects and classes.`;


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

      <main className="min-h-screen bg-gray-50">
        {/* ================= HERO ================= */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-3xl md:text-4xl font-bold">
              {intentText} in {location}, {cityData.name}
            </h1>

            <p className="mt-4 text-lg text-indigo-100">
              Find verified and experienced tutors in {location},{" "}
              {cityData.name} for CBSE, ICSE and competitive exams.
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          {/* Intent intro */}
          {INTENT_CONTENT[intentText] && (
            <p className="text-gray-700 text-lg">
              {INTENT_CONTENT[intentText].intro
                .replace("{location}", location)
                .replace("{city}", cityData.name)}
            </p>
          )}

          {/* Location snippet */}
          {LOCATION_SNIPPETS[location.toLowerCase()] && (
            <p className="mt-4 text-gray-600">
              {LOCATION_SNIPPETS[location.toLowerCase()]}
            </p>
          )}

          {/* Subjects */}
          <h2 className="mt-10 text-2xl font-semibold">
            Subjects Available
          </h2>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SUBJECTS.map((sub) => (
              <div
                key={sub}
                className="bg-white border rounded-lg px-4 py-3 shadow-sm"
              >
                {sub} tutor in {location}
              </div>
            ))}
          </div>

          {/* Benefits */}
          {INTENT_CONTENT[intentText]?.benefits && (
            <ul className="mt-8 list-disc pl-6">
              {INTENT_CONTENT[intentText].benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}

          {/* ================= RELATED SEARCHES ================= */}
          <h2 className="mt-20 text-2xl font-bold">
            Related Searches in {cityData.name}
          </h2>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cityData.locations.slice(0, 6).map((area) => (
              <Link
                key={area}
                href={`/${city}/${area
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/${intent}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md"
              >
                {intentText} in {area}, {cityData.name}
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

  return {
    paths,
    fallback: "blocking",
  };
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

import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

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
  city: string;
  location: string;
  intent: string;
}

export default function IndiaCityAutoPage({
  city,
  location,
  intent,
}: PageProps) {
  const router = useRouter();
  const cityData = CITY_MAP[city];

  // ❌ Invalid city → 404
  if (!cityData) {
    if (typeof window !== "undefined") router.replace("/404");
    return null;
  }

  // ❌ Invalid location → 404
  const validLocations = cityData.locations.map((l: string) =>
    l.toLowerCase()
  );

  if (!validLocations.includes(location.toLowerCase())) {
    if (typeof window !== "undefined") router.replace("/404");
    return null;
  }

  const intentLower = intent.toLowerCase();
  const formattedIntent =
    intent.charAt(0).toUpperCase() + intent.slice(1);

  // 🔥 CTA LOGIC (same as Allahabad)
  const isFindTutor =
    intentLower.includes("home tutor") ||
    intentLower.includes("home tuition") ||
    intentLower.includes("private tutor") ||
    intentLower.includes("tutor near");

  const isBecomeTutor =
    intentLower.includes("become tutor") ||
    intentLower.includes("tutor job") ||
    intentLower.includes("teaching job");

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

  const title = `${formattedIntent} in ${location}, ${cityData.name} | Verified Tutors`;
  const description = `Find ${formattedIntent} in ${location}, ${cityData.name}. Hire verified tutors for home and online tuition.`;

  return (
    <>
      {/* SEO */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://yourdomain.com/india/${city}/${location}/${intent}`}
        />
      </Head>

      <BreadcrumbSchema
        city={city}
        cityName={cityData.name}
        location={location}
        intent={formattedIntent}
      />
    
       <LocalBusinessSchema
          city={city}
          cityName={cityData.name}
          location={location}
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

        <Link
          href="/tutors/"
          className="bg-white/10 backdrop-blur border border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-indigo-700 transition"
        >
          Browse Tutors
        </Link>
      </motion.div>
    </div>
  </section>

  {/* ================= CONTENT ================= */}
  <section className="max-w-6xl mx-auto px-6 py-10">
    <p className="text-gray-700 text-lg">
  {INTENT_CONTENT[intent]?.intro
    ?.replace("{location}", location)
    ?.replace("{cityData}", cityData)}
</p>


{LOCATION_SNIPPETS[location.toLowerCase().replace(/\s+/g, "-")] && (
  <p className="mt-4 text-gray-600">
    {LOCATION_SNIPPETS[location.toLowerCase().replace(/\s+/g, "-")]}
  </p>
)}
<ul className="mt-6 list-disc pl-6">
  {INTENT_CONTENT[intent]?.benefits.map((b) => (
    <li key={b}>{b}</li>
  ))}
</ul>



    {/* ================= SUBJECTS ================= */}
    <h2 className="mt-16 text-3xl md:text-4xl font-extrabold text-gray-900">
      Subjects Available
    </h2>

    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {SUBJECTS.map((sub, i) => (
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          viewport={{ once: true }}
          className="group bg-white/70 backdrop-blur-xl border border-indigo-100 rounded-3xl px-5 py-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 mb-3 group-hover:bg-indigo-100 transition">
            <BookOpen className="text-indigo-600" size={20} />
          </div>
          <div className="font-semibold text-gray-800">
            {sub} tutor in {location}
          </div>
        </motion.div>
      ))}
    </div>

  {/* ================= RELATED SEARCHES ================= */}
<h2 className="mt-20 text-2xl font-bold text-gray-900">
  Related Searches in {cityData.name}
</h2>

<div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
  {cityData.locations.slice(0, 6).map((area: string) => (
    <Link
      key={area}
      href={`/india/${city}/${area.toLowerCase().replace(/\s+/g, "-")}/${intent
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      {intent} in {area}, {cityData.name}
    </Link>
  ))}
</div>


    {/* ================= WHY US ================= */}
    <h2 className="mt-24 text-3xl md:text-4xl font-extrabold text-gray-900">
      Why Choose Our Tutors?
    </h2>

    <div className="mt-12 grid md:grid-cols-2 gap-8">
      {[
        { icon: ShieldCheck, text: "Verified & background-checked tutors" },
        { icon: Laptop, text: "Home & online tuition options" },
        { icon: CheckCircle, text: `Tutors available near ${location}` },
        { icon: Wallet, text: "Affordable & flexible fees" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          viewport={{ once: true }}
          className="flex items-center gap-5 bg-gradient-to-r from-white to-indigo-50 border border-indigo-100 rounded-3xl p-7 shadow-md hover:shadow-xl transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <item.icon className="text-indigo-600" size={26} />
          </div>
          <span className="text-gray-800 font-semibold">{item.text}</span>
        </motion.div>
      ))}
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
          location={location}
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
    city.locations.forEach((location: string) => {
      Object.values(INTENTS).forEach((intentGroup) => {
        intentGroup.forEach((intent: string) => {
          paths.push({
            params: {
              city: city.slug,
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
      intent: params?.intent?.toString().replace(/-/g, " "),
    },
    revalidate: 86400,
  };
};

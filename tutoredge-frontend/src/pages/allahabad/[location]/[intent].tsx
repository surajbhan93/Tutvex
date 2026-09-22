// import { GetStaticPaths, GetStaticProps } from "next";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useEffect,  useState } from "react";
// import {
//   CheckCircle,
//   BookOpen,
//   Laptop,
//   ShieldCheck,
//   Wallet,
//   PhoneCall,
// } from "lucide-react";

// import {
//   ALLAHABAD_LOCATIONS,
//   INTENTS,
//   SUBJECTS,
// } from "@/components/seo/seo.config";

// import AllahabadSEO from "@/components/seo/AllahabadSEO";
// import LocalSchema from "@/components/seo/LocalSchema";
// import { ALLAHABAD_INTENT_CONTENT } from "@/components/seo/content/allahabadIntentContent";
// import { ALLAHABAD_LOCATION_SNIPPETS } from "@/components/seo/content/allahabadLocationSnippets";
// import AllahabadFAQSchema from "@/components/seo/Allahabad_FAQ";
// import NavBar from "@/components/navbar/NavBar";
// import Footer from "@/components/landing/Footer";
// import { motion } from "framer-motion";

// interface PageProps {
//   location: string;
//   intent: string;
// }


// /* =========================
//    UX SIGNAL HELPERS
// ========================= */

// // Static ratings (can come from DB later)
// const AREA_RATINGS: Record<string, number> = {
//   "Civil Lines": 4.8,
//   Katra: 4.6,
//   Naini: 4.2,
//   Jhusi: 4.1,
//   GeorgeTown: 4.7,
//   Prayagraj: 4.9,
// };

// // Fallback demand numbers (SEO safe)
// const FALLBACK_DEMAND = [
//   20, 34, 40, 56, 10, 28, 45, 62,
//   30, 25, 23, 56, 9, 10, 32, 42,
// ];

// // Count-up animation hook
// const useCountUp = (value: number) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let current = 0;
//     const step = Math.max(1, Math.ceil(value / 15));

//     const timer = setInterval(() => {
//       current += step;
//       if (current >= value) {
//         setCount(value);
//         clearInterval(timer);
//       } else {
//         setCount(current);
//       }
//     }, 40);

//     return () => clearInterval(timer);
//   }, [value]);

//   return count;
// };

// // Demand helpers
// const getTrend = (count: number) =>
//   count >= 50 ? "↑" : count >= 30 ? "→" : "↓";

// const getHeatmapClass = (count: number) =>
//   count >= 60
//     ? "bg-red-50 border-red-200"
//     : count >= 40
//     ? "bg-orange-50 border-orange-200"
//     : "bg-blue-50 border-blue-200";

// export default function AllahabadAutoPage({
//   location,
//   intent,
// }: PageProps) {
//   const title = `${intent} in ${location}, Allahabad | Verified Tutors`;
//   const description = `Looking for ${intent} in ${location}, Allahabad? Hire verified and experienced tutors for all subjects and classes.`;
 
//   // 🔥 CTA ROUTING LOGIC
//   const intentLower = intent.toLowerCase();
// const router = useRouter();

//   const isFindTutor =
//     intentLower.includes("home tutor") ||
//     intentLower.includes("home tuition") ||
//     intentLower.includes("private tutor") ||
//     intentLower.includes("tutor near");

//   const isBecomeTutor =
//     intentLower.includes("become tutor") ||
//     intentLower.includes("tutor job") ||
//     intentLower.includes("teaching job");

//   const primaryCTA = isFindTutor
//     ? {
//         text: "Find a Tutor",
//         href: "/find-tutor-flow/create-account/?source=MOBILE_NAV&campaign=FIND_TUTOR",
//       }
//     : isBecomeTutor
//     ? {
//         text: "Become a Tutor",
//         href: "/tutor-flow/tutor-registration/?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR",
//       }
//     : {
//         text: "View Subject",
//         href: "/subjects/",
//       };

//       const intentKey = intent.toLowerCase();
//     const intentData = ALLAHABAD_INTENT_CONTENT[intentKey];

//   return (
//     <>
//       {/* 🔥 GLOBAL + ALLAHABAD SEO */}
//       <AllahabadSEO pageType="home" />

//       {/* 🔥 PAGE-SPECIFIC SEO || setup */}
//       <Head>
//         <title>{title}</title>
//         <meta name="description" content={description} />
//         <link
//           rel="canonical"
//           href={`http://localhost:3000/allahabad/${location
//             .toLowerCase()
//             .replace(/\s+/g, "-")}/${intent
//             .toLowerCase()
//             .replace(/\s+/g, "-")}`}
//         />
//       </Head>

//       {/* 🔥 LOCAL SCHEMA */}
//       <LocalSchema />

//       {/* 🔥 NAVBAR */}
//       <NavBar />


//       {/* 🔥 PAGE CONTENT */}
//     <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden">





//   {/* ================= HERO ================= */}
//   <section className="relative bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 text-white overflow-hidden">
//     {/* Soft background glow */}
//     <div className="absolute inset-0">
//       <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-white/10 rounded-full blur-[120px]" />
//       <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-white/10 rounded-full blur-[120px]" />
//     </div>

//     <div className="relative max-w-6xl mx-auto px-6 py-20">
//       <motion.h1
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-4xl md:text-5xl font-extrabold leading-tight"
//       >
//         {intent} in {location}, Allahabad
//       </motion.h1>

//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.15 }}
//         className="mt-6 text-lg md:text-xl text-indigo-100 max-w-3xl"
//       >
//         Students and parents in {location}, Allahabad trust Tutvex to find
//         verified tutors for CBSE, ICSE, UP Board and competitive exams.
//         Learn at home or online with flexible timings.
//       </motion.p>

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//         className="mt-10 flex flex-wrap gap-5"
//       >
//         <Link
//           href={primaryCTA.href}
//           className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition"
//         >
//           {primaryCTA.text}
//         </Link>

//         <Link
//           href="/tutors/"
//           className="bg-white/10 backdrop-blur border border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-indigo-700 transition"
//         >
//           Browse Tutors
//         </Link>
//       </motion.div>
//     </div>
//   </section>

//   {/* ================= CONTENT ================= */}
//   <section className="max-w-6xl mx-auto px-6 py-20">
//     <motion.p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
//   {ALLAHABAD_INTENT_CONTENT[intent.toLowerCase()]?.intro
//     ?.replace("{location}", location)}
// </motion.p>

// {ALLAHABAD_LOCATION_SNIPPETS[location.toLowerCase()] && (
//   <p className="mt-4 text-gray-600 max-w-4xl">
//     {ALLAHABAD_LOCATION_SNIPPETS[location.toLowerCase()]}
//   </p>
// )}


//     {/* ================= SUBJECTS ================= */}
//           <h2 className="mt-14 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//         Subjects Available
//       </h2>


//   <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//   {SUBJECTS.slice(0, 15).map((subject, i) => (
//     <motion.div
//       key={subject}
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ delay: i * 0.04 }}
//       viewport={{ once: true }}
//       onClick={() =>
//         router.push(
//           "/subjects/?source=NAVBAR&campaign=SUBJECTS_NAV&medium=website"
//         )
//       }
//       className="
//         cursor-pointer
//         relative rounded-2xl p-[1px]
//         bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
//         hover:scale-[1.03] transition-all duration-300
//       "
//     >
//       <div
//         className="
//           h-full rounded-2xl px-4 py-5
//           bg-white/80 backdrop-blur-xl
//           shadow-sm hover:shadow-xl
//         "
//       >
//         <BookOpen className="mb-2 text-indigo-600" size={20} />
//         <div className="font-semibold text-gray-800 text-sm">
//           {subject} tutor in {location}
//         </div>
//       </div>
//     </motion.div>
//   ))}
// </div>


//        {intentData?.benefits && (
//             <>
//               <h2 className="mt-16 text-2xl font-bold text-gray-900">
//                 Benefits of {intent} in {location}
//               </h2>

//               <ul className="mt-8 grid sm:grid-cols-2 gap-6">
//                 {intentData.benefits.map((benefit, index) => (
//                   <motion.li
//                     key={index}
//                     className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm"
//                   >
//                     <CheckCircle className="text-green-600 mt-1" size={22} />
//                     <span className="text-gray-700 font-medium">
//                       {benefit}
//                     </span>
//                   </motion.li>
//                 ))}
//               </ul>
//             </>
//           )}


// {/*  */}

// {/* ================= RELATED SEARCHES ================= */}
// <h2 className="mt-20 text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//   Related Searches in Allahabad
// </h2>

// <div className="mt-10 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8">
//   <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
//     {ALLAHABAD_LOCATIONS.slice(0, 6).map((area) => (
//       <Link
//         key={area}
//         href="/tutors/"
//         className="
//           group
//           rounded-2xl
//           bg-white/80 backdrop-blur-md
//           p-4
//           shadow-sm
//           hover:shadow-xl
//           hover:-translate-y-1
//           transition-all duration-300
//         "
//       >
//         <span className="block text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition">
//           {intent} in {area}, Allahabad
//         </span>

//         <span className="mt-1 inline-block text-xs text-gray-500 group-hover:text-indigo-500">
//           Explore tutors →
//         </span>
//       </Link>
//     ))}
//   </div>
// </div>

// {/* ================= LOCAL DEMAND SNAPSHOT ================= */}
// <section className="max-w-6xl mx-auto px-6 py-16">
//   <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//     Tutor Availability Near {location}
//   </h2>

//   <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
//     {ALLAHABAD_LOCATIONS.slice(0, 6).map((area, index) => {
//       const demand =
//   FALLBACK_DEMAND[index % FALLBACK_DEMAND.length] ?? 20;

//       const animated = useCountUp(demand);
//       const rating = AREA_RATINGS[area] ?? 4.2;

//       return (
//         <div
//           key={area}
//           className={`relative rounded-2xl border p-5 ${getHeatmapClass(
//             demand
//           )}`}
//         >
//           {/* Demand Badge */}
//           <span className="absolute top-4 right-4 text-xs font-bold text-indigo-700">
//             {animated}+ Tutors
//           </span>

//           {/* Rating */}
//           <span className="absolute top-4 left-4 text-xs font-semibold text-gray-700">
//             ⭐ {rating}
//           </span>

//           {/* High Demand */}
//           {demand >= 50 && (
//             <span className="absolute bottom-4 right-4 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
//               High Demand
//             </span>
//           )}

//           {/* Trend */}
//           <span className="absolute bottom-4 left-4 text-lg">
//             {getTrend(demand)}
//           </span>

//           <p className="text-sm font-semibold text-gray-800">
//             Tutors in {area}
//           </p>
//           <p className="text-xs text-gray-600 mt-1">
//             Popular choice near {location}
//           </p>
//         </div>
//       );
//     })}
//   </div>
// </section>


//     {/* ================= WHY US ================= */}
//   <h2 className="mt-20 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//   Why Choose Tutvex?
// </h2>

// <p className="mt-4 max-w-2xl text-gray-600">
//   Tutvex connects you with trusted, experienced tutors to deliver personalized
//   learning — at your home or online — with complete transparency and flexibility.
// </p>

// <div className="mt-12 grid md:grid-cols-2 gap-6">
//   {[
//     {
//       icon: ShieldCheck,
//       title: "Verified Tutors",
//       text: "All tutors are identity-verified and background-checked for safety and trust.",
//       color: "from-green-400 to-emerald-500",
//     },
//     {
//       icon: Laptop,
//       title: "Online & Home Classes",
//       text: "Choose between online learning or face-to-face home tuition as per your comfort.",
//       color: "from-indigo-400 to-purple-500",
//     },
//     {
//       icon: CheckCircle,
//       title: "Tutors Near You",
//       text: `Find experienced tutors available in and around ${location} for quick onboarding.`,
//       color: "from-pink-400 to-rose-500",
//     },
//     {
//       icon: Wallet,
//       title: "Affordable Fees",
//       text: "Flexible pricing with no hidden charges. Pay only for what you need.",
//       color: "from-yellow-400 to-orange-500",
//     },
//   ].map((item, i) => (
//     <motion.div
//       key={i}
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ delay: i * 0.12 }}
//       viewport={{ once: true }}
//       className="
//         group
//         relative rounded-3xl p-[1px]
//         bg-gradient-to-br from-gray-200 to-gray-100
//         hover:scale-[1.02] transition-all duration-300
//       "
//     >
//       <div className="
//         h-full rounded-3xl bg-white/90 backdrop-blur-xl
//         p-6 shadow-sm hover:shadow-xl
//       ">
//         <div
//           className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color}
//           flex items-center justify-center mb-4`}
//         >
//           <item.icon className="text-white" size={28} />
//         </div>

//         <h3 className="text-lg font-bold text-gray-900 mb-1">
//           {item.title}
//         </h3>

//         <p className="text-sm text-gray-600 leading-relaxed">
//           {item.text}
//         </p>
//       </div>
//     </motion.div>
//   ))}
// </div>

//   </section>

//   {/* ================= FLOATING CTA ================= */}
//   <motion.div
//     initial={{ scale: 0 }}
//     animate={{ scale: 1 }}
//     transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
//     className="fixed bottom-6 right-6 z-50"
//   >
//     <Link
//       href={primaryCTA.href}
//       className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-4 rounded-full shadow-2xl hover:scale-105 transition"
//     >
//       <PhoneCall />
//       Talk to a Tutor
//     </Link>
//   </motion.div>
// </main>

//   <AllahabadFAQSchema area={location} intent={intent} />


//       {/* 🔥 FOOTER */}
//       <Footer />
//     </>
//   );
// }

// /* ======================================================
//    🔥 AUTO-GENERATE ALLAHABAD SEO PAGES
//    ====================================================== */

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths: { params: { location: string; intent: string } }[] = [];

//   ALLAHABAD_LOCATIONS.forEach((location) => {
//     Object.values(INTENTS).forEach((intentGroup) => {
//       intentGroup.forEach((intent) => {
//         paths.push({
//           params: {
//             location: location.toLowerCase().replace(/\s+/g, "-"),
//             intent: intent.toLowerCase().replace(/\s+/g, "-"),
//           },
//         });
//       });
//     });
//   });

//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   return {
//     props: {
//       location: params?.location?.toString().replace(/-/g, " "),
//       intent: params?.intent?.toString().replace(/-/g, " "),
//     },
//     revalidate: 86400, // daily
//   };
// };



import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { ALLAHABAD_LOCATIONS, INTENTS } from "@/lib/allahabad/seo.config";
import { getLocalityDetail } from "@/lib/allahabad/allahabadData";

// Core Above-the-Fold SEO & Structural Components
import LocalSEOHead from "@/components/seo/LocalSEOHead";
import LocalSchemaEngine from "@/components/seo/LocalSchemaEngine";
import AISearchSnippet from "@/components/seo/AISearchSnippet";
import DynamicCTA from "@/components/seo/DynamicCTA";
import DynamicLocalContent from "@/components/seo/DynamicLocalContent";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
// Icons (Lightweight Lucide React)
import {
  ShieldCheck,
  Star,
  HelpCircle,
} from "lucide-react";

// Lazy-loaded Below-the-fold heavy components for Core Web Vitals Optimization
const GoogleBusinessProfileSection = dynamic(
  () => import("@/components/seo/GoogleBusinessProfileSection"),
  { ssr: true }
);

const EEATTrustSection = dynamic(
  () => import("@/components/seo/EEATTrustSection"),
  { ssr: true }
);

const InternalLinksSection = dynamic(
  () => import("@/components/seo/InternalLinksSection"),
  { ssr: true }
);

interface PageProps {
  location: string;
  intent: string;
  formattedLocation: string;
  formattedIntent: string;
  faqs: Array<{ question: string; answer: string }>;
}

export default function AllahabadAutoPage({
  location,
  intent,
  formattedLocation,
  formattedIntent,
  faqs,
}: PageProps) {
  const locality = getLocalityDetail(location);

  return (
    <>
      {/* 1. SEO Head Meta Tags (Title 55-60 chars, Meta Description, Canonical, OG, Twitter) */}
      <LocalSEOHead
        location={location}
        intent={intent}
        formattedLocation={formattedLocation}
        formattedIntent={formattedIntent}
      />

      {/* 2. Structured JSON-LD Schemas (LocalBusiness, Organization, Service, Breadcrumb, FAQ, Review) */}
      <LocalSchemaEngine
        location={location}
        intent={intent}
        formattedLocation={formattedLocation}
        formattedIntent={formattedIntent}
        faqs={faqs}
      />

      {/* Main Page Container */}
      <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
        <NavBar />
        {/* ================= 3. HERO SECTION ================= */}
        <header className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden pt-12 pb-16 sm:pb-24 px-6 sm:px-10">
          {/* Subtle Glow background shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs sm:text-sm text-indigo-200">
                <li>
                  <a href="https://tutvex.com" className="hover:underline">Home</a>
                </li>
                <li>/</li>
                <li>
                  <a href="https://tutvex.com/allahabad" className="hover:underline">Allahabad</a>
                </li>
                <li>/</li>
                <li className="font-semibold text-white truncate max-w-[150px] sm:max-w-none">
                  {formattedLocation}
                </li>
              </ol>
            </nav>

            {/* Localized Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Tutors Near {locality.nearbyLandmarks[0] || formattedLocation}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                4.9/5 Rating (542+ Reviews)
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              {formattedIntent} in {formattedLocation}, Allahabad
            </h1>

            <p className="mt-6 text-base sm:text-xl text-indigo-100 max-w-3xl leading-relaxed font-normal">
              Find background-verified, experienced 1-on-1 home tutors and online personal teachers in{" "}
              <strong className="text-white font-semibold">{formattedLocation}</strong>. Covering CBSE, ICSE, UP Board, Class 1-12, IIT-JEE Main, NEET & Foundation courses.
            </p>

            {/* Top CTAs */}
            <DynamicCTA
              location={location}
              intent={intent}
              formattedLocation={formattedLocation}
              formattedIntent={formattedIntent}
              type="top"
            />
          </div>
        </header>

        {/* Page Body Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ================= 4. AI SEARCH OVERVIEW / DIRECT ANSWER ================= */}
          <AISearchSnippet
            location={location}
            intent={intent}
            formattedLocation={formattedLocation}
            formattedIntent={formattedIntent}
          />

          {/* ================= 5. DYNAMIC LOCAL CONTENT & SUBJECTS ================= */}
          <DynamicLocalContent
            location={location}
            intent={intent}
            formattedLocation={formattedLocation}
            formattedIntent={formattedIntent}
          />

          {/* ================= 6. MIDDLE CONVERSION CTA ================= */}
          <DynamicCTA
            location={location}
            intent={intent}
            formattedLocation={formattedLocation}
            formattedIntent={formattedIntent}
            type="middle"
          />

          {/* ================= 7. HOW IT WORKS SECTION ================= */}
          <section className="my-16 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Simple 3-Step Hiring Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                How to Book a Tutor in {formattedLocation}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Submit Requirement</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Share your class, subject, and preferred schedule in {formattedLocation}.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Free Home Demo Class</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We match a top local tutor for a 100% free demo class at your home.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Start Learning</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Confirm the tutor and begin flexible 1-on-1 personalized home tuition.
                </p>
              </div>
            </div>
          </section>

          {/* ================= 8. GOOGLE BUSINESS PROFILE SECTION ================= */}
          <GoogleBusinessProfileSection formattedLocation={formattedLocation} />

          {/* ================= 9. EEAT & TRUST SECTION ================= */}
          <EEATTrustSection formattedLocation={formattedLocation} />

          {/* ================= 10. REVIEWS & TESTIMONIALS ================= */}
          <section className="my-16 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What Parents in {formattedLocation} Say About Tutvex
              </h2>
              <p className="text-sm text-gray-600 mt-2">Real feedback from verified local families.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  "We requested a Class 10 Maths & Science home tutor near {locality.nearbyLandmarks[0] || formattedLocation}. Tutvex provided an MNNIT graduate within 24 hours. Exceptional quality!"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900">Rajesh Srivastava</span>
                  <span className="text-gray-500">Parent in {formattedLocation}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  "Very trustworthy agency. Their tutor background check system gave us complete peace of mind. Highly recommended for students in Prayagraj!"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900">Sunita Pandey</span>
                  <span className="text-gray-500">Parent in {formattedLocation}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= 11. FAQ SECTION ================= */}
          <section className="my-16 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm" aria-label="Frequently Asked Questions">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                Frequently Asked Questions ({formattedLocation})
              </h2>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-slate-50 rounded-2xl p-5 border border-slate-200 [&_summary::-webkit-details-marker]:none"
                >
                  <summary className="flex items-center justify-between font-bold text-gray-900 text-base sm:text-lg cursor-pointer">
                    <span className="pr-4">{faq.question}</span>
                    <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 transition duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed border-t border-slate-200 pt-3">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ================= 12. INTERNAL LINKING MATRIX ================= */}
          <InternalLinksSection
            location={location}
            intent={intent}
            formattedLocation={formattedLocation}
            formattedIntent={formattedIntent}
          />

          {/* ================= 13. FINAL BOTTOM CONVERSION CTA ================= */}
          <DynamicCTA
            location={location}
            intent={intent}
            formattedLocation={formattedLocation}
            formattedIntent={formattedIntent}
            type="bottom"
          />
        </div>

        {/* ================= 14. STICKY MOBILE BOTTOM CTA BAR ================= */}
        <DynamicCTA
          location={location}
          intent={intent}
          formattedLocation={formattedLocation}
          formattedIntent={formattedIntent}
          type="sticky"
        />
        <Footer />
      </main>
    </>
  );
}

/* ======================================================
   🔥 PROGRAMMATIC ISR STATIC PATH GENERATION
   ====================================================== */

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { location: string; intent: string } }[] = [];

  // Generate paths for core prime locations & intents to ensure instant HTML cache
  ALLAHABAD_LOCATIONS.slice(0, 10).forEach((location) => {
    INTENTS.needTutor.slice(0, 5).forEach((intent) => {
      paths.push({
        params: {
          location: location.toLowerCase().trim().replace(/\s+/g, "-"),
          intent: intent.toLowerCase().trim().replace(/\s+/g, "-"),
        },
      });
    });
  });

  console.log(`Generated ${paths.length} static paths for /allahabad/[location]/[intent]`);

  return {
    paths,
    fallback: false, // Changed from "blocking" to false - invalid URLs will get proper 404
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawLoc = params?.location?.toString() || "";
  const rawIntent = params?.intent?.toString() || "";

  // Validate location
  const normalizedLocation = rawLoc.replace(/-/g, ' ').toLowerCase();
  const locationExists = ALLAHABAD_LOCATIONS.some(
    loc => loc.toLowerCase() === normalizedLocation
  );

  if (!locationExists) {
    return { notFound: true };
  }

  // Validate intent
  const allIntents = Object.values(INTENTS).flat();
  const normalizedIntent = rawIntent.replace(/-/g, ' ').toLowerCase();
  const intentExists = allIntents.some(
    intent => intent.toLowerCase() === normalizedIntent
  );

  if (!intentExists) {
    return { notFound: true };
  }

  const formattedLocation = rawLoc
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const formattedIntent = rawIntent
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const localityDetail = getLocalityDetail(rawLoc);

  // Generate 8 rich, dynamic FAQs specific to this location & intent
  const faqs = [
    {
      question: `How can I find a verified ${formattedIntent.toLowerCase()} in ${formattedLocation}, Allahabad?`,
      answer: `You can instantly request a background-verified ${formattedIntent.toLowerCase()} in ${formattedLocation} through Tutvex. Simply fill out our quick request form or call us directly. We will schedule a free home demo class within 24 hours.`,
    },
    {
      question: `What are the typical fees for home tuition in ${formattedLocation}?`,
      answer: `Home tuition rates in ${formattedLocation} generally range from ₹300 to ₹750 per hour depending on the grade (Class 1-12 or competitive exams), board syllabus (CBSE, ICSE, UP Board), and subject complexity.`,
    },
    {
      question: `Are tutors in ${formattedLocation} background checked?`,
      answer: `Yes, 100% of Tutvex tutors operating near ${formattedLocation} undergo mandatory Aadhaar identity checks, academic qualification verification, and address validation before being assigned to student homes.`,
    },
    {
      question: `Can I get a free demo class before hiring a tutor in ${formattedLocation}?`,
      answer: `Absolutely! Tutvex offers a 100% free, no-obligation trial demo session with your matched tutor at your home in ${formattedLocation}.`,
    },
    {
      question: `Which subjects are covered for home tutors near ${formattedLocation}?`,
      answer: `We cover all major subjects including Mathematics, Physics, Chemistry, Biology, English, Accounts, Computer Science, and competitive preparation (IIT-JEE & NEET) for students near ${localityDetail.nearbyLandmarks[0] || formattedLocation}.`,
    },
    {
      question: `Is online tuition available in ${formattedLocation} as well as home tuition?`,
      answer: `Yes! You can choose between personalized 1-on-1 offline home tuition at your residence in ${formattedLocation} or interactive live 1-on-1 online tutoring.`,
    },
    {
      question: `What happens if I want to change my assigned tutor in ${formattedLocation}?`,
      answer: `Tutvex provides a hassle-free tutor replacement guarantee. If you are not completely satisfied with the teaching style, your Prayagraj relationship manager will assign a replacement tutor immediately.`,
    },
    {
      question: `How quickly can a tutor start teaching in ${formattedLocation}?`,
      answer: `In most cases, a local tutor near ${formattedLocation} can be assigned for a demo class within 12 to 24 hours of your initial request.`,
    },
  ];

  return {
    props: {
      location: rawLoc,
      intent: rawIntent,
      formattedLocation,
      formattedIntent,
      faqs,
    },
    // ISR: Revalidate once per day (86400 seconds) for optimal cache & crawling performance
    revalidate: 86400,
  };
};

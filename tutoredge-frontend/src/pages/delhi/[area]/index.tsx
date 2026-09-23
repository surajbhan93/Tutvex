import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Search,
  ChevronDown,
  Home,
  Target,
  Award,
  TrendingUp,
  Train,
} from "lucide-react";

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { DELHI_AREAS, DelhiArea, getAllDelhiAreaSlugs } from "@/lib/delhi/delhiAreas";
import FAQSchema from "@/components/seoIndia/FAQSchema";
import LocalBusinessSchema from "@/components/seoIndia/LocalBusinessSchema";

/* =========================
   CONSTANTS
========================= */
const PHONE_NUMBER = "+919305275932";
const WHATSAPP_NUMBER = "919305275932";

/* =========================
   COMPONENTS
========================= */
function Breadcrumb({ area }: { area: DelhiArea }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
      <Link href="/" className="hover:text-violet-600 transition">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
      <Link href="/delhi" className="hover:text-violet-600 transition">
        Delhi
      </Link>
      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
      <span className="text-violet-600 font-semibold">{area.displayName}</span>
    </nav>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        open
          ? "border-violet-300 bg-violet-50 shadow-md"
          : "border-gray-100 bg-white hover:border-violet-200 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-violet-500" />
          </span>
          <span className="font-semibold text-gray-800 text-base">{q}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-violet-500 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 leading-relaxed ml-12">{a}</p>
        </div>
      )}
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
interface Props {
  area: DelhiArea;
}

export default function DelhiAreaPage({ area }: Props) {
  const whatsappMsg = encodeURIComponent(
    `Hello, I need a home tutor in ${area.name}, Delhi`
  );

  return (
    <>
      <Head>
        <title>{area.title}</title>
        <meta name="description" content={area.metaDescription} />
        <meta name="keywords" content={area.keywords.join(", ")} />
        <link rel="canonical" href={`https://tutvex.com/delhi/${area.slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={area.title} />
        <meta property="og:description" content={area.metaDescription} />
        <meta property="og:url" content={`https://tutvex.com/delhi/${area.slug}`} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={area.title} />
        <meta name="twitter:description" content={area.metaDescription} />

        {/* Structured Data */}
        <FAQSchema faqs={area.faqs.map(f => ({ q: f.question, a: f.answer }))} />
        <LocalBusinessSchema
          name={`Tutvex - Home Tutors in ${area.name}, Delhi`}
          description={area.metaDescription}
          telephone={PHONE_NUMBER}
          address={{
            addressLocality: area.name,
            addressRegion: "Delhi",
            addressCountry: "IN",
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        <NavBar />

        {/* ========== HERO SECTION ========== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-20 lg:py-24">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
            <Breadcrumb area={area} />

            <div className="flex flex-col lg:flex-row lg:items-center gap-12">
              {/* Left Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Trust Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 mb-6">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-white">Verified Tutors</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 text-white">
                    {area.h1}
                  </h1>

                  <p className="text-lg text-purple-100/90 max-w-2xl leading-relaxed mb-4">
                    {area.subheading}
                  </p>

                  <p className="text-base text-purple-100/80 max-w-2xl leading-relaxed">
                    {area.introduction}
                  </p>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href={`/tutors?city=Delhi&area=${encodeURIComponent(area.name)}`}
                      className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl hover:-translate-y-1 transition-all"
                    >
                      <Search className="h-4 w-4" />
                      Find a Tutor
                    </Link>

                    <Link
                      href="/find-students"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/25 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 hover:-translate-y-1 transition-all"
                    >
                      <Users className="h-4 w-4" />
                      Find Students
                    </Link>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-base hover:-translate-y-1 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Right: Local Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:w-[340px] shrink-0"
              >
                <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      {area.displayName}
                    </h3>
                    <p className="text-xs text-purple-100/70 mt-0.5">Local Coverage</p>
                  </div>
                  <div className="p-6">
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
                      Areas Covered:
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {area.localities.slice(0, 8).map((locality) => (
                        <div key={locality} className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-violet-300 shrink-0" />
                          <span className="text-sm text-purple-50/90">{locality}</span>
                        </div>
                      ))}
                      {area.localities.length > 8 && (
                        <p className="text-xs text-purple-100/60 italic">
                          +{area.localities.length - 8} more localities
                        </p>
                      )}
                    </div>

                    {area.metroStations.length > 0 && (
                      <>
                        <h4 className="text-sm font-bold text-white mb-2 mt-4 uppercase tracking-wide">
                          Metro Stations:
                        </h4>
                        <div className="space-y-1.5">
                          {area.metroStations.slice(0, 3).map((station) => (
                            <div key={station} className="flex items-center gap-2">
                              <Train className="h-3 w-3 text-violet-300 shrink-0" />
                              <span className="text-xs text-purple-50/85">{station}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== TUTOR SEARCH FORM ========== */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-violet-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Find a Tutor in {area.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-400 focus:outline-none text-sm">
                    <option>Select Class</option>
                    <option>Class 1-5</option>
                    <option>Class 6-8</option>
                    <option>Class 9-10</option>
                    <option>Class 11-12</option>
                    <option>JEE</option>
                    <option>NEET</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-400 focus:outline-none text-sm">
                    <option>Select Subject</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>English</option>
                    <option>Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Board</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-400 focus:outline-none text-sm">
                    <option>Select Board</option>
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                  </select>
                </div>
              </div>
              <Link
                href={`/tutors?city=Delhi&area=${encodeURIComponent(area.name)}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Search className="h-4 w-4" />
                Find Tutor
              </Link>
            </div>
          </div>
        </section>

        {/* ========== WHY CHOOSE TUTVEX IN AREA ========== */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Why Choose Tutvex in{" "}
                <span className="text-violet-600">{area.name}</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {area.whyChooseContent}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {area.uniqueFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-100 hover:border-violet-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-violet-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{feature}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== HOME TUITION SERVICES ========== */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Home Tuition Services Available in {area.name}
              </h2>
              <p className="text-gray-600 text-lg">
                Expert tutors for all classes and competitive exams
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Class 1-5", icon: "📚", link: `/tutors?class=1-5&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "Class 6-8", icon: "📖", link: `/tutors?class=6-8&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "Class 9-10", icon: "✏️", link: `/tutors?class=9-10&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "Class 11-12", icon: "🎓", link: `/tutors?class=11-12&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "JEE Preparation", icon: "🔬", link: `/tutors?exam=JEE&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "NEET Preparation", icon: "🩺", link: `/tutors?exam=NEET&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "CBSE", icon: "📐", link: `/tutors?board=CBSE&area=${encodeURIComponent(area.name)}&city=Delhi` },
                { name: "ICSE / ISC", icon: "📝", link: `/tutors?board=ICSE&area=${encodeURIComponent(area.name)}&city=Delhi` },
              ].map((service) => (
                <Link
                  key={service.name}
                  href={service.link}
                  className="group p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-violet-300 hover:shadow-lg transition-all text-center"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-800 group-hover:text-violet-600 transition-colors">
                    {service.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== POPULAR SUBJECTS ========== */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Popular Subjects in {area.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                "Maths", "Physics", "Chemistry", "Biology", "English", "Science",
                "Hindi", "Computer Science", "Social Science", "Accountancy", "Economics", "Commerce"
              ].map((subject) => (
                <Link
                  key={subject}
                  href={`/tutors?subject=${encodeURIComponent(subject)}&area=${encodeURIComponent(area.name)}&city=Delhi`}
                  className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all text-center"
                >
                  <span className="text-sm font-bold text-gray-800 hover:text-violet-600">
                    {subject}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SCHOOLS NEARBY ========== */}
        {area.schoolsNearby.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                  Schools Near {area.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  We provide tutors for students from these schools
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {area.schoolsNearby.map((school) => (
                  <div
                    key={school}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <GraduationCap className="h-5 w-5 text-violet-600 shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{school}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========== AREAS WE COVER NEAR ========== */}
        {area.nearbyAreas.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                  Areas We Cover Near {area.name}
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {area.nearbyAreas.map((nearbyArea) => {
                  const nearbySlug = Object.keys(DELHI_AREAS).find(
                    (key) => DELHI_AREAS[key].name === nearbyArea
                  );
                  return nearbySlug ? (
                    <Link
                      key={nearbyArea}
                      href={`/delhi/${nearbySlug}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
                    >
                      <MapPin className="h-4 w-4 text-violet-500" />
                      <span className="text-sm font-semibold text-gray-800">{nearbyArea}</span>
                    </Link>
                  ) : (
                    <div
                      key={nearbyArea}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{nearbyArea}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/delhi"
                  className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold"
                >
                  View All Delhi Areas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ========== HOW TUTVEX WORKS ========== */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                How Tutvex Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Tell Us What You Need",
                  description: "Share your class, subject, and location details",
                  icon: <Search className="h-5 w-5" />,
                },
                {
                  step: "2",
                  title: "Get Matched with Tutors",
                  description: "We connect you with 2-3 verified tutors",
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  step: "3",
                  title: "Review Tutor Details",
                  description: "Check profiles and take a free demo class",
                  icon: <GraduationCap className="h-5 w-5" />,
                },
                {
                  step: "4",
                  title: "Start Learning at Home",
                  description: "Begin your personalized learning journey",
                  icon: <CheckCircle className="h-5 w-5" />,
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      {item.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center font-black text-violet-600 text-xs mx-auto" style={{left: '50%', transform: 'translateX(-50%)'}}>
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== LOCAL CONTEXT SECTION ========== */}
        {area.localContext && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-100">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-violet-600" />
                  <h2 className="text-2xl font-black text-gray-900">
                    About {area.name}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {area.localContext}
                </p>
                {area.academicProfile && (
                  <div className="pt-4 border-t border-violet-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Academic Profile</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {area.academicProfile}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========== FAQ SECTION ========== */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg">
                Common questions about home tuition in {area.name}
              </p>
            </div>

            <div className="space-y-4">
              {area.faqs.map((faq, idx) => (
                <FAQItem key={idx} q={faq.question} a={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="py-16 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Ready to Find Your Home Tutor in {area.name}?
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Connect with verified, experienced tutors in your locality
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/tutors?city=Delhi&area=${encodeURIComponent(area.name)}`}
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold text-base hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <Search className="h-5 w-5" />
                Find a Tutor Now
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-base hover:-translate-y-1 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 hover:-translate-y-1 transition-all"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

/* =========================
   STATIC PATH GENERATION
========================= */
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllDelhiAreaSlugs();
  
  const paths = slugs.map((slug) => ({
    params: { area: slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const areaSlug = params?.area as string;
  const area = DELHI_AREAS[areaSlug];

  if (!area) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      area,
    },
  };
};

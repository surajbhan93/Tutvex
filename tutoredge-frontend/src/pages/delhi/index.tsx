import { GetStaticProps } from "next";
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
  Heart,
  Clock,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  Search,
  ChevronDown,
  Zap,
  Target,
} from "lucide-react";

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { DELHI_AREAS } from "@/lib/delhi/delhiAreas";
import FAQSchema from "@/components/seoIndia/FAQSchema";
import LocalBusinessSchema from "@/components/seoIndia/LocalBusinessSchema";

/* =========================
   CONSTANTS
========================= */
const PHONE_NUMBER = "+919305275932";
const WHATSAPP_NUMBER = "919305275932";
const WHATSAPP_DEFAULT_MSG = "Hello%2C%20I%20need%20a%20home%20tutor%20in%20Delhi";
const GOOGLE_BUSINESS_LINK = "https://share.google/9srzoEeknq8tpchsp";

const TUTOR_COUNT = 2500;
const HAPPY_FAMILIES = 15000;

/* =========================
   FAQ DATA
========================= */
const FAQS = [
  {
    q: "How can I find a home tutor in Delhi?",
    a: "Simply visit Tutvex, select your area in Delhi (like South Delhi, Rohini, Dwarka, etc.), choose your class and subject requirements, and we'll connect you with verified tutors in your locality within 24 hours. You can take a free demo class before confirming.",
  },
  {
    q: "Are tutors on Tutvex background verified?",
    a: "Yes, absolutely. Every tutor on Tutvex undergoes a comprehensive verification process including ID proof check, qualification verification, and reference checks. We also continuously collect parent feedback to maintain quality.",
  },
  {
    q: "What subjects and classes do you cover in Delhi?",
    a: "We cover all subjects from Class 1 to Class 12 including Maths, Science, Physics, Chemistry, Biology, English, Hindi, Social Science, Computer Science, and more. We also provide specialized tutors for JEE, NEET, CBSE, ICSE, and competitive exam preparation.",
  },
  {
    q: "Can I get a free demo class?",
    a: "Yes! Tutvex offers a completely free demo class with your selected tutor. You can evaluate their teaching style, communication, and subject expertise before making any payment commitment.",
  },
  {
    q: "What are the home tuition fees in Delhi?",
    a: "Home tuition fees in Delhi typically range from ₹500 to ₹2500 per month depending on class level, subject, tutor experience, and location. Contact us for a customized quote based on your specific requirements.",
  },
  {
    q: "Do you provide female tutors in Delhi?",
    a: "Yes, we have both male and female tutors available across all areas of Delhi. You can specify your preference when making a tutor request, and we'll match you accordingly.",
  },
  {
    q: "How quickly can I get a tutor in Delhi?",
    a: "Typically within 24 to 48 hours. We match you with 2-3 verified tutors based on your requirements, and you can take a free demo class to decide which tutor suits best.",
  },
  {
    q: "Do you provide tutors for CBSE and ICSE boards in Delhi?",
    a: "Yes, we have experienced tutors for both CBSE and ICSE boards across all areas of Delhi. Our tutors are familiar with the respective board syllabus and examination patterns.",
  },
  {
    q: "Can I get a JEE or NEET tutor in Delhi?",
    a: "Absolutely. Tutvex has specialized JEE and NEET tutors in Delhi who provide focused coaching for Physics, Chemistry, Maths, and Biology with proven teaching methods and regular test preparation.",
  },
  {
    q: "Which areas of Delhi do you cover?",
    a: "We cover all major areas of Delhi including South Delhi, North Delhi, West Delhi, East Delhi, Central Delhi, Rohini, Dwarka, Janakpuri, Laxmi Nagar, Saket, Greater Kailash, Mayur Vihar, Karol Bagh, and all nearby localities.",
  },
  {
    q: "Can I find a home tutor near me in Delhi?",
    a: "Yes, Tutvex has tutors available in all Delhi neighborhoods. Simply specify your locality when registering, and we'll connect you with tutors available in your exact area.",
  },
  {
    q: "Do you provide one-to-one home tuition in Delhi?",
    a: "Yes, all our tutors provide personalized one-to-one home tuition where the tutor visits your home and gives individual attention to your child.",
  },
];

/* =========================
   COMPONENTS
========================= */
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
export default function DelhiCityPage() {
  const areaKeys = Object.keys(DELHI_AREAS);

  return (
    <>
      <Head>
        <title>Home Tutor in Delhi | Home Tuition for Class 1–12 | Tutvex</title>
        <meta
          name="description"
          content="Find experienced home tutors in Delhi for Class 1–12, CBSE, ICSE, JEE, NEET and more. Get personalized one-to-one home tuition with Tutvex. Free demo class available."
        />
        <meta
          name="keywords"
          content="home tutor in Delhi, home tuition in Delhi, private tutor Delhi, home tutor near me Delhi, CBSE tutor Delhi, ICSE tutor Delhi, JEE tutor Delhi, NEET tutor Delhi, home tuition near me, best home tutor Delhi, tutor in Delhi, home teacher Delhi"
        />
        <link rel="canonical" href="https://tutvex.com/delhi" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Home Tutor in Delhi | Home Tuition | Tutvex" />
        <meta
          property="og:description"
          content="Find verified home tutors in Delhi for all classes, CBSE, ICSE, JEE, NEET. Book free demo class."
        />
        <meta property="og:url" content="https://tutvex.com/delhi" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Tutor in Delhi | Home Tuition | Tutvex" />
        <meta
          name="twitter:description"
          content="Find verified home tutors in Delhi for all classes. Free demo class available."
        />

        {/* Structured Data */}
        <FAQSchema faqs={FAQS} />
        <LocalBusinessSchema
          name="Tutvex - Home Tutors in Delhi"
          description="Find verified home tutors in Delhi for Class 1-12, CBSE, ICSE, JEE, NEET and competitive exams"
          telephone={PHONE_NUMBER}
          address={{
            addressLocality: "Delhi",
            addressRegion: "Delhi",
            addressCountry: "IN",
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        <NavBar />

        {/* ========== HERO SECTION ========== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-20 lg:py-28">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
            {/* Google Rating Badge */}
            <motion.a
              href={GOOGLE_BUSINESS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 mb-10 hover:bg-white/20 transition-all group"
            >
              <div className="h-8 w-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-purple-200 font-semibold uppercase tracking-widest">
                  Google Reviews
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">5.0 / 5</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <div className="flex flex-col lg:flex-row lg:items-center gap-16">
              {/* Left Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
                    Find the Right Home Tutor in{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #c084fc 100%)",
                      }}
                    >
                      Delhi
                    </span>
                  </h1>

                  <p className="mt-7 text-lg text-purple-100/90 max-w-2xl leading-relaxed">
                    Connect with <span className="text-white font-semibold">experienced home tutors</span> for{" "}
                    <span className="text-white font-semibold">Class 1–12, CBSE, ICSE, JEE, NEET</span> and
                    more. Get personalized one-to-one tuition from tutors available across Delhi.
                  </p>

                  {/* Trust Pills */}
                  <div className="flex flex-wrap gap-2.5 mt-8">
                    {[
                      { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "Verified Tutors" },
                      { icon: <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />, label: "5/5 Rating" },
                      { icon: <Clock className="h-3.5 w-3.5" />, label: "Free Demo Class" },
                      { icon: <Target className="h-3.5 w-3.5" />, label: "Result Focused" },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3.5 py-1.5 text-xs font-semibold text-white"
                      >
                        {badge.icon}
                        {badge.label}
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      href="/tutors?city=Delhi&source=DELHI_HERO"
                      className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-200"
                    >
                      <Search className="h-4 w-4" />
                      Find a Tutor
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/find-students?source=DELHI_HERO"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 hover:-translate-y-1 transition-all duration-200"
                    >
                      <Users className="h-4 w-4" />
                      Find Students
                    </Link>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-base hover:-translate-y-1 transition-all duration-200"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Us
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Right: Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:w-[360px] shrink-0"
              >
                <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Delhi
                    </h3>
                    <p className="text-xs text-purple-100/70 mt-0.5">Live Tutor Network</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { icon: <Users className="h-5 w-5" />, label: "Active Tutors", value: `${TUTOR_COUNT}+` },
                      { icon: <Heart className="h-5 w-5" />, label: "Happy Families", value: `${HAPPY_FAMILIES}+` },
                      { icon: <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />, label: "Google Rating", value: "5.0/5" },
                      { icon: <Zap className="h-5 w-5" />, label: "Match Time", value: "24 hrs" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-purple-100">
                            {stat.icon}
                          </div>
                          <span className="text-sm text-purple-50/90 font-medium">{stat.label}</span>
                        </div>
                        <span className="text-lg font-black text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== SEARCH / FIND TUTOR SECTION ========== */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                Find Your Perfect Tutor
              </h2>
              <p className="text-gray-600 text-lg">
                Search by area, class, subject, or board
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border-2 border-violet-100 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City / Area</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Saket, Rohini, Dwarka..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none transition">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none transition">
                    <option>Select Subject</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>English</option>
                    <option>Science</option>
                    <option>Hindi</option>
                    <option>Social Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Board</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none transition">
                    <option>Select Board</option>
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                    <option>International</option>
                  </select>
                </div>
              </div>

              <Link
                href="/tutors?city=Delhi"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Search className="h-5 w-5" />
                Find Tutor Now
              </Link>
            </div>
          </div>
        </section>

        {/* ========== WHY CHOOSE TUTVEX ========== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-700 bg-violet-50 border border-violet-200 px-3.5 py-1.5 rounded-full mb-4">
                <Sparkles className="h-3 w-3" />
                Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Why Choose Tutvex for Home Tuition in{" "}
                <span className="text-violet-600">Delhi</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We connect families with verified, experienced tutors who deliver measurable results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6" />,
                  title: "Verified Tutors",
                  description: "Background-checked tutors with verified qualifications and references",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: "Personalized Learning",
                  description: "One-to-one classes tailored to your child's learning pace and style",
                  color: "from-blue-500 to-cyan-600",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Experienced Teachers",
                  description: "Qualified tutors with proven track record in academic excellence",
                  color: "from-violet-500 to-purple-600",
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Flexible Timings",
                  description: "Choose convenient time slots that fit your family schedule",
                  color: "from-orange-500 to-red-600",
                },
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: "Subject Specialists",
                  description: "Expert tutors for Maths, Science, English and all subjects",
                  color: "from-pink-500 to-rose-600",
                },
                {
                  icon: <Award className="h-6 w-6" />,
                  title: "Affordable Fees",
                  description: "Transparent pricing with options to suit different budgets",
                  color: "from-yellow-500 to-amber-600",
                },
                {
                  icon: <Heart className="h-6 w-6" />,
                  title: "Parent-Friendly",
                  description: "Free demo class and easy tutor replacement if not satisfied",
                  color: "from-red-500 to-pink-600",
                },
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Local Matching",
                  description: "Tutors available in your exact neighborhood across Delhi",
                  color: "from-indigo-500 to-blue-600",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CLASSES / ACADEMIC CATEGORIES ========== */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Home Tuition for All <span className="text-violet-600">Classes & Boards</span>
              </h2>
              <p className="text-gray-600 text-lg">
                From primary classes to competitive exams
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Class 1-5", icon: "📚", link: "/tutors?class=1-5&city=Delhi" },
                { name: "Class 6-8", icon: "📖", link: "/tutors?class=6-8&city=Delhi" },
                { name: "Class 9-10", icon: "✏️", link: "/tutors?class=9-10&city=Delhi" },
                { name: "Class 11-12", icon: "🎓", link: "/tutors?class=11-12&city=Delhi" },
                { name: "JEE Foundation", icon: "🔬", link: "/tutors?exam=JEE&city=Delhi" },
                { name: "JEE Main & Advanced", icon: "⚗️", link: "/tutors?exam=JEE&city=Delhi" },
                { name: "NEET", icon: "🩺", link: "/tutors?exam=NEET&city=Delhi" },
                { name: "CBSE", icon: "📐", link: "/tutors?board=CBSE&city=Delhi" },
                { name: "ICSE / ISC", icon: "📝", link: "/tutors?board=ICSE&city=Delhi" },
                { name: "State Boards", icon: "🏫", link: "/tutors?city=Delhi" },
                { name: "International Boards", icon: "🌍", link: "/tutors?city=Delhi" },
                { name: "Competitive Exams", icon: "🏆", link: "/tutors?city=Delhi" },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.link}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-violet-300 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-800 text-center group-hover:text-violet-600 transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SUBJECT-WISE TUTORS ========== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Find Tutors by <span className="text-violet-600">Subject</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Expert subject specialists available in Delhi
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Maths Tutor", icon: "🔢", color: "from-blue-500 to-cyan-500" },
                { name: "Science Tutor", icon: "🔬", color: "from-green-500 to-emerald-500" },
                { name: "Physics Tutor", icon: "⚛️", color: "from-purple-500 to-pink-500" },
                { name: "Chemistry Tutor", icon: "⚗️", color: "from-orange-500 to-red-500" },
                { name: "Biology Tutor", icon: "🧬", color: "from-teal-500 to-green-500" },
                { name: "English Tutor", icon: "📖", color: "from-indigo-500 to-purple-500" },
                { name: "Computer Science Tutor", icon: "💻", color: "from-blue-600 to-indigo-600" },
                { name: "Hindi Tutor", icon: "🗣️", color: "from-yellow-500 to-orange-500" },
                { name: "Social Science Tutor", icon: "🌍", color: "from-emerald-500 to-teal-500" },
                { name: "Accountancy Tutor", icon: "📊", color: "from-violet-500 to-purple-500" },
                { name: "Economics Tutor", icon: "💰", color: "from-pink-500 to-rose-500" },
                { name: "Commerce Tutor", icon: "📈", color: "from-cyan-500 to-blue-500" },
              ].map((subject) => (
                <Link
                  key={subject.name}
                  href={`/tutors?subject=${encodeURIComponent(subject.name.replace(' Tutor', ''))}&city=Delhi`}
                  className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {subject.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-800 text-center group-hover:text-violet-600 transition-colors">
                      {subject.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== DELHI LOCAL AREA SECTION ========== */}
        <section className="py-20 bg-gradient-to-b from-violet-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-700 bg-violet-100 border border-violet-200 px-3.5 py-1.5 rounded-full mb-4">
                <MapPin className="h-3 w-3" />
                Local Coverage
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Find Home Tutors Across <span className="text-violet-600">Delhi</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We cover all major localities in Delhi with verified, experienced tutors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areaKeys.map((key) => {
                const area = DELHI_AREAS[key];
                return (
                  <Link
                    key={key}
                    href={`/delhi/${key}`}
                    className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-violet-300 hover:shadow-xl transition-all p-6"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                          {area.name.charAt(0)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">Delhi</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                        {area.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {area.introduction.substring(0, 100)}...
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {area.localities.slice(0, 3).map((locality) => (
                          <span
                            key={locality}
                            className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-1 rounded-lg"
                          >
                            {locality}
                          </span>
                        ))}
                        {area.localities.length > 3 && (
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                            +{area.localities.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-bold text-violet-600">Find Tutors</span>
                        <ArrowRight className="h-4 w-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                How <span className="text-violet-600">Tutvex</span> Works
              </h2>
              <p className="text-gray-600 text-lg">
                Get started in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Tell Us Your Requirements",
                  description: "Share your class, subject, board, and locality details",
                  icon: <BookOpen className="h-6 w-6" />,
                },
                {
                  step: "2",
                  title: "Get Matched with Tutors",
                  description: "We find 2-3 verified tutors in your area within 24 hours",
                  icon: <Users className="h-6 w-6" />,
                },
                {
                  step: "3",
                  title: "Take a Free Demo",
                  description: "Evaluate teaching style and subject expertise before deciding",
                  icon: <GraduationCap className="h-6 w-6" />,
                },
                {
                  step: "4",
                  title: "Start Learning",
                  description: "Begin personalized one-to-one home tuition with your chosen tutor",
                  icon: <Sparkles className="h-6 w-6" />,
                },
              ].map((item, idx) => (
                <div key={item.step} className="relative">
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-violet-300 to-transparent -z-10" />
                  )}
                  <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg transition-all">
                    <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                      {item.step}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-4 mt-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/tutors?city=Delhi"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <Search className="h-5 w-5" />
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========== FAQ SECTION ========== */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Frequently Asked <span className="text-violet-600">Questions</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to know about home tuition in Delhi
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Find Your Perfect Home Tutor?
            </h2>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Join thousands of families across Delhi who trust Tutvex for quality home tuition
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tutors?city=Delhi"
                className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <Search className="h-5 w-5" />
                Find a Tutor
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:-translate-y-1 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all"
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

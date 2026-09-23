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
import { GURUGRAM_AREAS } from "@/lib/gurugram/gurugramAreas";

/* =========================
   CONSTANTS
========================= */
const PHONE_NUMBER = "+919305275932";
const WHATSAPP_NUMBER = "919305275932";
const WHATSAPP_DEFAULT_MSG = "Hello%2C%20I%20need%20a%20home%20tutor%20in%20Gurugram";
const GOOGLE_BUSINESS_LINK = "https://share.google/9srzoEeknq8tpchsp";

const TUTOR_COUNT = 1500;
const HAPPY_FAMILIES = 12000;

/* =========================
   FAQ DATA
========================= */
const FAQS = [
  {
    q: "How can I find a home tutor in Gurugram (Gurgaon)?",
    a: "Simply visit Tutvex, select your area in Gurugram (like DLF Phase, Golf Course Road, Sushant Lok, etc.), choose your class and subject requirements, and we'll connect you with verified tutors in your locality within 24 hours. You can take a free demo class before confirming.",
  },
  {
    q: "Are tutors on Tutvex background verified?",
    a: "Yes, absolutely. Every tutor on Tutvex undergoes a comprehensive verification process including ID proof check, qualification verification, and reference checks. We also continuously collect parent feedback to maintain quality.",
  },
  {
    q: "What subjects and classes do you cover in Gurugram?",
    a: "We cover all subjects from Class 1 to Class 12 including Maths, Science, Physics, Chemistry, Biology, English, Hindi, Social Science, and more. We also provide specialized tutors for JEE, NEET, CBSE, ICSE, and competitive exam preparation.",
  },
  {
    q: "Can I get a free demo class?",
    a: "Yes! Tutvex offers a completely free demo class with your selected tutor. You can evaluate their teaching style, communication, and subject expertise before making any payment commitment.",
  },
  {
    q: "What are the home tuition fees in Gurugram?",
    a: "Home tuition fees in Gurugram typically range from ₹600 to ₹2500 per month depending on class level, subject, tutor experience, and location. Contact us for a customized quote based on your specific requirements.",
  },
  {
    q: "Do you provide female tutors in Gurugram?",
    a: "Yes, we have both male and female tutors available across all areas of Gurugram. You can specify your preference when making a tutor request, and we'll match you accordingly.",
  },
  {
    q: "How quickly can I get a tutor in Gurugram?",
    a: "Typically within 24 to 48 hours. We match you with 2-3 verified tutors based on your requirements, and you can take a free demo class to decide which tutor suits best.",
  },
  {
    q: "Do you provide tutors for CBSE and ICSE boards in Gurgaon?",
    a: "Yes, we have experienced tutors for both CBSE and ICSE boards across all areas of Gurgaon. Our tutors are familiar with the respective board syllabus and examination patterns.",
  },
  {
    q: "Can I get a JEE or NEET tutor in Gurugram?",
    a: "Absolutely. Tutvex has specialized JEE and NEET tutors in Gurugram who provide focused coaching for Physics, Chemistry, Maths, and Biology with proven teaching methods and regular test preparation.",
  },
  {
    q: "Which areas of Gurugram do you cover?",
    a: "We cover all major areas of Gurugram including DLF Phase 1-5, Golf Course Road, Sushant Lok, Sohna Road, MG Road, Palam Vihar, Old Gurgaon, Dwarka Expressway, New Gurgaon, Manesar, and all nearby sectors.",
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
export default function GurugramCityPage() {
  const areaKeys = Object.keys(GURUGRAM_AREAS);

  return (
    <>
      <Head>
        <title>Home Tutor in Gurugram (Gurgaon) | Home Tuition | Tutvex</title>
        <meta
          name="description"
          content="Find verified home tutors in Gurugram (Gurgaon) for Class 1-12, CBSE, ICSE, JEE, NEET. Expert home tuition across DLF Phase, Golf Course Road, Sushant Lok and all areas. Free demo class."
        />
        <meta
          name="keywords"
          content="home tutor in Gurugram, home tutor in Gurgaon, home tuition in Gurugram, private tutor Gurugram, home tutor near me Gurgaon, CBSE tutor Gurugram, ICSE tutor Gurgaon, JEE tutor Gurugram, NEET tutor Gurgaon, home tuition near me, best home tutor Gurugram"
        />
        <link rel="canonical" href="https://tutvex.com/gurugram" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Home Tutor in Gurugram (Gurgaon) | Tutvex" />
        <meta
          property="og:description"
          content="Find verified home tutors in Gurugram for all classes, CBSE, ICSE, JEE, NEET. Book free demo class."
        />
        <meta property="og:url" content="https://tutvex.com/gurugram" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Tutor in Gurugram (Gurgaon) | Tutvex" />
        <meta
          name="twitter:description"
          content="Find verified home tutors in Gurugram for all classes. Free demo class available."
        />
      </Head>

      <div className="min-h-screen bg-white">
        <NavBar />

        {/* ========== HERO SECTION ========== */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80')",
            }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative w-full max-w-7xl mx-auto px-4 py-16 lg:py-20">
            {/* Google Rating Badge */}
            <motion.a
              href={GOOGLE_BUSINESS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 rounded-2xl bg-white/8 backdrop-blur-md border border-white/15 px-5 py-3 mb-10 hover:bg-white/15 transition-all group"
            >
              <div className="h-8 w-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-purple-300 font-semibold uppercase tracking-widest">
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
              <ArrowRight className="h-4 w-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <div className="flex flex-col lg:flex-row lg:items-center gap-16">
              {/* Left Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                    <span className="text-white">Find the Right</span>
                    <br />
                    <span className="text-white">Home Tutor in</span>
                    <br />
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fbbf24 100%)",
                      }}
                    >
                      Gurugram
                    </span>
                  </h1>

                  <p className="mt-7 text-lg text-purple-200/80 max-w-2xl leading-relaxed">
                    Connect with <span className="text-white font-semibold">verified tutors</span> for{" "}
                    <span className="text-white font-semibold">Class 1–12, CBSE, ICSE, JEE, NEET</span> and
                    other academic needs. Get personalized one-to-one learning at your home.
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
                        className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white"
                      >
                        {badge.icon}
                        {badge.label}
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                      href="/tutors?city=Gurugram&source=GURUGRAM_HERO"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-200"
                    >
                      <Search className="h-4 w-4" />
                      Find a Tutor
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/find-students?source=GURUGRAM_HERO"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/25 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/18 hover:-translate-y-1 transition-all duration-200"
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
                <div className="rounded-3xl bg-white/6 backdrop-blur-xl border border-white/12 overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-violet-500/20 to-pink-500/15">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Gurugram (Gurgaon)
                    </h3>
                    <p className="text-xs text-purple-200/60 mt-0.5">Live Tutor Network</p>
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
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-300">
                            {stat.icon}
                          </div>
                          <span className="text-sm text-purple-100/85 font-medium">{stat.label}</span>
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
                      placeholder="DLF Phase, Sushant Lok..."
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
                href="/tutors?city=Gurugram"
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
                <span className="text-violet-600">Gurugram</span>?
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
                  description: "Tutors available in your exact neighborhood across Gurugram",
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
                { name: "Class 1-5", icon: "📚", link: "/tutors?class=1-5&city=Gurugram" },
                { name: "Class 6-8", icon: "📖", link: "/tutors?class=6-8&city=Gurugram" },
                { name: "Class 9-10", icon: "✏️", link: "/tutors?class=9-10&city=Gurugram" },
                { name: "Class 11-12", icon: "🎓", link: "/tutors?class=11-12&city=Gurugram" },
                { name: "JEE Foundation", icon: "🔬", link: "/tutors?exam=JEE&city=Gurugram" },
                { name: "JEE Main & Advanced", icon: "⚗️", link: "/tutors?exam=JEE&city=Gurugram" },
                { name: "NEET", icon: "🩺", link: "/tutors?exam=NEET&city=Gurugram" },
                { name: "CBSE", icon: "📐", link: "/tutors?board=CBSE&city=Gurugram" },
                { name: "ICSE / ISC", icon: "📝", link: "/tutors?board=ICSE&city=Gurugram" },
                { name: "State Boards", icon: "🏫", link: "/tutors?city=Gurugram" },
                { name: "International Boards", icon: "🌍", link: "/tutors?city=Gurugram" },
                { name: "Competitive Exams", icon: "🏆", link: "/tutors?city=Gurugram" },
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
                Expert subject specialists available in Gurugram
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
                  href={`/tutors?subject=${encodeURIComponent(subject.name.replace(' Tutor', ''))}&city=Gurugram`}
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

        {/* ========== GURUGRAM LOCAL AREA SECTION ========== */}
        <section className="py-20 bg-gradient-to-b from-violet-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-700 bg-violet-100 border border-violet-200 px-3.5 py-1.5 rounded-full mb-4">
                <MapPin className="h-3 w-3" />
                Local Coverage
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Find Home Tutors Across <span className="text-violet-600">Gurugram</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We cover all major localities in Gurugram (Gurgaon) with verified, experienced tutors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
              {areaKeys.map((areaKey) => {
                const area = GURUGRAM_AREAS[areaKey];
                return (
                  <Link
                    key={area.slug}
                    href={`/gurugram/${area.slug}`}
                    className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-violet-300 hover:shadow-xl transition-all"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-xl shrink-0">
                        📍
                      </div>
                      <ArrowRight className="h-4 w-4 text-violet-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                      {area.displayName}
                    </h3>
                    
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
                      Home tutors for CBSE, ICSE, JEE, NEET in {area.name}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-violet-600 font-semibold">
                      <MapPin className="h-3 w-3" />
                      <span>{area.localities.length} localities</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Can't Find Area */}
            <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-white border-2 border-dashed border-violet-300">
              <MapPin className="h-12 w-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Can't find your area?
              </h3>
              <p className="text-gray-600 mb-6">
                Tell us your locality and we'll help you find a suitable tutor nearby
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/tutors?city=Gurugram"
                  className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <Search className="h-4 w-4" />
                  Find a Tutor
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                How <span className="text-violet-600">Tutvex</span> Works
              </h2>
              <p className="text-gray-600 text-lg">
                Get matched with the perfect tutor in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Tell Us What You Need",
                  description: "Share your requirements: class, subject, area, and preferred timings",
                  icon: <Search className="h-6 w-6" />,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "2",
                  title: "Get Matched with Tutors",
                  description: "We connect you with 2-3 verified tutors based on your needs",
                  icon: <Users className="h-6 w-6" />,
                  color: "from-violet-500 to-purple-500",
                },
                {
                  step: "3",
                  title: "Take a Free Demo Class",
                  description: "Evaluate the tutor's teaching style with a complimentary trial class",
                  icon: <GraduationCap className="h-6 w-6" />,
                  color: "from-pink-500 to-rose-500",
                },
                {
                  step: "4",
                  title: "Start Learning",
                  description: "Begin your personalized learning journey at home",
                  icon: <CheckCircle className="h-6 w-6" />,
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-violet-200 to-transparent -translate-x-1/2" />
                  )}

                  <div className="relative text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center font-black text-violet-600 text-sm">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Find Your Perfect Home Tutor in Gurugram Today
              </h2>
              <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
                Join thousands of satisfied families across Gurugram who trust Tutvex for quality home tuition
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/tutors?city=Gurugram"
                  className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <Search className="h-5 w-5" />
                  Find a Tutor
                </Link>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/25 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== FAQ SECTION ========== */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to know about home tuition in Gurugram
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <FAQItem key={idx} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== SEO CONTENT (HIDDEN) ========== */}
        <section className="sr-only" aria-hidden="false">
          <div className="max-w-7xl mx-auto px-6">
            <h2>Home Tutors in Gurugram (Gurgaon) – Complete Guide</h2>
            
            <h3>Best Home Tutors in Gurugram for CBSE, ICSE, NEET & JEE</h3>
            <p>
              Tutvex provides verified home tutors in Gurugram (Gurgaon) for all classes from Class 1 to Class 12.
              Our tutors cover CBSE, ICSE, ISC, and State Board syllabus across all major subjects including
              Mathematics, Physics, Chemistry, Biology, English, Hindi, and Social Science. We specialize in
              providing personalized one-to-one home tuition that delivers measurable academic results.
            </p>

            <h3>Home Tutors in Gurugram by Area</h3>
            <ul>
              <li>Home tutor in DLF Phase Gurgaon (Phase 1, 2, 3, 4, 5, DLF City)</li>
              <li>Home tutor in Golf Course Road Gurugram (Sectors 53, 54, 55, 56)</li>
              <li>Home tutor in MG Road and Sikanderpur Gurgaon</li>
              <li>Home tutor in Sushant Lok Gurugram (Sushant Lok 1, 2, 3, South City)</li>
              <li>Home tutor in Sohna Road Gurgaon (Sectors 47-71)</li>
              <li>Home tutor in Palam Vihar Gurugram (Sectors 21, 22, 23)</li>
              <li>Home tutor in Old Gurgaon (Sectors 14-18)</li>
              <li>Home tutor in Dwarka Expressway Gurugram (Sectors 81-93)</li>
              <li>Home tutor in New Gurgaon (Sectors 90-105)</li>
              <li>Home tutor in Manesar Gurgaon (IMT Manesar)</li>
            </ul>

            <h3>Home Tutors by Subject in Gurugram</h3>
            <ul>
              <li>Mathematics home tutor in Gurugram for all classes</li>
              <li>Physics home tutor in Gurgaon for Class 11, 12, JEE</li>
              <li>Chemistry home tutor in Gurugram for NEET, JEE, CBSE</li>
              <li>Biology home tutor in Gurgaon for NEET, Class 11, 12</li>
              <li>English home tutor in Gurugram for all classes</li>
              <li>Hindi home tutor in Gurgaon for CBSE students</li>
              <li>Science home tutor in Gurugram for Class 6, 7, 8, 9, 10</li>
              <li>Accountancy and Commerce tutor in Gurgaon</li>
              <li>Computer Science tutor in Gurugram</li>
              <li>Social Science tutor in Gurgaon</li>
            </ul>

            <h3>Competitive Exam Tutors in Gurugram</h3>
            <ul>
              <li>JEE Main and JEE Advanced home tutor in Gurugram</li>
              <li>NEET home tutor in Gurgaon for medical entrance preparation</li>
              <li>Foundation courses for JEE and NEET in Gurugram</li>
              <li>CUET tutor in Gurgaon</li>
              <li>Olympiad preparation tutor in Gurugram</li>
              <li>NTSE coaching at home in Gurgaon</li>
            </ul>

            <h3>Home Tutors for Top Schools in Gurugram</h3>
            <ul>
              <li>Tutor for DPS DLF City Gurgaon students</li>
              <li>Tutor for The Shri Ram School Gurugram</li>
              <li>Tutor for Pathways World School Gurgaon</li>
              <li>Tutor for Scottish High International School Gurugram</li>
              <li>Tutor for GD Goenka Public School Gurgaon</li>
              <li>Tutor for Shiv Nadar School Gurugram</li>
              <li>Tutor for Lancers International School Gurgaon</li>
              <li>Tutor for Amity International School Gurugram</li>
              <li>Tutor for Suncity School Gurgaon</li>
              <li>Tutor for DAV Public School Gurugram</li>
            </ul>

            <h3>Why Choose Tutvex for Home Tutoring in Gurugram?</h3>
            <p>
              Tutvex is Gurugram's most trusted home tutoring platform with 1500+ verified tutors
              available across all localities. Every tutor is background checked, qualification verified,
              and parent approved. We offer a free demo class before any commitment, flexible scheduling,
              and weekly progress tracking for every student. Our tutors understand the competitive
              academic environment of Gurgaon and provide result-focused home tuition.
            </p>

            <h3>Frequently Asked Questions – Home Tutors in Gurugram</h3>
            <dl>
              <dt>How much does a home tutor cost in Gurugram?</dt>
              <dd>
                Home tutor fees in Gurugram range from ₹600 to ₹2500 per month depending on the subject,
                class level, tutor experience, and location. Premium areas like DLF Phase and Golf Course Road
                may have slightly higher rates. Contact Tutvex for a free customized quote.
              </dd>
              
              <dt>How do I find a verified home tutor in Gurgaon?</dt>
              <dd>
                Visit Tutvex and select your area in Gurugram, class, and subject. We match you with 2 to 3
                verified tutors within 24 hours. You can review their profiles, qualifications, and take a
                free demo class before confirming.
              </dd>
              
              <dt>Are Tutvex tutors available for home visits in DLF Phase and Sushant Lok?</dt>
              <dd>
                Yes. Tutvex has verified home tutors available in DLF Phase 1-5, Sushant Lok 1-3, Golf Course Road,
                MG Road, Sohna Road, and all other major localities of Gurugram. Our tutors provide home-based
                tuition at your convenience.
              </dd>
              
              <dt>Can I get a female tutor for home tuition in Gurugram?</dt>
              <dd>
                Yes, you can specify your preference for a male or female tutor when making your request.
                We have both male and female tutors available across all subjects and areas in Gurugram.
              </dd>
              
              <dt>Do you provide CBSE and ICSE tutors in Gurgaon?</dt>
              <dd>
                Yes, we have experienced tutors for both CBSE and ICSE boards across all classes and subjects
                in Gurgaon. Our tutors are familiar with the respective board patterns and syllabus.
              </dd>
            </dl>
          </div>
        </section>

        <Footer />
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Tutvex Home Tuition Gurugram",
            "description": "Find verified home tutors in Gurugram (Gurgaon) for Class 1-12, CBSE, ICSE, JEE, NEET",
            "url": "https://tutvex.com/gurugram",
            "telephone": PHONE_NUMBER,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Gurugram",
              "addressRegion": "Haryana",
              "addressCountry": "IN",
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "250",
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Gurugram",
              },
              {
                "@type": "City",
                "name": "Gurgaon",
              },
            ],
          }),
        }}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 86400, // Revalidate once per day
  };
};

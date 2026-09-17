import React, { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import {
  FaBook,
  FaUserGraduate,
  FaFileAlt,
  FaClipboardList,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaChevronRight,
  FaBrain,
  // FaFlask,
  FaCalculator,
  FaLanguage,
  FaFemale,
  FaHome,
  FaLaptop,
  FaGraduationCap,
  // FaAtom,
  FaCode,
  // FaMusic,
  FaPaintBrush,
  // FaDumbbell,
  // FaChess,
  FaBusinessTime,
  FaShieldAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  // Legend,
} from "recharts";

/* ═══════════════════════════════════════════════
   DATA — CITIES
═══════════════════════════════════════════════ */

const runningCities = [
  { name: "Prayagraj", slug: "allahabad", state: "UP" },
  { name: "Varanasi", slug: "india/banaras", state: "UP" },
  { name: "Lucknow", slug: "lucknow", state: "UP" },
  { name: "Kanpur", slug: "kanpur", state: "UP" },
  { name: "Noida", slug: "india/noida", state: "UP" },
  { name: "Agra", slug: "india/agra", state: "UP" },
  { name: "Meerut", slug: "india/meerut", state: "UP" },
];

const upcomingCities = [
  { name: "Delhi", slug: "india/delhi", state: "Delhi" },
  { name: "Gurugram", slug: "india/gurugram", state: "HR" },
  { name: "Faridabad", slug: "india/faridabad", state: "HR" },
  { name: "Jaipur", slug: "india/jaipur", state: "RJ" },
  { name: "Jodhpur", slug: "india/jodhpur", state: "RJ" },
  { name: "Udaipur", slug: "india/udaipur", state: "RJ" },
  { name: "Kota", slug: "india/kota", state: "RJ" },
  { name: "Patna", slug: "india/patna", state: "BR" },
  { name: "Ranchi", slug: "india/ranchi", state: "JH" },
  { name: "Bhopal", slug: "india/bhopal", state: "MP" },
  { name: "Indore", slug: "india/indore", state: "MP" },
  { name: "Nagpur", slug: "india/nagpur", state: "MH" },
];

/* ═══════════════════════════════════════════════
   DATA — SERVICES  (comprehensive)
═══════════════════════════════════════════════ */

const allServiceCategories = [
  {
    category: "Home & Private Tutors",
    icon: <FaHome />,
    color: "blue",
    services: ["Home Tutor", "Private Tutor", "Personal Tutor", "Individual Tutor", "One-on-One Tutor"],
  },
  {
    category: "Maths & Science",
    icon: <FaCalculator />,
    color: "cyan",
    services: [
      "Maths Tutor", "Science Tutor", "Physics Tutor", "Chemistry Tutor",
      "Biology Tutor", "Statistics Tutor", "Algebra Tutor", "Geometry Tutor",
      "Calculus Tutor", "Trigonometry Tutor",
    ],
  },
  {
    category: "Competitive Exams",
    icon: <FaBrain />,
    color: "indigo",
    services: [
      "JEE Tutor", "NEET Tutor", "UPSC Tutor", "NDA Tutor", "CDS Tutor",
      "SSC Tutor", "Bank PO Tutor", "CAT Tutor", "GMAT Tutor", "GRE Tutor",
      "CLAT Tutor", "CUET Tutor",
    ],
  },
  {
    category: "Board Exam Tutors",
    icon: <FaBook />,
    color: "violet",
    services: [
      "CBSE Tutor", "ICSE Tutor", "ISC Tutor", "UP Board Tutor",
      "MP Board Tutor", "Bihar Board Tutor", "RBSE Tutor", "State Board Tutor",
    ],
  },
  {
    category: "Language & English",
    icon: <FaLanguage />,
    color: "emerald",
    services: [
      "English Tutor", "Hindi Tutor", "Sanskrit Tutor", "French Tutor",
      "German Tutor", "Spanish Tutor", "English Speaking Tutor", "IELTS Tutor",
      "TOEFL Tutor", "Creative Writing Tutor",
    ],
  },
  {
    category: "Online Tutoring",
    icon: <FaLaptop />,
    color: "sky",
    services: [
      "Online Tuition", "Maths Online", "Science Online", "JEE Online Coaching",
      "NEET Online Coaching", "CBSE Online Tutor", "Online Home Tutor",
      "Live Online Classes", "Recorded Classes", "Online Test Series",
    ],
  },
  {
    category: "Female Tutors",
    icon: <FaFemale />,
    color: "pink",
    services: [
      "Female Tutor", "Female Home Tutor", "Female Maths Tutor",
      "Female Science Tutor", "Female English Tutor", "Female CBSE Tutor",
      "Female JEE Tutor", "Female NEET Tutor",
    ],
  },
  {
    category: "School Level",
    icon: <FaGraduationCap />,
    color: "amber",
    services: [
      "Primary Tutor", "Class 6 Tutor", "Class 7 Tutor", "Class 8 Tutor",
      "Class 9 Tutor", "Class 10 Tutor", "Class 11 Tutor", "Class 12 Tutor",
      "Nursery Tutor", "Kindergarten Tutor", "Playgroup Tutor",
    ],
  },
  {
    category: "Coding & Tech",
    icon: <FaCode />,
    color: "teal",
    services: [
      "Coding Tutor", "Python Tutor", "Java Tutor", "Web Development Tutor",
      "Computer Science Tutor", "AI & ML Tutor", "Data Science Tutor",
      "C++ Tutor", "App Development Tutor",
    ],
  },
  {
    category: "Arts, Music & Sports",
    icon: <FaPaintBrush />,
    color: "rose",
    services: [
      "Music Tutor", "Guitar Tutor", "Keyboard Tutor", "Violin Tutor",
      "Drawing & Painting Tutor", "Dance Tutor", "Chess Tutor",
      "Yoga Tutor", "Sports Coach", "Drama Tutor",
    ],
  },
];

/* ═══════════════════════════════════════════════
   DATA — CITY-SPECIFIC LINKS (Offline)
═══════════════════════════════════════════════ */

const offlineDetailedLinks = [
  {
    city: "Prayagraj (Allahabad)",
    slug: "allahabad",
    areas: ["Civil Lines", "George Town", "Naini", "Phaphamau", "Jhunsi"],
    links: [
      { label: "Home Tutor", href: "/allahabad" },
      { label: "Maths Tutor", href: "/allahabad/allahabad/maths-tutor" },
      { label: "JEE Tutor", href: "/allahabad/allahabad/jee-tutor" },
      { label: "NEET Tutor", href: "/allahabad/allahabad/neet-tutor" },
      { label: "CBSE Tutor", href: "/allahabad/allahabad/cbse-tutor" },
      { label: "Female Tutor", href: "/allahabad/allahabad/female-tutor" },
    ],
  },
  {
    city: "Varanasi",
    slug: "india/banaras",
    areas: ["Mahmoorganj", "Lanka", "Sigra", "BHU Area", "Godowlia"],
    links: [
      { label: "Home Tutor", href: "/india/banaras" },
      { label: "Maths Tutor", href: "/india/banaras/mahmoorganj/math-tutor" },
      { label: "JEE Tutor", href: "/india/banaras/mahmoorganj/jee-tuto" },
      { label: "NEET Tutor", href: "/india/banaras/mahmoorganj/neet-tutor" },
      { label: "CBSE Tutor", href: "/india/banaras/sigra/cbse-tutor" },
      { label: "Science Tutor", href: "/india/banaras/lanka/science-tutor" },
    ],
  },
  {
    city: "Lucknow",
    slug: "lucknow",
    areas: ["Gomti Nagar", "Hazratganj", "Hasanganj", "Vibhuti Khand", "Aliganj"],
    links: [
      { label: "Home Tutor", href: "/lucknow" },
      { label: "ICSE Tutor", href: "/lucknow/Hasanganj/icse-tutor" },
      { label: "JEE Tutor", href: "/lucknow/Gomti%20Nagar/jee-tutor" },
      { label: "NEET Tutor", href: "/lucknow/Vibhuti%20Khand/neet-tutor" },
      { label: "CBSE Tutor", href: "/lucknow/Aliganj/cbse-tutor" },
      { label: "Female Tutor", href: "/lucknow/Hazratganj/female-tutor" },
    ],
  },
  {
    city: "Kanpur",
    slug: "kanpur",
    areas: ["Civil Lines", "Yashoda Nagar", "Kakadeo", "Swaroop Nagar", "Karachi Khana"],
    links: [
      { label: "Home Tutor", href: "/kanpur" },
      { label: "Private Tutor", href: "/kanpur/Civil%20Lines/private-tutor" },
      { label: "JEE Tutor", href: "/kanpur/Yashoda%20Nagar/jee-tutor" },
      { label: "NEET Tutor", href: "/kanpur/Karachi%20Khana/neet-tutor" },
      { label: "Maths Tutor", href: "/kanpur/Kakadeo/maths-tutor" },
      { label: "Science Tutor", href: "/kanpur/Swaroop%20Nagar/science-tutor" },
    ],
  },
  {
    city: "Noida",
    slug: "india/noida",
    areas: ["Sector 63", "Greater Noida West", "Techzone 4", "Sector 18", "Sector 50"],
    links: [
      { label: "Home Tutor", href: "/india/noida" },
      { label: "Private Tutor", href: "/india/noida/Sector%2063/private-tutor" },
      { label: "JEE Tutor", href: "/india/noida/Greater%20Noida%20West/jee-tutor" },
      { label: "NEET Tutor", href: "/india/noida/Techzone%204/neet-tutor" },
      { label: "CBSE Tutor", href: "/india/noida/Sector%2018/cbse-tutor" },
      { label: "Coding Tutor", href: "/india/noida/Sector%2050/coding-tutor" },
    ],
  },
  {
    city: "Agra",
    slug: "india/agra",
    areas: ["Civil Lines", "Mantola", "Kamla Nagar", "Tajganj", "Bodla"],
    links: [
      { label: "Home Tutor", href: "/india/agra" },
      { label: "Private Tutor", href: "/india/agra/Civil%20Lines/private-tutor" },
      { label: "JEE Tutor", href: "/india/agra/Mantola/jee-tutor" },
      { label: "NEET Tutor", href: "/india/agra/Kamla%20Nagar/neet-tutor" },
      { label: "Maths Tutor", href: "/india/agra/Tajganj/maths-tutor" },
      { label: "Female Tutor", href: "/india/agra/Bodla/female-tutor" },
    ],
  },
  {
    city: "Meerut",
    slug: "india/meerut",
    areas: ["Begum Bridge", "Jagriti Vihar", "Shradhapuri", "Pallavpuram", "Saket"],
    links: [
      { label: "Home Tutor", href: "/india/meerut" },
      { label: "Private Tutor", href: "/india/meerut/Begum%20Bridge/private-tutor" },
      { label: "JEE Tutor", href: "/india/meerut/Jagriti%20Vihar/jee-tutor" },
      { label: "NEET Tutor", href: "/india/meerut/Shradhapuri/neet-tutor" },
      { label: "CBSE Tutor", href: "/india/meerut/Pallavpuram/cbse-tutor" },
      { label: "Science Tutor", href: "/india/meerut/Saket/science-tutor" },
    ],
  },
];

/* ═══════════════════════════════════════════════
   DATA — ONLINE / GLOBAL
═══════════════════════════════════════════════ */

const onlineGlobalLinks = [
  {
    region: "🌐 Online India",
    color: "blue",
    links: [
      { label: "Online Tuition", href: "/country/india/online-tuition" },
      { label: "Maths Online", href: "/country/india/maths-online" },
      { label: "Science Online", href: "/country/india/science-online" },
      { label: "JEE Online Coaching", href: "/country/india/jee-online-coaching" },
      { label: "NEET Online Coaching", href: "/country/india/neet-online-coaching" },
      { label: "CBSE Online Tutor", href: "/country/india/cbse-online-tutor" },
      { label: "Online Home Tutor", href: "/country/india/online-home-tutor" },
      { label: "Live Online Classes", href: "/country/india/live-online-classes" },
    ],
  },
  {
    region: "🇬🇧 United Kingdom",
    color: "rose",
    links: [
      { label: "UK Tutoring", href: "/country/uk/uk-tutoring" },
      { label: "Home Tutor UK", href: "/country/uk/home-tutor-uk" },
      { label: "Online Tutor UK", href: "/country/uk/online-tutor-uk" },
      { label: "GCSE Tutor UK", href: "/country/uk/gcse-tutor-uk" },
      { label: "A-Level Tutor UK", href: "/country/uk/a-level-tutor-uk" },
      { label: "Tutor Job UK", href: "/country/uk/tutor-job-uk" },
      { label: "Maths Tutor UK", href: "/country/uk/maths-tutor-uk" },
      { label: "Science Tutor UK", href: "/country/uk/science-tutor-uk" },
    ],
  },
  {
    region: "🇨🇦 Canada",
    color: "red",
    links: [
      { label: "Canada Tutoring", href: "/country/canada/canada-tutoring" },
      { label: "Home Tutor Canada", href: "/country/canada/home-tutor-canada" },
      { label: "Online Tutor Canada", href: "/country/canada/online-tutor-canada" },
      { label: "Toronto Tutor", href: "/country/canada/toronto-tutor" },
      { label: "Maths Tutor Canada", href: "/country/canada/maths-tutor-canada" },
      { label: "Tutor Job Canada", href: "/country/canada/tutor-job-canada" },
      { label: "Vancouver Tutor", href: "/country/canada/vancouver-tutor" },
      { label: "Calgary Tutor", href: "/country/canada/calgary-tutor" },
    ],
  },
  {
    region: "🇦🇪 UAE",
    color: "amber",
    links: [
      { label: "Home Tutor UAE", href: "/country/uae/home-tutor-uae" },
      { label: "Online Tutor Dubai", href: "/country/uae/online-tutor-dubai" },
      { label: "Tutor Abu Dhabi", href: "/country/uae/tutor-abu-dhabi" },
      { label: "CBSE Tutor Dubai", href: "/country/uae/cbse-tutor-dubai" },
      { label: "Maths Tutor UAE", href: "/country/uae/maths-tutor-uae" },
      { label: "Tutor Job UAE", href: "/country/uae/tutor-job-uae" },
      { label: "IB Tutor Dubai", href: "/country/uae/ib-tutor-dubai" },
      { label: "Sharjah Tutor", href: "/country/uae/sharjah-tutor" },
    ],
  },
  {
    region: "🇸🇬 Singapore",
    color: "emerald",
    links: [
      { label: "Home Tutor Singapore", href: "/country/singapore/home-tutor-singapore" },
      { label: "Online Tutor SG", href: "/country/singapore/online-tutor-sg" },
      { label: "Maths Tutor SG", href: "/country/singapore/maths-tutor-sg" },
      { label: "Primary Tutor SG", href: "/country/singapore/primary-tutor-sg" },
      { label: "Tutor Job Singapore", href: "/country/singapore/tutor-job-singapore" },
      { label: "Science Tutor SG", href: "/country/singapore/science-tutor-sg" },
    ],
  },
  {
    region: "🇦🇺 Australia",
    color: "orange",
    links: [
      { label: "Home Tutor Australia", href: "/country/australia/home-tutor-australia" },
      { label: "Online Tutor AU", href: "/country/australia/online-tutor-au" },
      { label: "Sydney Tutor", href: "/country/australia/sydney-tutor" },
      { label: "Melbourne Tutor", href: "/country/australia/melbourne-tutor" },
      { label: "Maths Tutor AU", href: "/country/australia/maths-tutor-au" },
      { label: "Tutor Job Australia", href: "/country/australia/tutor-job-australia" },
      { label: "Brisbane Tutor", href: "/country/australia/brisbane-tutor" },
      { label: "Perth Tutor", href: "/country/australia/perth-tutor" },
    ],
  },
  {
    region: "🇺🇸 USA",
    color: "blue",
    links: [
      { label: "Online Tutor USA", href: "/country/usa/online-tutor-usa" },
      { label: "Home Tutor USA", href: "/country/usa/home-tutor-usa" },
      { label: "New York Tutor", href: "/country/usa/new-york-tutor" },
      { label: "SAT Tutor USA", href: "/country/usa/sat-tutor-usa" },
      { label: "ACT Tutor USA", href: "/country/usa/act-tutor-usa" },
      { label: "Tutor Job USA", href: "/country/usa/tutor-job-usa" },
    ],
  },
  {
    region: "🇳🇿 New Zealand",
    color: "teal",
    links: [
      { label: "Home Tutor NZ", href: "/country/newzealand/home-tutor-nz" },
      { label: "Online Tutor NZ", href: "/country/newzealand/online-tutor-nz" },
      { label: "Auckland Tutor", href: "/country/newzealand/auckland-tutor" },
      { label: "Maths Tutor NZ", href: "/country/newzealand/maths-tutor-nz" },
      { label: "Tutor Job NZ", href: "/country/newzealand/tutor-job-nz" },
    ],
  },
];

/* ═══════════════════════════════════════════════
   DATA — COMPANY PAGES
═══════════════════════════════════════════════ */

const companyLinks = [
  { name: "About Us", href: "/about", icon: <FaUserGraduate />, desc: "Our story & mission" },
  { name: "Contact Us", href: "/contact", icon: <FaEnvelope />, desc: "Get in touch" },
  { name: "Privacy Policy", href: "/privacy", icon: <FaShieldAlt />, desc: "How we protect your data" },
  { name: "Refund Policy", href: "/refund", icon: <FaClipboardList />, desc: "Our refund process" },
  { name: "Terms & Conditions", href: "/terms", icon: <FaFileAlt />, desc: "Rules & guidelines" },
  { name: "Become a Tutor", href: "/tutor-flow/tutor-registration", icon: <FaGraduationCap />, desc: "Join our tutor network" },
  { name: "Find a Tutor", href: "/tutors", icon: <FaHome />, desc: "Browse all tutors" },
  { name: "How it Works", href: "/how-it-works", icon: <FaBusinessTime />, desc: "Platform overview" },
  { name: "Subjects", href: "/subjects", icon: <FaBook />, desc: "All subjects offered" },
  { name: "Pricing", href: "/pricing", icon: <FaClipboardList />, desc: "Plans & packages" },
];

/* ═══════════════════════════════════════════════
   CHART DATA
═══════════════════════════════════════════════ */

const barData = [
  { name: "Running\nCities", count: runningCities.length, fill: "#3b82f6" },
  { name: "Upcoming\nCities", count: upcomingCities.length, fill: "#818cf8" },
  { name: "Service\nCategories", count: allServiceCategories.length, fill: "#06b6d4" },
  { name: "Global\nRegions", count: onlineGlobalLinks.length, fill: "#10b981" },
];

const pieData = allServiceCategories.map((cat) => ({
  name: cat.category,
  value: cat.services.length,
}));
const PIE_COLORS = ["#3b82f6","#06b6d4","#6366f1","#8b5cf6","#10b981","#0ea5e9","#ec4899","#f59e0b","#14b8a6","#f43f5e"];

const colorMap: Record<string, string> = {
  blue:    "bg-blue-50 border-blue-200 text-blue-700",
  cyan:    "bg-cyan-50 border-cyan-200 text-cyan-700",
  indigo:  "bg-indigo-50 border-indigo-200 text-indigo-700",
  violet:  "bg-violet-50 border-violet-200 text-violet-700",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  sky:     "bg-sky-50 border-sky-200 text-sky-700",
  pink:    "bg-pink-50 border-pink-200 text-pink-700",
  amber:   "bg-amber-50 border-amber-200 text-amber-700",
  teal:    "bg-teal-50 border-teal-200 text-teal-700",
  rose:    "bg-rose-50 border-rose-200 text-rose-700",
  red:     "bg-red-50 border-red-200 text-red-700",
  orange:  "bg-orange-50 border-orange-200 text-orange-700",
};

const headColorMap: Record<string, string> = {
  blue:    "from-blue-600 to-cyan-500",
  cyan:    "from-cyan-600 to-teal-500",
  indigo:  "from-indigo-600 to-violet-500",
  violet:  "from-violet-600 to-purple-500",
  emerald: "from-emerald-600 to-green-500",
  sky:     "from-sky-600 to-blue-400",
  pink:    "from-pink-600 to-rose-400",
  amber:   "from-amber-500 to-orange-400",
  teal:    "from-teal-600 to-emerald-500",
  rose:    "from-rose-600 to-pink-500",
  red:     "from-red-600 to-rose-500",
  orange:  "from-orange-500 to-amber-400",
};

/* ═══════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════ */

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

function AccordionCity({ city }: { city: typeof offlineDetailedLinks[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${open ? "border-blue-200 shadow-md shadow-blue-50" : "border-gray-100 hover:border-blue-100"}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100 text-blue-600 text-sm">
            <FaMapMarkerAlt />
          </span>
          <div>
            <p className="font-bold text-gray-800 text-sm">{city.city}</p>
            <p className="text-xs text-gray-400">{city.areas.slice(0, 3).join(" • ")} ···</p>
          </div>
        </div>
        <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-50">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-4 mb-2">Popular Areas</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {city.areas.map((a) => (
              <span key={a} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2.5 py-0.5">{a}</span>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Services</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {city.links.map((l) => (
              <Link key={l.label} href={l.href} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl px-3 py-2 transition-all">
                <FaChevronRight className="text-blue-300 text-xs" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */

export default function SitemapPage() {
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const [activeOnlineTab, setActiveOnlineTab] = useState(0);

  return (
    <>
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden -mt-[72px] pt-[140px] pb-24 text-white bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-600">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
            <FaGlobe className="text-cyan-300" />
            Complete Platform Overview
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight">
            Tutvex <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">Sitemap</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Every service, every city, every tutor — all in one place. Explore India's fastest-growing tutoring platform.
          </p>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { n: "7+", label: "Active Cities" },
              { n: "100+", label: "Services" },
              { n: "8", label: "Global Regions" },
              { n: "5000+", label: "Verified Tutors" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-4">
                <p className="text-3xl font-black text-white">{s.n}</p>
                <p className="text-xs text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className="bg-gray-50/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">

          {/* ─ 1. SERVICES ─ */}
          <SectionCard>
            <SectionHeader icon={<FaBook />} title="All Our Services" subtitle="Browse by category — click any service to explore" />

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {allServiceCategories.map((cat, i) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveServiceTab(i)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold border transition-all duration-200 ${
                    activeServiceTab === i
                      ? `bg-gradient-to-r ${headColorMap[cat.color]} text-white border-transparent shadow-md`
                      : `${colorMap[cat.color]} border`
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Active category services */}
            {allServiceCategories.map((cat, i) => (
              i === activeServiceTab && (
                <div key={cat.category}>
                  <div className={`rounded-2xl p-5 mb-5 bg-gradient-to-r ${headColorMap[cat.color]} text-white flex items-center gap-3`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="font-black text-lg">{cat.category}</p>
                      <p className="text-sm opacity-80">{cat.services.length} services available across our cities</p>
                    </div>
                  </div>

                  {/* Service × City grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {cat.services.flatMap((service) =>
                      runningCities.map((city) => (
                        <Link
                          key={`${service}-${city.name}`}
                          href={`/${city.slug}/${city.name.toLowerCase().replace(/\s+/g, "-")}/${service.toLowerCase().replace(/\s+/g, "-")}`}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium hover:shadow-sm transition-all group ${colorMap[cat.color]}`}
                        >
                          <FaChevronRight className="text-xs opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          <span className="truncate">{service} in {city.name}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )
            ))}
          </SectionCard>

          {/* ─ 2. OFFLINE CITIES ─ */}
          <SectionCard>
            <SectionHeader
              icon={<FaMapMarkerAlt />}
              title="Offline Tutor Centers"
              subtitle="Expand a city to see areas & available services"
            />

            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {offlineDetailedLinks.map((city) => (
                <AccordionCity key={city.city} city={city} />
              ))}
            </div>

            {/* Upcoming */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-6">
              <p className="font-bold text-indigo-700 mb-1 flex items-center gap-2">
                <FaGlobe className="text-indigo-400" /> Expanding Soon
              </p>
              <p className="text-xs text-indigo-400 mb-4">We're launching in these cities soon — register your interest!</p>
              <div className="flex flex-wrap gap-2">
                {upcomingCities.map((city) => (
                  <span key={city.name} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-indigo-200 text-indigo-600 text-xs font-semibold px-3 py-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    {city.name}
                    <span className="text-indigo-300">· {city.state}</span>
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ─ 3. ONLINE / GLOBAL ─ */}
          <SectionCard>
            <SectionHeader icon={<FaGlobe />} title="Online & Global Tutoring" subtitle="World-class tutors available worldwide" />

            {/* Region tabs */}
            <div className="flex flex-wrap gap-2 mb-7">
              {onlineGlobalLinks.map((region, i) => (
                <button
                  key={region.region}
                  onClick={() => setActiveOnlineTab(i)}
                  className={`rounded-xl px-3.5 py-1.5 text-sm font-semibold border transition-all ${
                    activeOnlineTab === i
                      ? `bg-gradient-to-r ${headColorMap[region.color]} text-white border-transparent shadow-md`
                      : `${colorMap[region.color]} border`
                  }`}
                >
                  {region.region}
                </button>
              ))}
            </div>

            {onlineGlobalLinks.map((region, i) =>
              i === activeOnlineTab ? (
                <div key={region.region} className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {region.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium hover:shadow-md transition-all group ${colorMap[region.color]}`}
                    >
                      <FaChevronRight className="text-xs opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null
            )}
          </SectionCard>

          {/* ─ 4. CHARTS ─ */}
          <div className="grid md:grid-cols-2 gap-6">
            <SectionCard>
              <SectionHeader icon={<FaGlobe />} title="Platform at a Glance" />
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barCategoryGap="30%">
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader icon={<FaBook />} title="Services by Category" />
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* ─ 5. COMPANY PAGES ─ */}
          <SectionCard>
            <SectionHeader icon={<FaUserGraduate />} title="Company Pages" subtitle="Everything you need to know about Tutvex" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-center px-4 py-5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-500 text-lg shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all">
                    {link.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{link.name}</p>
                  <p className="text-xs text-gray-400 group-hover:text-blue-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* ─ 6. CONTACT ─ */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4">
                  <FaPhone />
                </div>
                <h3 className="text-xl font-black mb-1">Call Us</h3>
                <p className="text-blue-200 text-sm mb-4">Mon – Sat, 9 AM – 7 PM</p>
                <p className="text-2xl font-bold">+91-9305275932</p>
              </div>
              <a href="tel:+919305275932" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 font-bold text-sm px-5 py-2.5 hover:bg-blue-50 transition-colors w-max">
                Call Now <FaChevronRight />
              </a>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4">
                  <FaEnvelope />
                </div>
                <h3 className="text-xl font-black mb-1">Email Us</h3>
                <p className="text-cyan-200 text-sm mb-4">We reply within 24 hours</p>
                <p className="text-xl font-bold break-all">support@tutvex.com</p>
              </div>
              <a href="mailto:support@tutvex.com" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-teal-700 font-bold text-sm px-5 py-2.5 hover:bg-teal-50 transition-colors w-max">
                Send Email <FaChevronRight />
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
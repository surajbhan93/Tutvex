import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useCookieConsentStore } from "@/stores/useCookieConsentStore";

/* =======================
   DATA
======================= */

const indiaCities = [
  {
    city: "Allahabad",
    cityHref: "/allahabad",
    links: [
      { label: "Home Tutor", href: "/allahabad" },
      // { label: "Private Tutor", href: "/allahabad/allahabad/private-tutor" },
      { label: "Maths Tutor", href: "/allahabad/allahabad/maths-tutor" },
      { label: "JEE Tutor", href: "/allahabad/allahabad/jee-tutor" },
      { label: "NEET Tutor", href: "/allahabad/allahabad/neet-tutor" },
      // { label: "Tutor Job", href: "/allahabad/allahabad/tutor-job" },
    ],
  },
   {
    city: "Varanasi",
    cityHref: "/india/banaras",
    links: [
      { label: "Home Tutor", href: "/india/banaras" },
      // { label: "1-to-1-tuition", href: "india/banaras/benia-bagh/1-to-1-tuition" },
      { label: "Maths Tutor", href: "/india/banaras/mahmoorganj/math-tutor" },
      { label: "JEE Tutor", href: "/india/banaras/mahmoorganj/jee-tuto" },
      { label: "NEET Tutor", href: "/india/banaras/mahmoorganj/neet-tutor" },
      // { label: "earn-by-teaching", href: "/india/banaras/sigra/earn-by-teaching" },
    ],
  },
  {
    city: "Lucknow",
    cityHref: "/lucknow",
    links: [
      { label: "Home Tutor", href: "/lucknow" },
      // { label: "Private Tutor", href: "/lucknow/Aminabad/private-tutor" },
      { label: "ICSE Tutor", href: "/lucknow/Hasanganj/icse-tutor" },
      { label: "JEE Tutor", href: "/lucknow/Gomti Nagar/jee-tutor" },
      { label: "NEET Tutor", href: "/lucknow/Vibhuti Khand/neet-tutor" },
      // { label: "Tutor Job", href: "/lucknow/Vikas Khand/tutor-job" },
    ],
  },
  {
    city: "Kanpur",
    cityHref: "/kanpur",
    links: [
      { label: "Home Tutor", href: "/kanpur" },
      { label: "Private Tutor", href: "/kanpur/Civil Lines/private-tutor" },
      // { label: "Personal Tutor", href: "/kanpur/Arya Nagar/personal-tutor" },
      { label: "JEE Tutor", href: "/kanpur/Yashoda Nagar/jee-tutor" },
      { label: "NEET Tutor", href: "/kanpur/Karachi Khana/neet-tutor" },
      // { label: "Tutor Job", href: "/kanpur/Lajpat Nagar/tutor-job" },
    ],
  },
  {
    city: "Noida",
    cityHref: "/india/noida",
    links: [
      { label: "Home Tutor", href: "/india/noida" },
      { label: "Private Tutor", href: "/india/noida/Sector 63/private-tutor" },
      { label: "JEE Tutor", href: "/india/noida/Greater Noida West/jee-tutor" },
      { label: "NEET Tutor", href: "/india/noida/Techzone 4/neet-tutor" },
      // { label: "Best Tutor", href: "/india/noida/Sector 125 IT Area/best-tutor" },
      // { label: "Tutor Job", href: "/india/noida/Surajpur/tutor-job" },
    ],
  },
  {
    city: "Agra",
    cityHref: "/india/agra",
    links: [
      { label: "Home Tutor", href: "/india/agra" },
      { label: "Private Tutor", href: "/india/agra/Civil Lines/private-tutor" },
      { label: "JEE Tutor", href: "/india/agra/Mantola/jee-tutor" },
      { label: "NEET Tutor", href: "/india/agra/Kamla Nagar/neet-tutor" },
      // { label: "Best Tutor", href: "/india/agra/Fatehabad Road/best-tutor" },
    ],
  },
  {
    city: "Meerut",
    cityHref: "/india/meerut",
    links: [
      { label: "Home Tutor", href: "/india/meerut" },
      { label: "Private Tutor", href: "/india/meerut/Begum Bridge/private-tutor" },
      { label: "JEE Tutor", href: "/india/meerut/Jagriti Vihar/jee-tutor" },
      { label: "NEET Tutor", href: "/india/meerut/Shradhapuri/neet-tutor" },
      // { label: "Best Tutor", href: "/india/meerut/Zakir Colony/best-tutor" },
    ],
  },
];
const onlineLinks = [
  {
    label: "Online Tuition",
    href: "/country/india/online-tuition",
  },
  {
    label: "Maths Online",
    href: "/country/india/maths-online",
  },
  {
    label: "Science Online",
    href: "/country/india/science-online",
  },
  {
    label: "JEE Online Coaching",
    href: "/country/india/jee-online-coaching",
  },
  {
    label: "NEET Online Coaching",
    href: "/country/india/neet-online-coaching",
  },
  {
    label: "CBSE Online Tutor",
    href: "/country/india/cbse-online-tutor",
  },
];

const internationalSections = [
  {
    flag: "🇬🇧",
    label: "United Kingdom",
    links: [
      {
        label: "UK Tutoring",
        href: "/country/uk/uk-tutoring",
      },
      {
        label: "Home Tutor UK",
        href: "/country/uk/home-tutor-uk",
      },
      {
        label: "Online Tutor UK",
        href: "/country/uk/online-tutor-uk",
      },
      {
        label: "GCSE Tutor UK",
        href: "/country/uk/gcse-tutor-uk",
      },
      {
        label: "A-Level Tutor UK",
        href: "/country/uk/a-level-tutor-uk",
      },
      {
        label: "Tutor Job UK",
        href: "/country/uk/tutor-job-uk",
      },
    ],
  },

  {
    flag: "🇨🇦",
    label: "Canada",
    links: [
      {
        label: "Canada Tutoring",
        href: "/country/canada/canada-tutoring",
      },
      {
        label: "Home Tutor Canada",
        href: "/country/canada/home-tutor-canada",
      },
      {
        label: "Online Tutor Canada",
        href: "/country/canada/online-tutor-canada",
      },
      {
        label: "Toronto Tutor",
        href: "/country/canada/toronto-tutor",
      },
      {
        label: "Maths Tutor Canada",
        href: "/country/canada/maths-tutor-canada",
      },
      {
        label: "Tutor Job Canada",
        href: "/country/canada/tutor-job-canada",
      },
    ],
  },

  {
    flag: "🇦🇪",
    label: "UAE (Dubai / Abu Dhabi)",
    links: [
      {
        label: "Home Tutor UAE",
        href: "/country/uae/home-tutor-uae",
      },
      {
        label: "Online Tutor Dubai",
        href: "/country/uae/online-tutor-dubai",
      },
      {
        label: "Tutor Abu Dhabi",
        href: "/country/uae/tutor-abu-dhabi",
      },
      {
        label: "CBSE Tutor Dubai",
        href: "/country/uae/cbse-tutor-dubai",
      },
      {
        label: "Maths Tutor UAE",
        href: "/country/uae/maths-tutor-uae",
      },
      {
        label: "Tutor Job UAE",
        href: "/country/uae/tutor-job-uae",
      },
    ],
  },

  {
    flag: "🇸🇬",
    label: "Singapore",
    links: [
      {
        label: "Home Tutor Singapore",
        href: "/country/singapore/home-tutor-singapore",
      },
      {
        label: "Online Tutor SG",
        href: "/country/singapore/online-tutor-sg",
      },
      {
        label: "Maths Tutor SG",
        href: "/country/singapore/maths-tutor-sg",
      },
      {
        label: "Primary Tutor SG",
        href: "/country/singapore/primary-tutor-sg",
      },
      {
        label: "Tutor Job Singapore",
        href: "/country/singapore/tutor-job-singapore",
      },
    ],
  },

  {
    flag: "🇦🇺",
    label: "Australia",
    links: [
      {
        label: "Home Tutor Australia",
        href: "/country/australia/home-tutor-australia",
      },
      {
        label: "Online Tutor AU",
        href: "/country/australia/online-tutor-au",
      },
      {
        label: "Sydney Tutor",
        href: "/country/australia/sydney-tutor",
      },
      {
        label: "Melbourne Tutor",
        href: "/country/australia/melbourne-tutor",
      },
      {
        label: "Maths Tutor AU",
        href: "/country/australia/maths-tutor-au",
      },
      {
        label: "Tutor Job Australia",
        href: "/country/australia/tutor-job-australia",
      },
    ],
  },
];

const socialLinks = [
  { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaInstagram />, href: "https://www.instagram.com/tutvexofficial/", label: "Instagram" },
  { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/company/mentorsetu/", label: "LinkedIn" },
  { icon: <FaYoutube />, href: "https://www.youtube.com/@Tutvex", label: "YouTube" },
  { icon: <FaTwitter />, href: "https://x.com/tutvexofficial", label: "Twitter" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Refund & Cancellation", href: "/refund" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Sitemap", href: "/sitemap", highlight: true },
];

const paymentMethods = ["VISA", "Mastercard", "UPI", "Razorpay", "NetBanking"];

/* =======================
   FOOTER COMPONENT
======================= */

const Footer = () => {
  const { resetConsent } = useCookieConsentStore();

  const handleCookieSettings = () => {
    resetConsent();
  };

  return (
    
    <footer className="bg-[#0a0f1c] text-gray-400 font-sans relative overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="mx-auto max-w-[1800px] px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* ── Brand Column ── */}
          {/* ── Brand Column ── */}
<div className="min-w-0 border-r border-[#141b2d] pr-8">
            {/* Logo */}
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Tutvex
            </span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              India's trusted platform for home tutors, private tuition &amp; online learning worldwide.
            </p>

            {/* Socials */}
            <div className="mt-5 flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#151b2e] border border-[#1e2740] flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-cyan-500 hover:border-indigo-600 hover:text-white transition-all duration-200 text-xs"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <p className="mt-6 text-[11px] uppercase tracking-widest text-indigo-500 font-semibold">
              Newsletter
            </p>
            <div className="mt-2 flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#151b2e] border border-[#1e2740] border-r-0 rounded-l-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-indigo-500"
              />
              <button className="rounded-r-lg bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>

            {/* Contact */}
            <p className="mt-6 text-[11px] uppercase tracking-widest text-indigo-500 font-semibold">Contact</p>
            <div className="mt-2 space-y-2 text-xs text-gray-500">
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-400 shrink-0" /> Allahabad &amp; Noida, India</p>
              <p className="flex items-center gap-2"><FaEnvelope className="text-indigo-400 shrink-0" /> admin@tutvex.com</p>
              <p className="flex items-center gap-2"><FaPhone className="text-indigo-400 shrink-0" /> +91-9305275932</p>
            </div>

            {/* Company Links */}
            <p className="mt-6 text-[11px] uppercase tracking-widest text-indigo-500 font-semibold">Company</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    link.highlight
                      ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-cyan-500/40"
                      : "bg-white/5 backdrop-blur-sm border-[#1e2740] text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ── India Cities Column ── */}
         {/* ── India Cities Column ── */}
<div className="min-w-0 border-r border-[#141b2d] pr-8">
            <h3 className="mb-5 flex items-center gap-2 text-[15px] font-semibold text-white tracking-tight">
              <span>🇮🇳</span> Tutors in India offline center
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {indiaCities.map((c) => (
                <div key={c.city}>
                  <Link
                        href={c.cityHref || "#"}
                        className="mb-2 block text-[10px] uppercase tracking-widest text-indigo-500 font-semibold hover:text-cyan-400 transition-colors"
                      >
                        {c.city}
                      </Link>
                  <ul className="space-y-1.5">
                    {c.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#1e2740] group-hover:bg-cyan-400 transition-colors shrink-0" />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Online + UK + Canada ── */}
         {/* ── Online + UK + Canada ── */}
<div className="min-w-0 border-r border-[#141b2d] pr-8">
            <h3 className="mb-5 text-[15px] font-semibold text-white tracking-tight">Online &amp; Global Tuition</h3>

            {/* Online India */}
            <span className="inline-flex items-center gap-1.5 bg-[#151b2e] border border-[#1e2740] rounded-md px-2.5 py-1 text-[11px] font-semibold text-cyan-400 mb-3">
              🌐 Online India
            </span>
            <ul className="space-y-1.5 mb-6">
              {onlineLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#1e2740] group-hover:bg-cyan-400 transition-colors shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {internationalSections.slice(0, 2).map((section) => (
              <div key={section.label} className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-[#151b2e] border border-[#1e2740] rounded-md px-2.5 py-1 text-[11px] font-semibold text-cyan-400 mb-3">
                  {section.flag} {section.label}
                </span>
                <ul className="space-y-1.5">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-[#1e2740] group-hover:bg-cyan-400 transition-colors shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── UAE + Singapore + Australia ── */}
          {/* ── UAE + Singapore + Australia ── */}
<div className="min-w-0 pl-2">
            <h3 className="mb-5 text-[15px] font-semibold text-white tracking-tight">International Tutoring</h3>
            {internationalSections.slice(2).map((section) => (
              <div key={section.label} className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-[#151b2e] border border-[#1e2740] rounded-md px-2.5 py-1 text-[11px] font-semibold text-cyan-400 mb-3">
                  {section.flag} {section.label}
                </span>
                <ul className="space-y-1.5">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-[#1e2740] group-hover:bg-cyan-400 transition-colors shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── App Download + Payment ── */}
      <div className="border-t border-[#151b2e]">
       <div className="mx-auto max-w-[1800px] px-8 lg:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* App Buttons */}
          <div className="flex gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 bg-[#151b2e] border border-[#1e2740] hover:border-indigo-500/50 rounded-lg px-3.5 py-2 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] text-gray-500">Download on the</div>
                <div className="text-xs font-semibold text-gray-200">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 bg-[#151b2e] border border-[#1e2740] hover:border-indigo-500/50 rounded-lg px-3.5 py-2 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 20.5v-17c0-.83 1-1.3 1.7-.8l14 8.5c.7.4.7 1.5 0 1.9l-14 8.5c-.7.5-1.7 0-1.7-.8" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] text-gray-500">Get it on</div>
                <div className="text-xs font-semibold text-gray-200">Google Play</div>
              </div>
            </a>
          </div>

          {/* Payment Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className={`text-[11px] font-bold px-3 py-1 rounded-md border ${
                  method === "UPI" || method === "Razorpay"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-[#151b2e] border-[#1e2740] text-gray-400"
                }`}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
     <div className="bg-[#070b14]/80 border-t border-[#141b2d] py-4">
  <div className="mx-auto max-w-[1800px] px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
    
    <p>
      © {new Date().getFullYear()}{" "}
      <span className="text-indigo-400 font-semibold">Tutvex</span>. All rights reserved.
    </p>

    <div className="flex items-center gap-4">
      <button
        onClick={handleCookieSettings}
        className="text-gray-500 hover:text-cyan-400 transition-colors underline decoration-dotted underline-offset-2"
      >
        Cookie Settings
      </button>
      <p className="text-gray-500">
        Trusted by students across India & worldwide
      </p>
    </div>

  </div>
</div>
    </footer>
  );
};

export default Footer;
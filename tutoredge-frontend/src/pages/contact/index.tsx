import { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import FloatingChatButton from "@/components/common/FloatingChatButton";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  XCircle,
  User,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Clock,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import apiClient from "@/lib/apiClient";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import ContactSupportBar from "@/components/common/ContactSupportBar";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

/* ─────────────────────────────────────────────────────────
   SEO — Structured Data (JSON-LD)
   Yeh Google ko batata hai ki yeh ek ContactPage hai
───────────────────────────────────────────────────────── */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Tutvex – Find Best Tutors in India",
  description:
    "Contact Tutvex for tutor enquiries, support, or partnerships. We connect students with verified tutors across India for all subjects and boards.",
  url: "https://tutvex.com/contact",
  publisher: {
    "@type": "Organization",
    name: "Tutvex",
    url: "https://tutvex.com",
    logo: {
      "@type": "ImageObject",
      url: "https://tutvex.com/logo.png",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9305275932",
      contactType: "customer support",
      email: "Tutvex@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  },
};

/* ─────────────────────────────────────────────────────────
   FLOATING ORB
───────────────────────────────────────────────────────── */
function Orb({
  style,
  color,
  size,
  delay = 0,
}: {
  style: React.CSSProperties;
  color: string;
  size: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(70px)",
        ...style,
      }}
      animate={{ y: [0, -28, 0], opacity: [0.35, 0.65, 0.35], scale: [1, 1.1, 1] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   DARK INPUT FIELD
───────────────────────────────────────────────────────── */
function DarkInput({
  icon: Icon,
  label,
  fieldId,
  ...props
}: {
  icon: any;
  label: string;
  fieldId: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-[10px] font-bold tracking-widest uppercase mb-2"
        style={{ color: "rgba(245,180,60,0.7)" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={14}
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? "#f5b43c" : "rgba(255,255,255,0.18)" }}
        />
        <input
          id={fieldId}
          {...props}
          onFocus={(e) => {
            setFocused(true);
            (props.onFocus as any)?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            (props.onBlur as any)?.(e);
          }}
          className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-transparent placeholder-gray-700 transition-all duration-200 outline-none"
          style={{
            background: focused ? "rgba(245,180,60,0.04)" : "rgba(255,255,255,0.025)",
            border: `1px solid ${focused ? "rgba(245,180,60,0.45)" : "rgba(255,255,255,0.07)"}`,
            boxShadow: focused ? "0 0 0 3px rgba(245,180,60,0.06), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
            color: "white",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTACT INFO ROW
───────────────────────────────────────────────────────── */
function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 group">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "rgba(245,180,60,0.08)",
          border: "1px solid rgba(245,180,60,0.14)",
        }}
      >
        <Icon size={15} className="text-amber-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
          style={{ color: "rgba(245,180,60,0.5)" }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TRUST BADGE
───────────────────────────────────────────────────────── */
function TrustBadge({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(245,180,60,0.1)" }}
      >
        <Icon size={12} className="text-amber-400" aria-hidden="true" />
      </div>
      <span className="text-[11px] text-gray-500">{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [msgFocused, setMsgFocused] = useState(false);

  /* ── auto-reset success banner ── */
  useEffect(() => {
    if (!formSubmitted) return;
    const timer = setTimeout(() => setFormSubmitted(false), 15000);
    return () => clearTimeout(timer);
  }, [formSubmitted]);

  /* ── field change handler ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ── submit ── */
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await apiClient.post("/contact", form);
      setFormSubmitted(true);
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full rounded-2xl pointer-events-auto overflow-hidden`}
            style={{
              background: "#15151f",
              border: "1px solid rgba(34,197,94,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Message delivered ✓</p>
                <p className="mt-0.5 text-xs text-gray-500">Our team will contact you shortly.</p>
              </div>
            </div>
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #34d399, #10b981)" }} />
          </div>
        ),
        { duration: 4000 }
      );
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full rounded-2xl pointer-events-auto overflow-hidden`}
            style={{
              background: "#15151f",
              border: "1px solid rgba(248,113,113,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            <div className="flex items-start gap-3 p-4">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Message not sent</p>
                <p className="mt-0.5 text-xs text-gray-500">Please try again in a moment.</p>
              </div>
            </div>
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #f87171, #fb923c)" }} />
          </div>
        ),
        { duration: 4000 }
      );
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <>
      {/* ════════════════════════════════════════════════
          SEO HEAD — Next.js <Head>
          Yeh sab Google crawlers ke liye hai
      ════════════════════════════════════════════════ */}
      <Head>
        {/* Primary Meta */}
        <title>Contact Tutvex | Find Verified Tutors in India</title>
        <meta
          name="description"
          content="Get in touch with Tutvex — India's trusted tutor marketplace. Contact us for tutor enquiries, student support, or partnership opportunities. We reply within 2 hours."
        />
        <meta
          name="keywords"
          content="contact tutvex, tutor near me, hire tutor India, online tutor support, tuition enquiry, best tutor platform India, home tutor contact"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Tutvex" />
        <link rel="canonical" href="https://tutvex.com/contact" />

        {/* Open Graph (Facebook, WhatsApp previews) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tutvex" />
        <meta property="og:title" content="Contact Tutvex | Find Verified Tutors in India" />
        <meta
          property="og:description"
          content="Reach out to Tutvex for tutor enquiries or support. India's most trusted tutor marketplace — connecting students with verified educators."
        />
        <meta property="og:url" content="https://tutvex.com/contact" />
        <meta property="og:image" content="https://tutvex.com/og-contact.png" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Tutvex | Find Verified Tutors in India" />
        <meta
          name="twitter:description"
          content="Get in touch with Tutvex for tutor enquiries, student support, or partnerships. We reply within 2 hours."
        />
        <meta name="twitter:image" content="https://tutvex.com/og-contact.png" />

        {/* Structured Data — JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NavBar />
      <ContactSupportBar hidden={formSubmitted} />

      {/* ════════════════════════════════════════════════
          ROOT
      ════════════════════════════════════════════════ */}
      <main
        className="min-h-screen relative overflow-hidden"
        style={{ background: "#080810", fontFamily: "'DM Sans', sans-serif" }}
        aria-label="Contact Tutvex"
      >
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <Orb color="rgba(245,180,60,0.3)" size={700} style={{ top: "-15%", left: "-15%" }} delay={0} />
          <Orb color="rgba(109,40,217,0.2)" size={550} style={{ bottom: "-5%", right: "-12%" }} delay={2.5} />
          <Orb color="rgba(245,100,40,0.12)" size={380} style={{ top: "55%", left: "35%" }} delay={4} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(transparent, rgba(8,8,16,0.8))" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">

          {/* ── Page Hero ── */}
          <motion.header
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                background: "rgba(245,180,60,0.08)",
                border: "1px solid rgba(245,180,60,0.22)",
                color: "#f5b43c",
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
              Support &amp; Enquiries
            </div>

            {/* H1 — SEO ke liye important */}
            <h1
              className="text-4xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Contact{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f5b43c 0%, #ff7c32 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tutvex
              </span>
            </h1>

            {/* Subtitle — keyword-rich for SEO */}
            <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Looking for a{" "}
              <strong className="text-gray-400 font-semibold">verified tutor in India</strong>?
              Have a question about our platform? We&apos;d love to hear from you.
            </p>

            {/* Trust badges row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-5 mt-7"
            >
              <TrustBadge icon={Clock} text="Replies within 2 hours" />
              <span className="w-px h-4 bg-white/10" aria-hidden="true" />
              <TrustBadge icon={Shield} text="100% Verified Tutors" />
              <span className="w-px h-4 bg-white/10" aria-hidden="true" />
              <TrustBadge icon={HeadphonesIcon} text="Dedicated Support" />
            </motion.div>
          </motion.header>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-7 items-start">

            {/* ════ LEFT: FORM (3 columns) ════ */}
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-3 rounded-3xl overflow-hidden relative"
              style={{
                background: "linear-gradient(160deg, #14141e 0%, #0d0d16 100%)",
                border: "1px solid rgba(255,255,255,0.065)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Amber top accent line */}
              <div
                aria-hidden="true"
                className="h-px w-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(245,180,60,0.6) 40%, rgba(255,124,50,0.4) 70%, transparent 100%)",
                }}
              />

              <div className="p-8 sm:p-10">
                {/* Card header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(245,180,60,0.18), rgba(245,100,40,0.1))",
                      border: "1px solid rgba(245,180,60,0.18)",
                    }}
                  >
                    <Sparkles size={17} className="text-amber-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-black text-white leading-tight"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      Send a Message
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Fill the form — we&apos;ll reply within 2 hours
                    </p>
                  </div>
                </div>

                {/* ── Success Banner ── */}
                <AnimatePresence>
                  {formSubmitted && (
                    <motion.div
                      role="alert"
                      aria-live="polite"
                      initial={{ opacity: 0, y: -14, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-7 rounded-2xl p-4 flex items-start gap-3"
                      style={{
                        background: "rgba(34,197,94,0.07)",
                        border: "1px solid rgba(34,197,94,0.18)",
                      }}
                    >
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-emerald-400">Submitted successfully!</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Our support team will reach you as soon as possible.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Form ── */}
                <form onSubmit={submitForm} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DarkInput
                      icon={User}
                      label="Full Name"
                      fieldId="contact-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      autoComplete="name"
                    />
                    <DarkInput
                      icon={Mail}
                      label="Email Address"
                      fieldId="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <DarkInput
                    icon={Phone}
                    label="Phone Number (optional)"
                    fieldId="contact-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                  />

                  {/* Textarea */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[10px] font-bold tracking-widest uppercase mb-2"
                      style={{ color: "rgba(245,180,60,0.7)" }}
                    >
                      Your Message
                    </label>
                    <div className="relative">
                      <MessageSquare
                        size={14}
                        aria-hidden="true"
                        className="absolute left-4 top-4 pointer-events-none transition-colors duration-200"
                        style={{ color: msgFocused ? "#f5b43c" : "rgba(255,255,255,0.18)" }}
                      />
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        onFocus={() => setMsgFocused(true)}
                        onBlur={() => setMsgFocused(false)}
                        rows={5}
                        placeholder="Tell us how we can help you — tutor enquiry, support, partnership…"
                        required
                        className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl resize-none outline-none placeholder-gray-700 transition-all duration-200"
                        style={{
                          background: msgFocused ? "rgba(245,180,60,0.04)" : "rgba(255,255,255,0.025)",
                          border: `1px solid ${msgFocused ? "rgba(245,180,60,0.45)" : "rgba(255,255,255,0.07)"}`,
                          boxShadow: msgFocused ? "0 0 0 3px rgba(245,180,60,0.06)" : "none",
                          color: "white",
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015, y: loading ? 0 : -1 }}
                    whileTap={{ scale: loading ? 1 : 0.975 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all disabled:cursor-not-allowed"
                    style={{
                      background: loading
                        ? "rgba(245,180,60,0.2)"
                        : "linear-gradient(135deg, #f5b43c 0%, #e8920a 100%)",
                      color: loading ? "rgba(245,180,60,0.5)" : "#080810",
                      boxShadow: loading ? "none" : "0 8px 28px rgba(245,180,60,0.32)",
                      border: loading ? "1px solid rgba(245,180,60,0.15)" : "none",
                    }}
                    aria-label={loading ? "Sending message" : "Send message to Tutvex"}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          className="inline-block w-4 h-4 rounded-full border-2 border-amber-400/40 border-t-amber-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} aria-hidden="true" />
                        Send Message
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </>
                    )}
                  </motion.button>

                  {/* Privacy micro-copy */}
                  <p className="text-center text-[11px] text-gray-700">
                    🔒 Your information is safe. We never share your data.
                  </p>
                </form>
              </div>
            </motion.div>

            {/* ════ RIGHT: INFO (2 columns) ════ */}
            <motion.aside
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 flex flex-col gap-5"
              aria-label="Contact information"
            >

              {/* ── Brand + contact details ── */}
              <div
                className="rounded-3xl p-7 relative overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, #14141e 0%, #0d0d16 100%)",
                  border: "1px solid rgba(255,255,255,0.065)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(245,180,60,0.55), transparent)",
                  }}
                />

                {/* Tutvex logo text */}
                <div className="mb-7">
                  <h2
                    className="text-4xl font-black leading-none"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      background: "linear-gradient(135deg, #f5b43c 0%, #ff7c32 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Tutvex
                  </h2>
                  <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                    India&apos;s trusted tutor marketplace
                  </p>
                </div>

                {/* Contact details — semantic address tag */}
                <address className="not-italic space-y-5">
                  <InfoRow icon={Mail} label="Email">
                    <a
                      href="mailto:Tutvex@gmail.com"
                      className="hover:text-amber-400 transition-colors duration-200"
                    >
                      Tutvex@gmail.com
                    </a>
                  </InfoRow>
                  <InfoRow icon={Phone} label="Phone">
                    <a
                      href="tel:+919305275932"
                      className="hover:text-amber-400 transition-colors duration-200"
                    >
                      +91-9305275932
                    </a>
                  </InfoRow>
                  <InfoRow icon={MapPin} label="Location">
                    India
                  </InfoRow>
                </address>

                {/* Divider */}
                <div
                  aria-hidden="true"
                  className="my-6 h-px"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />

                {/* Response time */}
                <div className="flex items-center gap-2.5">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    aria-hidden="true"
                  />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Avg. response time:{" "}
                    <span className="text-emerald-400 font-semibold">under 2 hours</span>
                  </p>
                </div>
              </div>

              {/* ── WhatsApp CTA ── */}
              <motion.a
                href="https://wa.me/919305275932"
                target="_blank"
                rel="noreferrer noopener"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "white",
                  boxShadow: "0 10px 32px rgba(34,197,94,0.28)",
                  textDecoration: "none",
                }}
                aria-label="Chat with Tutvex on WhatsApp"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Chat on WhatsApp
                <ArrowUpRight size={13} aria-hidden="true" />
              </motion.a>

              {/* ── Embedded Map ── */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                  minHeight: 200,
                }}
              >
                <iframe
                  title="Tutvex — India Location Map"
                  src="https://www.google.com/maps?q=India&output=embed"
                  width="100%"
                  height="210"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{
                    display: "block",
                    filter: "invert(0.88) hue-rotate(185deg) contrast(0.82) brightness(0.78) saturate(0.9)",
                  }}
                />
              </div>

              {/* ── SEO-friendly text block (hidden from visual, visible to crawlers) ── */}
              <div
                className="rounded-2xl px-5 py-4"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.22)" }}>
                  <strong className="text-gray-600">Tutvex</strong> connects students across India with{" "}
                  <strong className="text-gray-600">verified home tutors and online tutors</strong> for all
                  subjects — Maths, Science, English, Hindi, and more. Available for CBSE, ICSE, and State
                  Board students from Class 1 to 12.
                </p>
              </div>
            </motion.aside>

          </div>
        </div>
      </main>
<FloatingChatButton />
      <Footer />
    </>
  );
}
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";

/* =======================
   DATA
======================= */

const APPLY_URL =
  "https://joinhandshake.com/ai/referral?referralCode=322562&utm_source=referral";

const PAGE_URL = "https://tutvex.com/usa/doubt-expert";

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

// Free-to-use Unsplash photos (Unsplash License)
const IMG = {
  hero: { src: u("1580894732444-8ecded7900cd", 1400), alt: "Teacher explaining a concept at the whiteboard" },
  classroom: { src: u("1509062522246-3755977927d7"), alt: "Students learning in a classroom with their teacher" },
  online: { src: u("1588196749597-9ff075ee6b5b"), alt: "Online class on a laptop with a group of learners" },
  laptop: { src: u("1454165804606-c3d57bc86b40"), alt: "Tutor working with pencil beside a laptop" },
  desk: { src: u("1758874383169-36e9a554a607"), alt: "Expert working remotely at a desk with laptop and notebook" },
  board: { src: u("1664382953518-4a664ab8a8c9"), alt: "Person writing a solution on a whiteboard" },
  lecture: { src: u("1758270704262-ecc82b23dc37", 1600), alt: "Professor lecturing students in a classroom" },
};

const roles = [
  { icon: "💻", title: "Computer Science / CSE", desc: "Programming, data structures, algorithms, databases & more." },
  { icon: "📐", title: "Mathematics", desc: "Algebra, calculus, statistics, geometry and problem solving." },
  { icon: "⚛️", title: "Physics", desc: "Mechanics, electricity, optics, modern physics and numericals." },
  { icon: "🧪", title: "Chemistry", desc: "Organic, inorganic and physical chemistry concepts." },
  { icon: "🌍", title: "Social Science", desc: "History, geography, civics, economics and related subjects." },
  { icon: "📚", title: "Other Academic Subjects", desc: "Deep expertise elsewhere? Tell us your subject." },
];

const partners = [
  { name: "GoStudent", country: "Austria", logo: "/partners/gostudent.png" },
  { name: "Teach Me 2", country: "South Africa", logo: "/partners/teach-me-2.png" },
  { name: "Yuanfudao", country: "China", logo: "/partners/yuanfudao.png" },
  { name: "TAL Education Group", country: "China", logo: "/partners/tal-education.png" },
  { name: "Vedantu", country: "India", logo: "/partners/vedantu.png" },
  { name: "Filo", country: "India", logo: "/partners/filo.png" },
  { name: "TeacherOn", country: "India / Global", logo: "/partners/teacheron.png" },
  { name: "UrbanPro", country: "India", logo: "/partners/urbanpro.png" },
  { name: "MyPrivateTutor", country: "Singapore / Asia", logo: "/partners/myprivatetutor.png" },
  { name: "Manabie", country: "Singapore / Asia", logo: "/partners/manabie.png" },
];

/** Shows the company logo from /public/partners/*.png; falls back to a clean text badge if the file is missing. */
function PartnerCard({ p }: { p: { name: string; country: string; logo: string } }) {
  const [noLogo, setNoLogo] = useState(false);
  return (
    <li className="card-hover flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1e2740] bg-[#0a0f1c] px-3 py-4 text-center">
      <div className="flex h-12 w-full items-center justify-center rounded-lg bg-white/95 px-3">
        {!noLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.logo}
            alt={`${p.name} logo`}
            loading="lazy"
            onError={() => setNoLogo(true)}
            className="max-h-8 w-auto max-w-full object-contain"
          />
        ) : (
          <span className="text-sm font-extrabold tracking-tight text-[#0a0f1c]">{p.name}</span>
        )}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-200">{p.name}</div>
        <div className="text-[11px] text-gray-500">{p.country}</div>
      </div>
    </li>
  );
}

const marquee = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Social Science", "Statistics", "Economics", "Biology", "Engineering"];

const whoCanApply = [
  "Relevant teaching or professional experience",
  "Strong academic background and subject knowledge",
  "Relevant educational qualifications",
  "Ability to explain complex concepts and solve academic doubts",
  "Excellent communication and problem-solving skills",
];

const responsibilities = [
  "Solve students' academic doubts accurately",
  "Provide clear, step-by-step explanations",
  "Review and validate academic solutions",
  "Maintain high standards of accuracy and quality",
  "Contribute subject expertise to improve the learning experience",
];

const benefits = [
  { icon: "💰", title: "$15 – $100+ / hour", desc: "Based on subject expertise, qualifications, experience and task complexity." },
  { icon: "🏠", title: "Work remotely", desc: "Work from anywhere with an internet connection." },
  { icon: "⏰", title: "Flexible hours", desc: "Choose subject-specific assignments that fit your schedule." },
  { icon: "🚀", title: "Emerging EdTech", desc: "Be part of a growing platform focused on quality education." },
];

const steps = [
  { n: "1", title: "Apply", desc: "Click Apply Now and submit your details on our onboarding partner platform." },
  { n: "2", title: "Qualification review", desc: "Your qualifications and experience are reviewed against subject requirements." },
  { n: "3", title: "Onboarding", desc: "Shortlisted candidates receive role-specific onboarding instructions." },
  { n: "4", title: "Start solving", desc: "Pick up subject-specific assignments and start helping students." },
];

/* =======================
   HELPERS
======================= */

/** Fade/slide in when scrolled into view (no animation library, very light). */
function Reveal({
  children,
  delay = 0,
  className = "",
  from = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "up" | "left" | "right" | "zoom";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || document.hidden) {
      setShown(true);
      return;
    }
    // already on screen at load → show right away
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`rv rv-${from} ${shown ? "rv-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** next/image with a graceful gradient fallback if a photo fails to load. */
function Photo({
  img,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  zoom = false,
}: {
  img: { src: string; alt: string };
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const pos = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";
  return (
    <div className={`${pos} overflow-hidden bg-gradient-to-br from-indigo-900/50 to-cyan-900/30 ${className}`}>
      {!failed && (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={70}
          onError={() => setFailed(true)}
          className={`object-cover ${zoom ? "kenburns" : "transition-transform duration-700 group-hover:scale-105"}`}
        />
      )}
    </div>
  );
}

const ApplyButton = ({ className = "", label = "Apply Now" }: { className?: string; label?: string }) => (
  <a
    href={APPLY_URL}
    target="_blank"
    rel="noopener noreferrer sponsored"
    data-gtag="doubt_expert_apply_click"
    className={`apply-btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-transform hover:-translate-y-0.5 ${className}`}
  >
    <span className="relative z-10">{label}</span>
    <span aria-hidden className="relative z-10 arrow">→</span>
  </a>
);

const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <Reveal className="mb-9 text-center">
    <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold">{eyebrow}</p>
    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h2>
    <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
  </Reveal>
);

const Check = () => (
  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-[11px] text-cyan-400">
    ✓
  </span>
);

/* =======================
   PAGE
======================= */

export default function DoubtExpertUSAPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Subject Matter Expert (Doubt Expert)",
    description:
      "Remote, flexible subject matter expert role solving students' academic doubts in Computer Science, Mathematics, Physics, Chemistry, Social Science and other subjects.",
    datePosted: "2026-11-17",
    employmentType: ["CONTRACTOR", "PART_TIME"],
    hiringOrganization: { "@type": "Organization", name: "Tutvex", sameAs: "https://tutvex.com" },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "USA" },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: { "@type": "QuantitativeValue", minValue: 15, maxValue: 100, unitText: "HOUR" },
    },
  };

  return (
    <>
      <Head>
        <title>Doubt Expert Jobs in USA – Remote Subject Matter Expert | Tutvex</title>
        <meta
          name="description"
          content="Apply as a remote Doubt Expert (Subject Matter Expert) with Tutvex. CSE, Maths, Physics, Chemistry & Social Science. $15–$100+/hour, flexible hours, work from anywhere."
        />
        <link rel="canonical" href={PAGE_URL} />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <meta property="og:title" content="Doubt Expert Jobs in USA – Remote | Tutvex" />
        <meta
          property="og:description"
          content="Selective onboarding for qualified subject experts. Remote, flexible, $15–$100+/hour."
        />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <NavBar />

      <main className="bg-[#0a0f1c] text-gray-300 font-sans overflow-x-clip">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="blob blob-a" />
          <div className="blob blob-b" />
          <div className="grid-bg" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 py-14 sm:py-20 lg:grid-cols-2">
            {/* Text */}
            <div>
              <span className="hero-in inline-flex items-center gap-2 rounded-full border border-[#1e2740] bg-[#151b2e] px-3.5 py-1.5 text-[11px] font-semibold text-cyan-400">
                <span className="pulse-dot" /> 🇺🇸 USA • Remote • Flexible
              </span>
              <h1 className="hero-in mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]" style={{ animationDelay: "80ms" }}>
                Tutvex is Hiring{" "}
                <span className="shimmer-text">Subject Matter Experts</span>{" "}
                <span className="whitespace-nowrap">(Doubt Experts)</span>
              </h1>
              <p className="hero-in mt-5 max-w-xl text-sm sm:text-base text-gray-400 leading-relaxed" style={{ animationDelay: "160ms" }}>
                We are onboarding experienced and qualified experts across multiple academic domains to solve
                students&apos; doubts with accuracy and clarity.
              </p>
              <div className="hero-in mt-8 flex flex-col sm:flex-row gap-3" style={{ animationDelay: "240ms" }}>
                <ApplyButton />
                <a
                  href="#roles"
                  className="inline-flex items-center justify-center rounded-xl border border-[#1e2740] bg-[#151b2e] px-6 py-3.5 text-sm font-semibold text-gray-200 hover:border-indigo-500/50 transition-colors"
                >
                  View open roles
                </a>
              </div>

              <div className="hero-in mt-9 grid max-w-md grid-cols-3 gap-3" style={{ animationDelay: "320ms" }}>
                {[
                  ["$15–$100+", "per hour"],
                  ["100%", "remote"],
                  ["Flexible", "hours"],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-xl border border-[#1e2740] bg-[#0d1324]/80 px-3 py-3 backdrop-blur">
                    <div className="text-base sm:text-lg font-bold text-white">{a}</div>
                    <div className="text-[11px] text-gray-500">{b}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo collage */}
            <div className="hero-in relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "160ms" }}>
              <div className="relative">
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-indigo-500/60 via-transparent to-cyan-400/60 blur-md opacity-70" />
                <Photo
                  img={IMG.hero}
                  zoom
                  priority
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="hero-photo relative aspect-[4/3] sm:aspect-square w-full rounded-[2rem] border border-white/10"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-t from-[#0a0f1c]/70 via-transparent to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="float-a absolute -left-3 top-8 sm:-left-8 rounded-2xl border border-white/10 bg-[#0d1324]/90 px-4 py-3 shadow-xl backdrop-blur">
                <div className="text-[10px] uppercase tracking-wider text-gray-500">Earn up to</div>
                <div className="text-xl font-extrabold text-white">$100+<span className="text-xs font-medium text-cyan-400"> /hr</span></div>
              </div>
              <div className="float-b absolute -right-2 bottom-24 sm:-right-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0d1324]/90 px-4 py-3 shadow-xl backdrop-blur">
                <span className="text-xl">✅</span>
                <div>
                  <div className="text-xs font-semibold text-white">Step-by-step solutions</div>
                  <div className="text-[10px] text-gray-500">Accuracy first</div>
                </div>
              </div>
              <Photo
                img={IMG.laptop}
                sizes="180px"
                className="float-c absolute -bottom-6 left-4 h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-[#0a0f1c] shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── Subject marquee ── */}
        <div className="border-y border-[#141b2d] bg-[#0b1120] py-4 overflow-hidden">
          <div className="marquee">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-6 whitespace-nowrap text-sm font-semibold text-gray-500">
                {m} <span className="text-indigo-500">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── In simple words ── */}
        <section className="mx-auto max-w-5xl px-5 sm:px-8 pt-16">
          <SectionTitle eyebrow="In simple words" title="What does a Doubt Expert do?" />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: "🧑‍🏫",
                title: "Your work",
                text: "As a Doubt Expert, you help students who are stuck. A student sends a question or a problem from a subject you know well, like Maths, Physics, Chemistry, Computer Science or Social Science. You solve it and explain it step by step, in simple language, so the student really understands the idea and not just the final answer. You may also check solutions that others have written and confirm that they are correct.",
              },
              {
                icon: "📥",
                title: "How you get work",
                text: "You do not have to search for students or promote yourself. After you apply and your qualifications are reviewed, you are onboarded and will receive subject-specific assignments that match your expertise. You pick up the work you are comfortable with and complete it online. The exact steps are shared with you during onboarding.",
              },
              {
                icon: "💻",
                title: "Where and when you work",
                text: "Everything is online, so you can work from home or from anywhere with a laptop and internet. There are no fixed shifts. You decide when you want to work, so it fits easily around your teaching job, classes or other commitments.",
              },
              {
                icon: "💰",
                title: "What you earn",
                text: "Payment is per hour, roughly from $15 to $100 or more. The rate depends on your subject, your qualifications, your experience and how difficult the task is. Experts with higher qualifications and harder subjects can earn more. Rates are not fixed or guaranteed.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="card-hover h-full rounded-2xl border border-[#1e2740] bg-[#0d1324] p-6">
                  <div className="flex items-center gap-3">
                    <div className="icon-pop flex h-11 w-11 items-center justify-center rounded-xl bg-[#151b2e] text-2xl">{c.icon}</div>
                    <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  </div>
                  <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-gray-400">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4 text-sm leading-relaxed text-gray-300">
              <span className="font-semibold text-white">Is this right for you?</span> If you enjoy teaching, can
              explain difficult topics in an easy way, and want to earn from your knowledge on your own schedule,
              this role is made for you. Just click <span className="font-semibold text-cyan-400">Apply Now</span> to begin.
            </p>
          </Reveal>
        </section>

        {/* ── Open Roles ── */}
        <section id="roles" className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
          <SectionTitle eyebrow="Open Roles" title="Subjects we are hiring for" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <div className="card-hover group h-full rounded-2xl border border-[#1e2740] bg-[#0d1324] p-5">
                  <div className="icon-pop flex h-12 w-12 items-center justify-center rounded-xl bg-[#151b2e] text-2xl">{r.icon}</div>
                  <h3 className="mt-4 text-base font-semibold text-white">{r.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Photo band ── */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-6">
          <Reveal>
            <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold">Real learners. Real doubts.</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-white tracking-tight">Help students across the USA</h2>
              </div>
              <p className="max-w-sm text-sm text-gray-500">
                From classroom homework to college-level problems, your explanations make the difference.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:grid-rows-2">
            <Reveal from="zoom" className="group col-span-2 md:row-span-2">
              <Photo img={IMG.classroom} className="h-56 md:h-full min-h-[240px] rounded-2xl" sizes="(max-width: 768px) 100vw, 66vw" />
            </Reveal>
            <Reveal from="zoom" delay={100} className="group">
              <Photo img={IMG.online} className="h-40 md:h-full rounded-2xl" sizes="(max-width: 768px) 50vw, 33vw" />
            </Reveal>
            <Reveal from="zoom" delay={180} className="group">
              <Photo img={IMG.board} className="h-40 md:h-full rounded-2xl" sizes="(max-width: 768px) 50vw, 33vw" />
            </Reveal>
          </div>
        </section>

        {/* ── Curricula + Collaborations ── */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
          {/* always visible (no scroll-reveal) so it can never stay hidden */}
          <div id="partners">
            <div className="relative overflow-hidden rounded-3xl border border-[#1e2740] bg-gradient-to-br from-[#0d1324] to-[#0b1120] p-6 sm:p-10">
              <div className="relative">
                <div className="flex flex-wrap gap-2">
                  {["US", "Canadian", "British", "Australian"].map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300"
                    >
                      {c} curriculum
                    </span>
                  ))}
                </div>
                <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-gray-200">
                  Adept at supporting diverse international curricula, including US, Canadian, British, and
                  Australian education systems, while delivering engaging, accurate, and student-focused learning
                  experiences.
                </p>

                <div className="mt-8 border-t border-[#1e2740] pt-6">
                  <p className="text-[11px] uppercase tracking-widest text-cyan-400 font-semibold">
                    Collaborating with leading international online tutoring companies
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Europe, Africa, China, India, Singapore &amp; Asia</p>
                  <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                    {partners.map((p) => (
                      <PartnerCard key={p.name} p={p} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Who can apply + Responsibilities ── */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal from="left">
              <div className="card-hover h-full rounded-2xl border border-[#1e2740] bg-[#0d1324] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white">Who can apply?</h2>
                <p className="mt-2 text-sm text-gray-500">
                  This is a selective onboarding for qualified faculty members and subject experts — not an open
                  application for everyone.
                </p>
                <ul className="mt-5 space-y-3">
                  {whoCanApply.map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-gray-300">
                      <Check />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal from="right">
              <div className="card-hover h-full rounded-2xl border border-[#1e2740] bg-[#0d1324] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white">Role &amp; responsibilities</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Subject-specific assignments where accuracy and clear explanations come first.
                </p>
                <ul className="mt-5 space-y-3">
                  {responsibilities.map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-gray-300">
                      <Check />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Benefits (with photo) ── */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
          <SectionTitle eyebrow="Compensation & Perks" title="Why work with Tutvex" />
          <div className="grid items-stretch gap-6 lg:grid-cols-5">
            <Reveal from="left" className="group lg:col-span-2">
              <Photo img={IMG.desk} className="h-64 lg:h-full min-h-[280px] rounded-2xl" sizes="(max-width: 1024px) 100vw, 40vw" />
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 80}>
                  <div className="card-hover h-full rounded-2xl border border-[#1e2740] bg-[#0d1324] p-5">
                    <div className="icon-pop inline-block text-3xl">{b.icon}</div>
                    <h3 className="mt-3 text-base font-semibold text-white">{b.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            Compensation varies by subject, qualifications, experience and task complexity. Rates are not guaranteed.
          </p>
        </section>

        {/* ── Process ── */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
          <SectionTitle eyebrow="How it works" title="Simple onboarding in 4 steps" />
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-[2.7rem] hidden h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-cyan-400/0 lg:block" />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="card-hover relative h-full rounded-2xl border border-[#1e2740] bg-[#0d1324] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-indigo-900/50">
                    {s.n}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-16">
          <Reveal from="zoom">
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30">
              <Photo img={IMG.lecture} className="absolute inset-0 h-full w-full" sizes="(max-width: 1024px) 100vw, 1024px" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c]/95 via-[#0a0f1c]/85 to-indigo-900/70" />
              <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">
                <h2 className="text-2xl sm:text-4xl font-bold text-white">Ready to share your expertise?</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-gray-300">
                  Help students learn better while working on your own schedule. Qualified candidates will receive
                  further onboarding instructions.
                </p>
                <ApplyButton className="mt-7 pulse-ring" label="Apply Now" />
                <p className="mx-auto mt-5 max-w-xl text-[11px] leading-relaxed text-gray-500">
                  Applications and onboarding are handled through our partner platform, Handshake. Clicking Apply
                  Now will take you to their website, where their terms and privacy policy apply.
                </p>
              </div>
            </div>
          </Reveal>
          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Tutvex – Making Quality Education Accessible to Every Student.
          </p>
          <p className="mt-2 text-center text-[10px] text-gray-700">
            Photos via{" "}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">
              Unsplash
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        /* scroll reveal */
        .rv { opacity: 0; transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); will-change: transform, opacity; }
        .rv-up { transform: translateY(28px); }
        .rv-left { transform: translateX(-36px); }
        .rv-right { transform: translateX(36px); }
        .rv-zoom { transform: scale(.94); }
        .rv-in { opacity: 1; transform: none; }

        /* hero entrance */
        @keyframes heroIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .hero-in { opacity: 0; animation: heroIn .8s cubic-bezier(.2,.7,.2,1) forwards; }

        /* keep the teacher in frame on small screens */
        .hero-photo img { object-position: 78% 30%; }

        /* slow zoom on hero photo */
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.12); } }
        .kenburns { animation: kenburns 18s ease-in-out infinite alternate; }

        /* floating cards */
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .float-a { animation: floaty 5s ease-in-out infinite; }
        .float-b { animation: floaty 6s ease-in-out .8s infinite; }
        .float-c { animation: floaty 7s ease-in-out .4s infinite; }

        /* background blobs + grid */
        @keyframes drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.15); } }
        .blob { position: absolute; border-radius: 9999px; filter: blur(80px); pointer-events: none; }
        .blob-a { top: -120px; left: -80px; width: 420px; height: 420px; background: rgba(79,70,229,.28); animation: drift 14s ease-in-out infinite; }
        .blob-b { bottom: -140px; right: -60px; width: 380px; height: 380px; background: rgba(6,182,212,.20); animation: drift 17s ease-in-out infinite reverse; }
        .grid-bg { position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 44px 44px; mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%); }

        /* headline shimmer */
        @keyframes shimmer { to { background-position: 200% center; } }
        .shimmer-text { background: linear-gradient(90deg,#818cf8,#22d3ee,#818cf8); background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 5s linear infinite; }

        /* live dot */
        @keyframes ping { 75%,100% { transform: scale(2.2); opacity: 0; } }
        .pulse-dot { position: relative; display: inline-block; width: 7px; height: 7px; border-radius: 9999px; background: #22d3ee; }
        .pulse-dot::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: #22d3ee; animation: ping 1.8s cubic-bezier(0,0,.2,1) infinite; }

        /* marquee */
        @keyframes scrollX { to { transform: translateX(-50%); } }
        .marquee { display: flex; width: max-content; animation: scrollX 28s linear infinite; }
        .marquee:hover { animation-play-state: paused; }

        /* cards */
        .card-hover { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .card-hover:hover { transform: translateY(-6px); border-color: rgba(99,102,241,.55); box-shadow: 0 18px 40px -18px rgba(79,70,229,.45); }
        .icon-pop { transition: transform .3s ease; }
        .card-hover:hover .icon-pop { transform: scale(1.15) rotate(-6deg); }

        /* button shine + arrow */
        .apply-btn::before { content: ""; position: absolute; top: 0; left: -75%; width: 50%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); animation: shine 3.2s ease-in-out infinite; }
        @keyframes shine { 0% { left: -75%; } 55%,100% { left: 130%; } }
        .apply-btn .arrow { transition: transform .25s ease; }
        .apply-btn:hover .arrow { transform: translateX(5px); }
        @keyframes ring { 0% { box-shadow: 0 0 0 0 rgba(34,211,238,.5); } 100% { box-shadow: 0 0 0 18px rgba(34,211,238,0); } }
        .pulse-ring { animation: ring 2s ease-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .rv, .hero-in { opacity: 1 !important; transform: none !important; transition: none !important; animation: none !important; }
          .kenburns, .float-a, .float-b, .float-c, .blob, .shimmer-text, .marquee, .apply-btn::before, .pulse-ring, .pulse-dot::after { animation: none !important; }
        }
      `}</style>
    </>
  );
}

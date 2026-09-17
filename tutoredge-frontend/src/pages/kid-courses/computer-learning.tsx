import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';

/* ─── TOPIC DATA with class groups, icons, descriptions ─── */
const topicGroups = [
  {
    grade: 'Class 1 – 2',
    emoji: '🌱',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    topics: [
      { title: 'Introduction to Computers', icon: '💻', desc: 'What is a computer? Parts and purpose explained simply.' },
      { title: 'Parts of a Computer', icon: '🖥️', desc: 'Monitor, keyboard, mouse, CPU — learn each one.' },
      { title: 'Using Keyboard & Mouse', icon: '⌨️', desc: 'Control and navigate with confidence.' },
      { title: 'Basic Typing Skills', icon: '✍️', desc: 'Start touch-typing the fun way.' },
      { title: 'Drawing with Paint App', icon: '🎨', desc: 'Express creativity using digital painting tools.' },
    ],
  },
  {
    grade: 'Class 3 – 5',
    emoji: '🚀',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    topics: [
      { title: 'Introduction to MS Word', icon: '📝', desc: 'Create and format documents like a pro.' },
      { title: 'Basic Word Processing', icon: '🗒️', desc: 'Edit, format, and save text documents.' },
      { title: 'MS PowerPoint Basics', icon: '📊', desc: 'Build beautiful slides and present ideas.' },
      { title: 'Simple Presentations', icon: '🎤', desc: 'Tell stories through engaging slideshows.' },
      { title: 'Internet & Search Engines', icon: '🌐', desc: 'Navigate the web and find reliable information.' },
      { title: 'Safe Internet Practices', icon: '🛡️', desc: 'Stay safe, smart, and responsible online.' },
      { title: 'Email Basics', icon: '📧', desc: 'Write, send, and manage emails correctly.' },
    ],
  },
  {
    grade: 'Class 6 – 8',
    emoji: '🧠',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.25)',
    topics: [
      { title: 'MS Excel & Formulas', icon: '📈', desc: 'Spreadsheets, data, and basic formulas.' },
      { title: 'Intermediate Typing', icon: '⚡', desc: 'Build speed and accuracy on the keyboard.' },
      { title: 'Scratch Programming', icon: '🐱', desc: 'Drag-and-drop coding with visual blocks.' },
      { title: 'Basic Python Concepts', icon: '🐍', desc: 'Write your first real programs in Python.' },
      { title: 'Digital Ethics & Cyber Safety', icon: '🔐', desc: 'Understand online rights, privacy, and risks.' },
      { title: 'File Handling & Organization', icon: '📁', desc: 'Manage digital files like a professional.' },
      { title: 'Fun Projects', icon: '🎮', desc: 'Create games, animations, and stories using code.' },
    ],
  },
];

const stats = [
  { val: '19+', label: 'Topics Covered', icon: '📚' },
  { val: '3', label: 'Learning Stages', icon: '🎯' },
  { val: 'Class 1–8', label: 'All Grades', icon: '🏫' },
  { val: '100%', label: 'Hands-On', icon: '🤝' },
];

const benefits = [
  { icon: '🖥️', title: 'Real Software Skills', desc: 'MS Word, Excel, PowerPoint — tools used in school and work.' },
  { icon: '🐍', title: 'Coding from Scratch', desc: 'Scratch and Python introduce programming thinking early.' },
  { icon: '🛡️', title: 'Internet Safety', desc: 'Children learn responsible, safe digital behaviour.' },
  { icon: '🎨', title: 'Digital Creativity', desc: 'Paint, design, animate — express yourself digitally.' },
  { icon: '📈', title: 'Progress at Every Stage', desc: 'Curriculum grows with the child — Class 1 to 8.' },
  { icon: '👨‍🏫', title: 'Expert Tutors', desc: 'Experienced educators guide every step.' },
];

const faqs = [
  { q: 'What age group is this course for?', a: 'This course is designed for children from Class 1 (approx. 6 years) to Class 8 (approx. 14 years), with age-appropriate content at each level.' },
  { q: 'Does my child need a computer at home?', a: 'Yes, access to a computer or laptop is recommended for practice. A tablet can work for basic lessons but a computer is ideal for MS Office and coding.' },
  { q: 'Is coding included in the syllabus?', a: 'Yes! Classes 6–8 include both Scratch (visual block programming) and Basic Python, giving children a strong foundation in programming.' },
  { q: 'How are the sessions conducted?', a: 'Sessions are conducted online via video call, with screen-sharing and interactive exercises. Tutors provide personalised attention.' },
  { q: 'Will my child get any projects or assignments?', a: 'Absolutely. Each level includes hands-on projects like creating a presentation, building a simple game in Scratch, or making an Excel report.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  }),
};

/* ══════════════════════════ COMPONENT ══════════════════════════ */
const ComputerLearning = () => {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Head>
        {/* ── SEO Meta Tags ── */}
        <title>Computer Learning for Kids (Class 1–8) | Coding, MS Office & Internet Safety</title>
        <meta name="description" content="Comprehensive computer learning course for children Class 1 to 8. Covers MS Word, Excel, PowerPoint, Python, Scratch, internet safety, typing, and digital creativity. Expert online tutors." />
        <meta name="keywords" content="computer learning for kids, computer course class 1 to 8, coding for children, MS Office for students, Python for kids, Scratch programming, internet safety for children, typing skills, digital literacy" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="EduTutor" />
        <link rel="canonical" href="https://Tutvex.com/kids-courses/computer-learning" />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Computer Learning for Kids (Class 1–8) | Coding, MS Office & Internet Safety" />
        <meta property="og:description" content="Fun, hands-on computer education for children. Learn typing, MS Office, Python, Scratch, and internet safety with expert online tutors." />
        <meta property="og:image" content="https://Tutvex.com/images/kids-courses/computer.png" />
        <meta property="og:url" content="https://Tutvex.com/kids-courses/computer-learning" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Computer Learning for Kids (Class 1–8)" />
        <meta name="twitter:description" content="Coding, MS Office, internet safety and digital creativity for children — Class 1 to 8." />
        <meta name="twitter:image" content="https://Tutvex.com/images/kids-courses/computer.png" />

        {/* ── Structured Data (JSON-LD) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "Computer Learning for Kids – Class 1 to 8",
              "description": "Comprehensive computer education covering MS Office, coding (Python & Scratch), internet safety, typing, and digital creativity for children from Class 1 to 8.",
              "provider": {
                "@type": "Organization",
                "name": "EduTutor",
                "sameAs": "https://Tutvex.com"
              },
              "educationalLevel": "Primary and Middle School",
              "teaches": ["Computer Basics", "MS Word", "MS Excel", "MS PowerPoint", "Python Programming", "Scratch", "Internet Safety", "Typing Skills"],
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "inLanguage": "en"
              }
            })
          }}
        />

        {/* ── Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

        <style>{`
          .cl-root { font-family: 'Nunito', sans-serif; }
          .cl-display { font-family: 'Syne', sans-serif; }
          .cl-cta-main {
            background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%);
            background-size: 200% auto;
            transition: background-position 0.5s, box-shadow 0.3s, transform 0.2s;
            box-shadow: 0 8px 28px rgba(34,197,94,0.38);
          }
          .cl-cta-main:hover {
            background-position: right center;
            box-shadow: 0 12px 40px rgba(34,197,94,0.55);
            transform: translateY(-2px);
          }
          .cl-back-btn:hover { background: #15803d !important; transform: translateX(-3px); transition: all 0.2s; }
          .cl-topic-card:hover { transform: translateY(-4px) scale(1.015); box-shadow: 0 12px 36px rgba(0,0,0,0.1) !important; transition: all 0.25s; }
          .cl-benefit-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; transition: all 0.25s; }
          .cl-stat-card:hover { transform: translateY(-3px); transition: transform 0.2s; }
          .cl-faq-item { transition: background 0.2s; }
          .cl-faq-item:hover { background: rgba(34,197,94,0.04) !important; }

          /* floating blobs animation */
          @keyframes cl-float { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-18px) rotate(4deg);} }
          @keyframes cl-float2 { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-12px) rotate(-5deg);} }
          @keyframes cl-pulse { 0%,100%{opacity:0.5;transform:scale(1);} 50%{opacity:0.8;transform:scale(1.04);} }

          /* hero animated dots grid */
          .cl-dots-bg {
            background-image: radial-gradient(circle, rgba(34,197,94,0.18) 1.5px, transparent 1.5px);
            background-size: 28px 28px;
          }

          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #f0fdf4; }
          ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.4); border-radius: 3px; }
        `}</style>
      </Head>

      <div className="cl-root" style={{ background: '#f8fffe', minHeight: '100vh', overflowX: 'hidden' }}>
        <NavBar />

        {/* ══════════ HERO ══════════ */}
        <section
          style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 40%, #d1fae5 100%)', paddingBottom: 0 }}
          aria-label="Computer Learning Course Hero"
        >
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -60, right: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,239,172,0.5) 0%, transparent 70%)', animation: 'cl-float 7s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', animation: 'cl-float2 9s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '30%', left: '5%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', animation: 'cl-pulse 6s ease-in-out infinite', pointerEvents: 'none' }} />

          {/* Dots grid */}
          <div className="cl-dots-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

          <div style={{
              maxWidth: 1400,   // 1160 se 1400 kar do
              width: '100%',
              margin: '0 auto',
              padding: '40px 20px 0'
            }}>
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/#kids-courses')}
              className="cl-back-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 20px', fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 36 }}
            >
              ← Back to Courses
            </motion.button>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40, paddingBottom: 0 }}>
              {/* Left text */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#15803d', fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 9999, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>
                    📚 Kids Course · Class 1–8
                  </span>
                </motion.div>

                <motion.h1
                  className="cl-display"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#14532d', margin: '0 0 18px' }}
                >
                  💻 Computer Learning
                  <span style={{ display: 'block', color: '#16a34a' }}>for Smart Kids</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ fontSize: 17, color: '#166534', lineHeight: 1.75, marginBottom: 14, maxWidth: 520 }}
                >
                  From <strong>typing and MS Office</strong> to <strong>Python coding</strong> and <strong>internet safety</strong> — our structured curriculum grows with your child from Class 1 all the way to Class 8.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  style={{ fontSize: 16, color: '#166534', lineHeight: 1.75, marginBottom: 28, maxWidth: 520, opacity: 0.82 }}
                >
                  Hands-on projects, interactive lessons, and expert tutors help children build real digital skills — preparing them for school, exams, and the future.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
                >
                  <button
                    onClick={() => router.push('/find-tutor')}
                    className="cl-cta-main"
                    style={{ border: 'none', borderRadius: 16, padding: '14px 28px', color: '#fff', fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
                  >
                    🎓 Find a Tutor Now
                  </button>
                  <button
                    onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ border: '2px solid rgba(34,197,94,0.5)', borderRadius: 16, padding: '14px 24px', color: '#16a34a', background: 'rgba(34,197,94,0.06)', fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    📋 View Topics
                  </button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}
                >
                  {['✅ Expert Tutors', '🕐 Flexible Timings', '🖥️ Live Online Classes', '📜 Completion Certificate'].map(b => (
                    <span key={b} style={{ fontSize: 12, fontWeight: 700, color: '#166534', background: 'rgba(34,197,94,0.12)', padding: '4px 12px', borderRadius: 9999, border: '1px solid rgba(34,197,94,0.25)' }}>{b}</span>
                  ))}
                </motion.div>
              </div>

              {/* Right image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ flex: 1, minWidth: 240, display: 'flex', justifyContent: 'center', position: 'relative' }}
              >
                {/* Decorative ring */}
                <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
                <img
                  src="/images/kids-courses/computer.png"
                  alt="Child learning computer skills with a tutor"
                  style={{ width: '100%', maxWidth: 380, objectFit: 'contain', filter: 'drop-shadow(0 20px 48px rgba(34,197,94,0.25))', position: 'relative', zIndex: 1 }}
                />
              </motion.div>
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 44, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 24, padding: '20px 28px' }}
            >
              {stats.map(({ val, label, icon }) => (
                <div key={label} className="cl-stat-card" style={{ textAlign: 'center', padding: '8px 4px' }}>
                  <div style={{ fontSize: 26 }}>{icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#16a34a', lineHeight: 1, marginTop: 4 }}>{val}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Wave divider */}
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', marginTop: 24 }}>
            <path d="M0 0L60 8C120 16 240 32 360 37.3C480 43 600 37 720 29.3C840 21 960 11 1080 8C1200 5 1320 11 1380 13.7L1440 16V56H1380C1320 56 1200 56 1080 56C960 56 840 56 720 56C600 56 480 56 360 56C240 56 120 56 60 56H0V0Z" fill="#f8fffe" />
          </svg>
        </section>

        {/* ══════════ TOPICS BY CLASS ══════════ */}
        <section id="topics" style={{ background: '#f8fffe', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', marginBottom: 52 }}
            >
              <span style={{ display: 'inline-block', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 9999, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
                Full Syllabus
              </span>
              <h2 className="cl-display" style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: '#14532d', margin: '0 0 12px' }}>
                Topics Covered — Class 1 to 8
              </h2>
              <p style={{ fontSize: 16, color: '#4b7a5c', maxWidth: 560, margin: '0 auto' }}>
                Our curriculum is structured in 3 stages, ensuring every child learns at the right pace with the right content.
              </p>
            </motion.div>

            {topicGroups.map((group, gi) => (
              <motion.div
                key={group.grade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={gi}
                style={{ marginBottom: 48 }}
              >
                {/* Group header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: group.bg, border: `1.5px solid ${group.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    {group.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: group.color, margin: 0 }}>{group.grade}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0', fontWeight: 600 }}>{group.topics.length} topics</p>
                  </div>
                  <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${group.border}, transparent)`, borderRadius: 1 }} />
                </div>

                {/* Topic cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                  {group.topics.map((topic, ti) => (
                    <motion.div
                      key={topic.title}
                      className="cl-topic-card"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: ti * 0.055 }}
                      style={{ background: '#fff', border: `1.5px solid ${group.border}`, borderRadius: 20, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'default' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 24 }}>{topic.icon}</span>
                        <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: group.color, margin: 0, lineHeight: 1.25 }}>{topic.title}</h4>
                      </div>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{topic.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════ WHY CHOOSE ══════════ */}
        <section style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', padding: '64px 24px' }} aria-label="Benefits of Computer Learning Course">
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 48 }}
            >
              <span style={{ display: 'inline-block', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 9999, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
                Why This Course
              </span>
              <h2 className="cl-display" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#14532d', margin: '0 0 12px' }}>
                What Your Child Will Gain
              </h2>
              <p style={{ fontSize: 16, color: '#4b7a5c', maxWidth: 500, margin: '0 auto' }}>
                Skills that matter — both in the classroom and in life.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  className="cl-benefit-card"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  style={{ background: '#fff', border: '1.5px solid rgba(34,197,94,0.18)', borderRadius: 22, padding: '24px 22px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>
                    {b.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#14532d', margin: '0 0 8px' }}>{b.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.65 }}>{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <section style={{ background: '#fff', padding: '64px 24px' }} aria-label="How Computer Learning Course Works">
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: 48 }}
            >
              <span style={{ display: 'inline-block', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 9999, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
                Simple Process
              </span>
              <h2 className="cl-display" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#14532d', margin: '0 0 12px' }}>
                How It Works
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
              {[
                { step: '01', icon: '🔍', title: 'Choose Your Class', desc: "Select your child's class level." },
                { step: '02', icon: '👨‍🏫', title: 'Match a Tutor',    desc: 'Pick from expert, verified tutors.' },
                { step: '03', icon: '📅', title: 'Book a Demo',       desc: 'Start with a free demo class.' },
                { step: '04', icon: '🚀', title: 'Start Learning',    desc: 'Live sessions at flexible times.' },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  style={{ position: 'relative', textAlign: 'center', padding: '24px 16px' }}
                >
                  {/* Connector line */}
                  {i < 3 && (
                    <div style={{ position: 'absolute', top: 36, right: -12, width: 24, height: 2, background: 'rgba(34,197,94,0.3)', display: 'none' }} />
                  )}
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>
                    {s.icon}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 800, color: '#22c55e', letterSpacing: '0.1em', marginBottom: 6 }}>STEP {s.step}</div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: '#14532d', margin: '0 0 6px' }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FAQ ══════════ */}
        <section style={{ background: '#f0fdf4', padding: '64px 24px' }} aria-label="Frequently Asked Questions about Computer Learning">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 44 }}
            >
              <span style={{ display: 'inline-block', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 9999, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
                FAQ
              </span>
              <h2 className="cl-display" style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800, color: '#14532d', margin: '0 0 10px' }}>
                Common Questions
              </h2>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="cl-faq-item"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{ background: '#fff', border: '1.5px solid rgba(34,197,94,0.2)', borderRadius: 18, overflow: 'hidden' }}
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12, fontFamily: "'Nunito', sans-serif" }}
                    aria-expanded={openFaq === i}
                  >
                    <span itemProp="name" style={{ fontSize: 15, fontWeight: 800, color: '#14532d', lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ fontSize: 20, color: '#22c55e', flexShrink: 0, transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      itemScope
                      itemType="https://schema.org/Answer"
                      style={{ padding: '0 22px 18px' }}
                    >
                      <p itemProp="text" style={{ fontSize: 14, color: '#4b7a5c', lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CTA BANNER ══════════ */}
        <section style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)', padding: '64px 24px', position: 'relative', overflow: 'hidden' }} aria-label="Call to Action">
          {/* Decorative */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,239,172,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 className="cl-display" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>
              Ready to Start Your Child's Digital Journey?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Join hundreds of children already learning computer skills with our expert tutors. Book a <strong style={{ color: '#86efac' }}>free demo class</strong> today — no commitment needed.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <button
                onClick={() => router.push('/tutors')}
                style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', color: '#14532d', border: 'none', borderRadius: 16, padding: '15px 32px', fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 28px rgba(34,197,94,0.4)', transition: 'all 0.25s' }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 36px rgba(34,197,94,0.55)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(34,197,94,0.4)'; }}
              >
                🎓 Find a Tutor for Your Child
              </button>
              <button
                onClick={() => router.push('/#kids-courses')}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 16, padding: '15px 24px', fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
              >
                ← Browse All Courses
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              <span style={{ color: '#fbbf24' }}>★★★★★</span>
              <span>Trusted by <strong style={{ color: 'rgba(255,255,255,0.85)' }}>5000+ families</strong> across India</span>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};
export default ComputerLearning;
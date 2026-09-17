import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

/* ─── DATA ─── */
const subjects = [
  { name: 'Mathematics', emoji: '📐', color: '#6C63FF', bg: 'rgba(108,99,255,0.09)', border: 'rgba(108,99,255,0.22)', desc: 'Algebra, Geometry, Mensuration, Fractions, Decimals, Word Problems & Logical Reasoning.', tags: ['Algebra', 'Geometry', 'Reasoning'] },
  { name: 'Science', emoji: '🔬', color: '#00C9A7', bg: 'rgba(0,201,167,0.09)', border: 'rgba(0,201,167,0.22)', desc: 'Physics, Chemistry, Biology with experiments, observations, and scientific thinking.', tags: ['Physics', 'Chemistry', 'Biology'] },
  { name: 'English', emoji: '📖', color: '#FF6B6B', bg: 'rgba(255,107,107,0.09)', border: 'rgba(255,107,107,0.22)', desc: 'Grammar, Writing, Literature, Reading Comprehension, Vocabulary & Speaking Practice.', tags: ['Grammar', 'Literature', 'Writing'] },
  { name: 'Hindi', emoji: '🖊️', color: '#FF9F43', bg: 'rgba(255,159,67,0.09)', border: 'rgba(255,159,67,0.22)', desc: 'Grammar, Vocabulary, Creative Writing, Literature, Comprehension & Speaking Skills.', tags: ['Grammar', 'Vocabulary', 'Writing'] },
  { name: 'Social Science', emoji: '🌏', color: '#54A0FF', bg: 'rgba(84,160,255,0.09)', border: 'rgba(84,160,255,0.22)', desc: 'History, Civics, Geography, Cultural Awareness, Map Skills & Current Affairs.', tags: ['History', 'Geography', 'Civics'] },
  { name: 'Computer Basics', emoji: '💻', color: '#5F27CD', bg: 'rgba(95,39,205,0.09)', border: 'rgba(95,39,205,0.22)', desc: 'MS Office, Typing, Internet Basics, Coding Fundamentals & Cyber Safety.', tags: ['Coding', 'MS Office', 'Safety'] },
  { name: 'Art & Craft', emoji: '🎨', color: '#EE5A24', bg: 'rgba(238,90,36,0.09)', border: 'rgba(238,90,36,0.22)', desc: 'Drawing, Painting, DIY Projects, Creative Expression & School Projects.', tags: ['Drawing', 'Painting', 'DIY'] },
];

const highlights = [
  { icon: '🏆', val: '1200+', label: 'Students Enrolled', color: '#6C63FF' },
  { icon: '⭐', val: '4.8/5', label: 'Average Rating', color: '#FF9F43' },
  { icon: '👩‍🏫', val: '700+', label: 'Expert Tutors', color: '#00C9A7' },
  { icon: '📚', val: '7', label: 'Subjects Covered', color: '#FF6B6B' },
];

const features = [
  { icon: '🎯', title: 'Concept-Based Learning', desc: 'Deep understanding over rote memorization — we explain the "why" behind every topic.', color: '#6C63FF' },
  { icon: '🧪', title: 'Live Experiments', desc: 'Hands-on experiments and observations make science come alive beyond the textbook.', color: '#00C9A7' },
  { icon: '🧩', title: 'Logical Reasoning', desc: 'Exercises that sharpen analytical thinking and problem-solving from an early age.', color: '#FF9F43' },
  { icon: '📈', title: 'Progress Tracking', desc: "Regular assessments and parent reports to monitor your child's academic growth.", color: '#FF6B6B' },
];

const testimonials = [
  { name: 'Priya Sharma', grade: 'Class 7 Parent', text: "My daughter's grades improved drastically in just 2 months. The tutors are incredibly patient!", avatar: '👩', stars: 5 },
  { name: 'Rahul Gupta', grade: 'Class 6 Student', text: 'Science was my weakest subject. Now I actually look forward to it! The experiments are so cool.', avatar: '👦', stars: 5 },
  { name: 'Anita Mehta', grade: 'Class 8 Parent', text: "Exceptional teachers and a structured approach. My son's confidence has grown tremendously.", avatar: '👩‍💼', stars: 5 },
];

/* NEW: AI & Speciality Courses */
const aiCourses = [
  {
    name: 'AI & Machine Learning for Kids',
    emoji: '🤖',
    badge: 'NEW',
    badgeColor: '#6C63FF',
    gradient: 'linear-gradient(135deg,#6C63FF,#a78bfa)',
    desc: 'Introduction to AI concepts, how machines learn, ChatGPT basics, simple ML models using Scratch & Python.',
    tags: ['AI Basics', 'Python', 'Scratch', 'ChatGPT'],
    level: 'Class 6–8',
    duration: '3 Months',
  },
  {
    name: 'Coding & Web Development',
    emoji: '💻',
    badge: 'HOT',
    badgeColor: '#FF6B6B',
    gradient: 'linear-gradient(135deg,#FF6B6B,#FF9F43)',
    desc: 'HTML, CSS, JavaScript basics. Build your first website and small games. Learn the language of the web.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Projects'],
    level: 'Class 6–10',
    duration: '4 Months',
  },
  {
    name: 'Robotics & Arduino',
    emoji: '🦾',
    badge: 'STEM',
    badgeColor: '#00C9A7',
    gradient: 'linear-gradient(135deg,#00C9A7,#54A0FF)',
    desc: 'Build real robots! Learn electronics, sensors, Arduino programming, and logic with hands-on kits.',
    tags: ['Arduino', 'Electronics', 'Sensors', 'Logic'],
    level: 'Class 7–10',
    duration: '3 Months',
  },
  {
    name: 'Data Science Foundations',
    emoji: '📊',
    badge: 'FUTURE',
    badgeColor: '#5F27CD',
    gradient: 'linear-gradient(135deg,#5F27CD,#6C63FF)',
    desc: 'Charts, patterns, statistics, and Python for data. Understand how data powers the modern world.',
    tags: ['Python', 'Statistics', 'Charts', 'Excel'],
    level: 'Class 8–10',
    duration: '3 Months',
  },
];

/* NEW: Other Course Types */
const otherCourses = [
  {
    name: 'Senior Section',
    sub: 'Class 9th – 10th',
    emoji: '🎓',
    color: '#6C63FF',
    gradient: 'linear-gradient(135deg,#6C63FF 0%,#a78bfa 100%)',
    desc: 'Board exam prep, CBSE/ICSE syllabus mastery, Maths, Science, English & SST with expert tutors.',
    href: '/subjects',
    tags: ['CBSE', 'ICSE', 'Board Prep'],
  },
  {
    name: 'Primary Section',
    sub: 'Class 1st – 5th',
    emoji: '🌟',
    color: '#FF9F43',
    gradient: 'linear-gradient(135deg,#FF9F43 0%,#FF6B6B 100%)',
    desc: 'Fun, activity-based learning for young minds. Maths, EVS, English, Hindi, and creative skills.',
    href: '/subjects',
    tags: ['Fun Learning', 'Activity-Based', 'Foundation'],
  },
  {
    name: 'Competitive Exam Prep',
    sub: 'Olympiad & NTSE',
    emoji: '🏅',
    color: '#00C9A7',
    gradient: 'linear-gradient(135deg,#00C9A7 0%,#54A0FF 100%)',
    desc: 'Crack Olympiads, NTSE, and scholarship exams. Advanced problem-solving and exam strategies.',
    href: '/subjects',
    tags: ['Olympiad', 'NTSE', 'Scholarship'],
  },
  {
    name: 'Spoken English & Communication',
    sub: 'All Classes',
    emoji: '🗣️',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg,#FF6B6B 0%,#FF9F43 100%)',
    desc: 'Build fluency, confidence, and communication skills through structured speaking and writing practice.',
    href: '/subjects',
    tags: ['Fluency', 'Speaking', 'Writing'],
  },
  {
    name: 'Creative Arts & Music',
    sub: 'All Ages',
    emoji: '🎵',
    color: '#EE5A24',
    gradient: 'linear-gradient(135deg,#EE5A24 0%,#FF9F43 100%)',
    desc: 'Drawing, painting, digital art, music theory and keyboard — nurture your child\'s creative side.',
    href: '/subjects',
    tags: ['Drawing', 'Music', 'Digital Art'],
  },
  {
    name: 'Vedic Maths & Mental Ability',
    sub: 'Class 4th – 10th',
    emoji: '🧮',
    color: '#5F27CD',
    gradient: 'linear-gradient(135deg,#5F27CD 0%,#6C63FF 100%)',
    desc: 'Speed calculation, mental math tricks, and logical puzzles to sharpen young minds rapidly.',
    href: '/subjects',
    tags: ['Speed Math', 'Mental Ability', 'Logic'],
  },
];

const JuniorSection = () => {
  const router = useRouter();

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Junior Section - Class 6th to 8th Tuition",
    "description": "Premium concept-based learning for Class 6, 7, and 8 students covering Mathematics, Science, English, Hindi, Social Science, Computer Basics, AI & Art.",
    "provider": { "@type": "EducationalOrganization", "name": "Tutvex", "url": "https://tutvex.com" },
    "educationalLevel": "Middle School",
    "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online", "inLanguage": ["en", "hi"] },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "120" },
  };

  return (
    <>
      <Head>
        <title>Junior Section (Class 6-8) | Expert Online Tuition + AI Courses | Tutvex</title>
        <meta name="description" content="Tutvex Junior Section — Premium online tuition for Class 6-8 + AI & Coding courses. Expert tutors, live classes, concept-based learning. Join 500+ students." />
        <meta name="keywords" content="class 6 tuition online, class 7 tuition, class 8 tutor, AI courses for kids, coding for kids, junior section online classes, online tuition India, Tutvex junior" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Junior Section (Class 6-8) + AI Courses | Tutvex" />
        <meta property="og:description" content="Top-rated online tuition + AI & Coding courses for Class 6-8. Expert tutors, live sessions. Join Tutvex." />
        <meta property="og:image" content="/images/kids-courses/junior.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://tutvex.com/kids-courses/junior" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      </Head>

      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --indigo:#6C63FF; --indigo-d:#5346e8;
          --teal:#00C9A7; --orange:#FF9F43; --red:#FF6B6B; --blue:#54A0FF;
          --text:#0f1117; --muted:#5a6a85; --bg:#F4F6FF;
          --white:#ffffff; --card:#ffffff;
          --border:rgba(0,0,0,0.07);
        }

        .jk { font-family:'Plus Jakarta Sans',sans-serif !important; }
        .nun { font-family:'Nunito',sans-serif !important; }
        .wrap { max-width:1180px; margin:0 auto; padding:0 2px; }

        /* ── premium hero bg ── */
        .hero-bg {
          background: #F4F6FF;
          background-image:
            radial-gradient(ellipse at 10% 20%, rgba(108,99,255,0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, rgba(0,201,167,0.10) 0%, transparent 45%),
            radial-gradient(ellipse at 60% -10%, rgba(255,159,67,0.09) 0%, transparent 40%);
        }

        /* ── pill ── */
        .pill {
          display:inline-flex; align-items:center; gap:7px;
          border-radius:100px; padding:6px 18px; font-size:11px;
          font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .pill-primary { background:rgba(108,99,255,0.1); border:1.5px solid rgba(108,99,255,0.25); color:var(--indigo); }
        .pill-white   { background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.35); color:white; }
        .pill-dot { width:7px; height:7px; border-radius:50%; background:currentColor; animation:blink 1.8s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }

        /* ── gradients ── */
        .g1 { background:linear-gradient(135deg,#6C63FF,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .g2 { background:linear-gradient(135deg,#FF6B6B,#FF9F43); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .g3 { background:linear-gradient(135deg,#00C9A7,#54A0FF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

        /* ── back btn ── */
        .back-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:white; border:1.5px solid rgba(108,99,255,0.2);
          border-radius:12px; color:var(--indigo); font-size:14px;
          font-weight:700; cursor:pointer; padding:10px 20px;
          transition:all .22s; font-family:'Plus Jakarta Sans',sans-serif;
          box-shadow:0 2px 14px rgba(108,99,255,0.1);
        }
        .back-btn:hover { background:var(--indigo); color:#fff; transform:translateY(-2px); box-shadow:0 6px 22px rgba(108,99,255,0.3); }

        /* ── hero image ── */
        .hero-img {
          border-radius:28px; overflow:hidden; position:relative;
          box-shadow:0 32px 90px rgba(108,99,255,0.2), 0 0 0 1px rgba(108,99,255,0.08);
        }
        .hero-img::after { content:''; position:absolute; inset:0; background:linear-gradient(160deg,rgba(108,99,255,0.08),transparent 55%); pointer-events:none; }

        /* ── premium floating card ── */
        .f-card {
          position:absolute; background:rgba(255,255,255,0.95);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          border-radius:18px; padding:12px 18px;
          box-shadow:0 12px 40px rgba(0,0,0,0.13), 0 0 0 1px rgba(255,255,255,0.8);
          display:flex; align-items:center; gap:10px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:700;
          animation:floatY 3.2s ease-in-out infinite;
        }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        /* ── deco ── */
        .deco { position:absolute; pointer-events:none; }
        @keyframes spin14 { to{transform:rotate(360deg)} }
        @keyframes bob { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(5deg)} }

        /* ── trust item ── */
        .trust-item { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--muted); font-family:'Plus Jakarta Sans',sans-serif; }

        /* ── stat card ── */
        .stat-c {
          background:white; border-radius:22px; padding:28px 20px;
          text-align:center; box-shadow:0 4px 24px rgba(0,0,0,0.06);
          border:1px solid var(--border); position:relative; overflow:hidden;
          transition:transform .28s, box-shadow .28s;
        }
        .stat-c::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
        .stat-c:nth-child(1)::before { background:linear-gradient(90deg,#6C63FF,#a78bfa); }
        .stat-c:nth-child(2)::before { background:linear-gradient(90deg,#FF9F43,#FF6B6B); }
        .stat-c:nth-child(3)::before { background:linear-gradient(90deg,#00C9A7,#54A0FF); }
        .stat-c:nth-child(4)::before { background:linear-gradient(90deg,#FF6B6B,#FF9F43); }
        .stat-c:hover { transform:translateY(-6px); box-shadow:0 20px 56px rgba(0,0,0,0.1); }

        /* ── section divider ── */
        .sec-div { display:flex; align-items:center; gap:14px; margin-bottom:56px; }
        .sec-line { flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(108,99,255,0.15),transparent); }

        /* ── subject card (glassmorphism) ── */
        .sj-c {
          background:white; border-radius:24px;
          border:1px solid var(--border);
          padding:28px; position:relative; overflow:hidden;
          transition:transform .3s, box-shadow .3s, border-color .3s;
          box-shadow:0 2px 18px rgba(0,0,0,0.05);
          display:flex; flex-direction:column; gap:14px;
        }
        .sj-glow { position:absolute; width:130px; height:130px; border-radius:50%; top:-25px; right:-25px; pointer-events:none; opacity:.45; transition:transform .45s, opacity .45s; }
        .sj-c:hover { transform:translateY(-7px); border-color:rgba(108,99,255,0.2); box-shadow:0 24px 64px rgba(0,0,0,0.1); }
        .sj-c:hover .sj-glow { transform:scale(2); opacity:.28; }
        .sj-icon { width:54px; height:54px; border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0; }
        .sj-tag { padding:3px 11px; border-radius:100px; font-size:11px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; }
        .sj-bar { height:3px; border-radius:3px; margin-top:4px; }

        /* ── feature card ── */
        .ft-c {
          background:white; border-radius:22px; padding:32px;
          border:1px solid var(--border);
          box-shadow:0 2px 18px rgba(0,0,0,0.05);
          transition:transform .3s, box-shadow .3s;
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; gap:14px;
        }
        .ft-bar { position:absolute; top:0; left:0; right:0; height:3px; }
        .ft-c:hover { transform:translateY(-6px); box-shadow:0 22px 60px rgba(0,0,0,0.1); }

        /* ── AI course card ── */
        .ai-c {
          border-radius:24px; padding:28px; position:relative; overflow:hidden;
          border:1px solid rgba(0,0,0,0.06);
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
          transition:transform .3s, box-shadow .3s;
          background:white; display:flex; flex-direction:column; gap:14px;
        }
        .ai-c::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; }
        .ai-c:hover { transform:translateY(-8px); box-shadow:0 24px 64px rgba(0,0,0,0.13); }
        .ai-badge {
          display:inline-flex; align-items:center;
          padding:3px 10px; border-radius:100px; font-size:10px;
          font-weight:800; letter-spacing:.07em; color:white;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .ai-meta { display:flex; gap:12px; flex-wrap:wrap; }
        .ai-meta-item {
          display:flex; align-items:center; gap:5px;
          font-size:12px; font-weight:600; color:var(--muted);
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        /* ── other course card ── */
        .oc-c {
          border-radius:22px; padding:26px; position:relative;
          border:1px solid var(--border); background:white;
          box-shadow:0 2px 16px rgba(0,0,0,0.05);
          transition:transform .3s, box-shadow .3s, border-color .3s;
          display:flex; flex-direction:column; gap:12px;
          cursor:pointer;
        }
        .oc-c:hover { transform:translateY(-6px); box-shadow:0 20px 56px rgba(0,0,0,0.1); border-color:rgba(108,99,255,0.2); }
        .oc-icon-wrap { width:56px; height:56px; border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
        .oc-arrow { width:30px; height:30px; border-radius:50%; background:rgba(108,99,255,0.08); border:1px solid rgba(108,99,255,0.18); display:flex; align-items:center; justify-content:center; transition:all .25s; flex-shrink:0; }
        .oc-c:hover .oc-arrow { background:var(--indigo); border-color:var(--indigo); }
        .oc-tag { padding:2px 9px; border-radius:100px; font-size:10px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; background:rgba(108,99,255,0.08); color:var(--indigo); }

        /* ── testimonial card ── */
        .tm-c {
          background:white; border-radius:22px; padding:28px;
          border:1px solid var(--border); box-shadow:0 4px 20px rgba(0,0,0,0.06);
          transition:transform .28s, box-shadow .28s; position:relative;
        }
        .tm-c::after { content:'"'; position:absolute; top:12px; right:18px; font-size:84px; color:rgba(108,99,255,0.08); font-family:'Nunito',sans-serif; line-height:1; pointer-events:none; }
        .tm-c:hover { transform:translateY(-5px); box-shadow:0 18px 50px rgba(0,0,0,0.1); }

        /* ── ribbon ── */
        .ribbon {
          background:linear-gradient(135deg,#6C63FF 0%,#a78bfa 100%);
          border-radius:24px; padding:26px 44px; text-align:center;
          color:white; position:relative; overflow:hidden;
          box-shadow:0 10px 40px rgba(108,99,255,0.32);
        }
        .ribbon::before {
          content:''; position:absolute; inset:0;
          background:url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.06'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h20v-9.5z'/%3E%3C/g%3E%3C/svg%3E");
        }

        /* ── CTA ── */
        .cta-wrap {
          background:linear-gradient(135deg,#0f1117 0%,#1a1d2e 60%,#0f1117 100%);
          border-radius:32px; padding:88px 48px; text-align:center;
          position:relative; overflow:hidden;
          box-shadow:0 32px 100px rgba(15,17,23,0.35);
          border:1px solid rgba(255,255,255,0.06);
        }
        .cta-glow { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }

        /* ── buttons ── */
        .btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,var(--indigo),#a78bfa);
          color:white; border:none; border-radius:14px; font-size:15px;
          font-weight:700; cursor:pointer; padding:15px 30px;
          text-decoration:none; transition:all .25s;
          font-family:'Plus Jakarta Sans',sans-serif;
          box-shadow:0 6px 24px rgba(108,99,255,0.4);
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(108,99,255,0.5); opacity:.92; }

        .btn-white {
          display:inline-flex; align-items:center; gap:8px;
          background:white; color:var(--indigo); border:none;
          border-radius:14px; font-size:15px; font-weight:700;
          cursor:pointer; padding:15px 30px; text-decoration:none;
          transition:all .25s; font-family:'Plus Jakarta Sans',sans-serif;
          box-shadow:0 4px 20px rgba(255,255,255,0.2);
        }
        .btn-white:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,255,255,0.3); }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.25);
          border-radius:14px; color:white; font-size:15px; font-weight:600;
          cursor:pointer; padding:15px 30px; text-decoration:none;
          transition:all .25s; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .btn-ghost:hover { background:rgba(255,255,255,0.15); border-color:rgba(255,255,255,0.5); transform:translateY(-2px); }

        .btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; border:1.5px solid rgba(108,99,255,0.28);
          border-radius:14px; color:var(--indigo); font-size:15px; font-weight:600;
          cursor:pointer; padding:15px 30px; text-decoration:none;
          transition:all .25s; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .btn-outline:hover { background:rgba(108,99,255,0.07); border-color:var(--indigo); transform:translateY(-2px); }

        /* ── responsive ── */
        @media(max-width:960px) {
          .hgrid  { grid-template-columns:1fr !important; text-align:center !important; }
          .fgrid  { grid-template-columns:1fr 1fr !important; }
          .sgrid  { grid-template-columns:1fr 1fr !important; }
          .stgrid { grid-template-columns:1fr 1fr !important; }
          .tmgrid { grid-template-columns:1fr !important; }
          .aigrid { grid-template-columns:1fr 1fr !important; }
          .ocgrid { grid-template-columns:1fr 1fr !important; }
          .hbtns  { justify-content:center !important; }
          .tbar   { justify-content:center !important; }
          .f-card { display:none !important; }
        }
        @media(max-width:600px) {
          .fgrid { grid-template-columns:1fr !important; }
          .sgrid { grid-template-columns:1fr !important; }
          .aigrid{ grid-template-columns:1fr !important; }
          .ocgrid{ grid-template-columns:1fr !important; }
          .cta-wrap { padding:52px 22px !important; }
        }
      `}</style>

      <div style={{ background:'var(--bg)', minHeight:'100vh', fontFamily:"'Plus Jakarta Sans',sans-serif", color:'var(--text)', overflowX:'hidden' }}>
        <NavBar />

        {/* ════════════════════ HERO ════════════════════ */}
        <section className="hero-bg" style={{ padding:'84px 0 72px', position:'relative', overflow:'hidden' }}>
          {/* deco */}
          <div className="deco" style={{ top:'9%',left:'3%',fontSize:28,opacity:.18,animation:'spin14 15s linear infinite' }}>✦</div>
          <div className="deco" style={{ top:'16%',right:'4%',fontSize:20,opacity:.15,animation:'spin14 12s linear infinite reverse' }}>✦</div>
          <div className="deco" style={{ width:52,height:52,borderRadius:'50%',background:'rgba(255,159,67,0.2)',top:'24%',left:'8%',animation:'bob 5s ease-in-out infinite',animationDelay:'1s' }} />
          <div className="deco" style={{ width:36,height:36,borderRadius:'50%',background:'rgba(0,201,167,0.2)',bottom:'20%',right:'6%',animation:'floatY 4s ease-in-out infinite',animationDelay:'2s' }} />
          <div className="deco" style={{ top:'44%',right:'2.5%',fontSize:26,opacity:.14,animation:'bob 5s ease-in-out infinite' }}>🔢</div>
          <div className="deco" style={{ top:'65%',left:'2%',fontSize:22,opacity:.14,animation:'floatY 4.5s ease-in-out infinite',animationDelay:'1s' }}>🧪</div>
          <div className="deco" style={{ bottom:'14%',left:'12%',fontSize:18,opacity:.11,animation:'bob 6s ease-in-out infinite',animationDelay:'2s' }}>📖</div>

          <div className="wrap">
            <button className="back-btn" onClick={() => router.push('/#kids-courses')} style={{ marginBottom:40 }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M9.5 3L4.5 7.5l5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to Courses
            </button>

            <div className="hgrid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
              {/* LEFT */}
              <div>
                <span className="pill pill-primary" style={{ marginBottom:20 }}>
                  <span className="pill-dot" /> Class 6th — 8th
                </span>

                <h1 className="nun" style={{ fontSize:'clamp(32px,5vw,60px)', fontWeight:900, lineHeight:1.08, marginBottom:10, letterSpacing:'-0.025em' }}>
                  Junior Section
                </h1>
                <div className="nun g1" style={{ fontSize:'clamp(20px,3.5vw,42px)', fontWeight:900, lineHeight:1.18, marginBottom:26, letterSpacing:'-0.015em' }}>
                  Learn. Explore. Grow. 🚀
                </div>

                <p className="jk" style={{ fontSize:15.5, lineHeight:1.88, color:'var(--muted)', marginBottom:16 }}>
                  Strengthen your child's academic foundation with{' '}
                  <strong style={{ color:'var(--indigo)', fontWeight:700 }}>concept-based learning</strong> and analytical thinking. Our lessons encourage logic, reasoning, and creativity through live experiments and practical projects.
                </p>
                <p className="jk" style={{ fontSize:15, lineHeight:1.82, color:'var(--muted)', marginBottom:36 }}>
                  We build <em style={{ color:'var(--indigo)', fontStyle:'normal', fontWeight:600 }}>confidence and curiosity</em> — so every student walks into class excited to learn, not anxious to perform.
                </p>

                <div className="hbtns" style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <button className="btn-primary" onClick={() => router.push('/find-tutor-flow/create-account')}>
                    🎓 Find a Tutor
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <a href="#subjects" className="btn-outline">📚 View Subjects</a>
                </div>

                <div className="tbar" style={{ display:'flex', gap:20, marginTop:30, flexWrap:'wrap' }}>
                  {['Free Demo Class','7 Core Subjects','Certified Tutors','AI-Powered Tools'].map((t,i)=>(
                    <div key={i} className="trust-item">
                      <span style={{ width:19,height:19,borderRadius:'50%',background:'rgba(108,99,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5L8.5 2" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>{t}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ position:'relative' }}>
                <div className="hero-img">
                  <img src="/images/kids-courses/junior.png" alt="Junior Section Class 6-8 Online Tuition Tutvex" style={{ width:'100%',display:'block',objectFit:'cover',maxHeight:450 }} />
                </div>
                <div className="f-card" style={{ top:20,left:-28,animationDelay:'0s' }}>
                  <span style={{ fontSize:26 }}>🎓</span>
                  <div><div className="nun" style={{ fontSize:16,fontWeight:900,color:'var(--indigo)' }}>500+</div><div className="jk" style={{ fontSize:10,color:'var(--muted)' }}>Students</div></div>
                </div>
                <div className="f-card" style={{ bottom:24,right:-24,animationDelay:'1.5s' }}>
                  <span style={{ fontSize:22 }}>⭐</span>
                  <div><div className="nun" style={{ fontSize:16,fontWeight:900,color:'var(--orange)' }}>4.9/5</div><div className="jk" style={{ fontSize:10,color:'var(--muted)' }}>Avg Rating</div></div>
                </div>
                <div className="f-card" style={{ top:'45%',right:-30,animationDelay:'0.8s' }}>
                  <span style={{ fontSize:20 }}>🤖</span>
                  <div><div className="nun" style={{ fontSize:13,fontWeight:900,color:'var(--teal)' }}>AI-Enabled</div><div className="jk" style={{ fontSize:10,color:'var(--muted)' }}>Learning</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ STATS ════════════════════ */}
        <section style={{ padding:'60px 0 80px',background:'white' }}>
          <div className="wrap">
            <div className="stgrid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18 }}>
              {highlights.map((h,i) => (
                <div key={i} className="stat-c">
                  <div style={{ fontSize:40,marginBottom:12 }}>{h.icon}</div>
                  <div className="nun" style={{ fontSize:36,fontWeight:900,color:h.color,lineHeight:1 }}>{h.val}</div>
                  <div className="jk" style={{ fontSize:13,color:'var(--muted)',marginTop:8,fontWeight:500 }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ SUBJECTS ════════════════════ */}
        <section id="subjects" style={{ padding:'80px 0 90px' }}>
          <div className="wrap">
            <div className="sec-div"><div className="sec-line"/><span style={{ fontSize:20,opacity:.4 }}>✏️</span><div className="sec-line"/></div>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pill pill-primary" style={{ marginBottom:16,display:'inline-flex' }}>Curriculum</span>
              <h2 className="nun" style={{ fontSize:'clamp(26px,4vw,50px)',fontWeight:900,margin:'16px 0 14px',letterSpacing:'-0.02em' }}>
                Subjects <span className="g1">Covered</span> for Class 6–8
              </h2>
              <p className="jk" style={{ color:'var(--muted)',fontSize:15,maxWidth:520,margin:'0 auto' }}>
                7 core subjects with structured lesson plans, live doubt-clearing, and concept-first teaching.
              </p>
            </div>
            <div className="sgrid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:22 }}>
              {subjects.map((s) => (
                <article key={s.name} className="sj-c">
                  <div className="sj-glow" style={{ background:`radial-gradient(circle,${s.color}38,transparent 70%)` }}/>
                  <div style={{ display:'flex',alignItems:'center',gap:14,position:'relative',zIndex:1 }}>
                    <div className="sj-icon" style={{ background:s.bg,border:`1.5px solid ${s.border}` }}>{s.emoji}</div>
                    <h3 className="nun" style={{ fontSize:19,fontWeight:900,color:'var(--text)' }}>{s.name}</h3>
                  </div>
                  <p className="jk" style={{ fontSize:13.5,color:'var(--muted)',lineHeight:1.78,position:'relative',zIndex:1 }}>{s.desc}</p>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:6,position:'relative',zIndex:1 }}>
                    {s.tags.map((t,j)=><span key={j} className="sj-tag" style={{ background:s.bg,color:s.color,border:`1px solid ${s.border}` }}>{t}</span>)}
                  </div>
                  <div className="sj-bar" style={{ background:`linear-gradient(90deg,${s.color},${s.color}40)` }}/>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ AI COURSES ════════════════════ */}
        <section id="ai-courses" style={{ padding:'0 0 90px',background:'white' }}>
          <div className="wrap">
            <div className="sec-div"><div className="sec-line"/><span style={{ fontSize:20,opacity:.4 }}>🤖</span><div className="sec-line"/></div>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pill pill-primary" style={{ marginBottom:16,display:'inline-flex',background:'rgba(108,99,255,0.1)',borderColor:'rgba(108,99,255,0.25)',color:'var(--indigo)' }}>AI & Future Skills</span>
              <h2 className="nun" style={{ fontSize:'clamp(26px,4vw,50px)',fontWeight:900,margin:'16px 0 14px',letterSpacing:'-0.02em' }}>
                AI & Tech <span className="g1">Courses</span> for Young Learners
              </h2>
              <p className="jk" style={{ color:'var(--muted)',fontSize:15,maxWidth:540,margin:'0 auto' }}>
                Future-proof your child's education with cutting-edge AI, coding, and technology courses designed for curious young minds.
              </p>
            </div>
            <div className="aigrid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20 }}>
              {aiCourses.map((c,i)=>(
                <div key={i} className="ai-c" style={{ '--ai-grad':c.gradient } as React.CSSProperties}>
                  <style>{`.ai-c:nth-child(${i+1})::before { background: ${c.gradient}; }`}</style>
                  <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8 }}>
                    <div style={{ fontSize:36 }}>{c.emoji}</div>
                    <span className="ai-badge" style={{ background:c.gradient }}>{c.badge}</span>
                  </div>
                  <h3 className="nun" style={{ fontSize:16,fontWeight:900,color:'var(--text)',lineHeight:1.3 }}>{c.name}</h3>
                  <p className="jk" style={{ fontSize:13,color:'var(--muted)',lineHeight:1.75,flex:1 }}>{c.desc}</p>
                  <div className="ai-meta">
                    <span className="ai-meta-item">🎓 {c.level}</span>
                    <span className="ai-meta-item">⏱ {c.duration}</span>
                  </div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                    {c.tags.map((t,j)=><span key={j} className="sj-tag" style={{ background:'rgba(108,99,255,0.07)',color:'var(--indigo)',border:'1px solid rgba(108,99,255,0.15)' }}>{t}</span>)}
                  </div>
                  <button className="btn-primary" style={{ marginTop:4,justifyContent:'center' }} onClick={()=>router.push('/find-tutor-flow/create-account')}>
                    Enroll Now →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ WHY TUTVEX ════════════════════ */}
        <section style={{ padding:'0 0 90px' }}>
          <div className="wrap">
            <div style={{ textAlign:'center',marginBottom:50 }}>
              <span className="pill pill-primary" style={{ marginBottom:16,display:'inline-flex' }}>Why Tutvex</span>
              <h2 className="nun" style={{ fontSize:'clamp(24px,3.5vw,46px)',fontWeight:900,margin:'16px 0 14px',letterSpacing:'-0.02em' }}>
                How We Make <span className="g3">Learning Different</span>
              </h2>
            </div>
            <div className="fgrid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18 }}>
              {features.map((f,i)=>(
                <div key={i} className="ft-c">
                  <div className="ft-bar" style={{ background:`linear-gradient(90deg,${f.color},${f.color}50)` }}/>
                  <div style={{ fontSize:40 }}>{f.icon}</div>
                  <h3 className="nun" style={{ fontSize:17,fontWeight:900,color:'var(--text)' }}>{f.title}</h3>
                  <p className="jk" style={{ fontSize:13.5,color:'var(--muted)',lineHeight:1.78 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ OTHER COURSES ════════════════════ */}
        <section style={{ padding:'0 0 90px',background:'white' }}>
          <div className="wrap">
            <div className="sec-div"><div className="sec-line"/><span style={{ fontSize:20,opacity:.4 }}>📚</span><div className="sec-line"/></div>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pill pill-primary" style={{ marginBottom:16,display:'inline-flex' }}>Explore More</span>
              <h2 className="nun" style={{ fontSize:'clamp(26px,4vw,50px)',fontWeight:900,margin:'16px 0 14px',letterSpacing:'-0.02em' }}>
                Other <span className="g2">Courses</span> on Tutvex
              </h2>
              <p className="jk" style={{ color:'var(--muted)',fontSize:15,maxWidth:500,margin:'0 auto' }}>
                A complete learning ecosystem — from Primary to Senior, Olympiads to AI. Something for every student.
              </p>
            </div>
            <div className="ocgrid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18 }}>
              {otherCourses.map((c,i)=>(
                <div key={i} className="oc-c" onClick={()=>router.push(c.href)}>
                  <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                    <div className="oc-icon-wrap" style={{ background:`${c.color}14`,border:`1.5px solid ${c.color}30` }}>{c.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div className="nun" style={{ fontSize:16,fontWeight:900,color:'var(--text)',lineHeight:1.2 }}>{c.name}</div>
                      <div className="jk" style={{ fontSize:12,color:c.color,fontWeight:600,marginTop:2 }}>{c.sub}</div>
                    </div>
                    <div className="oc-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#6C63FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="arrow-path"/></svg>
                    </div>
                  </div>
                  <p className="jk" style={{ fontSize:13,color:'var(--muted)',lineHeight:1.72 }}>{c.desc}</p>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                    {c.tags.map((t,j)=><span key={j} className="oc-tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <section style={{ padding:'0 0 90px' }}>
          <div className="wrap">
            <div className="sec-div"><div className="sec-line"/><span style={{ fontSize:20,opacity:.4 }}>💬</span><div className="sec-line"/></div>
            <div style={{ textAlign:'center',marginBottom:48 }}>
              <span className="pill pill-primary" style={{ marginBottom:16,display:'inline-flex' }}>Testimonials</span>
              <h2 className="nun" style={{ fontSize:'clamp(24px,3.5vw,44px)',fontWeight:900,margin:'16px 0 12px',letterSpacing:'-0.02em' }}>
                What Students & Parents <span className="g2">Are Saying</span>
              </h2>
            </div>
            <div className="tmgrid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20 }}>
              {testimonials.map((tm,i)=>(
                <div key={i} className="tm-c">
                  <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
                    <div style={{ width:48,height:48,borderRadius:'50%',background:'rgba(108,99,255,0.1)',border:'2px solid rgba(108,99,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>{tm.avatar}</div>
                    <div>
                      <div className="nun" style={{ fontSize:15,fontWeight:800,color:'var(--text)' }}>{tm.name}</div>
                      <div className="jk" style={{ fontSize:12,color:'var(--indigo)',fontWeight:600 }}>{tm.grade}</div>
                    </div>
                  </div>
                  <p className="jk" style={{ fontSize:14,color:'var(--muted)',lineHeight:1.82,fontStyle:'italic' }}>"{tm.text}"</p>
                  <div style={{ display:'flex',gap:2,marginTop:14 }}>
                    {[...Array(tm.stars)].map((_,j)=><span key={j} style={{ fontSize:14,color:'#FF9F43' }}>⭐</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ QUOTE RIBBON ════════════════════ */}
        <section style={{ padding:'0 0 80px' }}>
          <div className="wrap">
            <div className="ribbon">
              <div style={{ position:'relative',zIndex:1 }}>
                <p className="nun" style={{ fontSize:'clamp(16px,2.5vw,22px)',fontWeight:900,lineHeight:1.55 }}>
                  🚀 "Explore, question, and grow — that's how knowledge blooms!"
                </p>
                <p style={{ fontSize:12,opacity:.7,marginTop:8,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>— Tutvex Junior Section Motto</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ CTA ════════════════════ */}
        <section style={{ padding:'0 0 100px' }}>
          <div className="wrap">
            <div className="cta-wrap">
              <div className="cta-glow" style={{ width:500,height:300,background:'rgba(108,99,255,0.25)',top:'-30%',left:'50%',transform:'translateX(-50%)' }}/>
              <div className="cta-glow" style={{ width:250,height:250,background:'rgba(167,139,250,0.15)',bottom:'-20%',right:'10%' }}/>
              <div style={{ position:'absolute',top:'15%',left:'5%',fontSize:32,opacity:.22,animation:'floatY 4s ease-in-out infinite' }}>📐</div>
              <div style={{ position:'absolute',bottom:'15%',right:'7%',fontSize:28,opacity:.22,animation:'bob 5s ease-in-out infinite' }}>🔬</div>
              <div style={{ position:'absolute',top:'60%',left:'8%',fontSize:24,opacity:.18,animation:'bob 6s ease-in-out infinite',animationDelay:'1s' }}>🤖</div>

              <div style={{ position:'relative',zIndex:1 }}>
                <span className="pill pill-white" style={{ marginBottom:22,display:'inline-flex' }}>Get Started Today</span>
                <h2 className="nun" style={{ fontSize:'clamp(26px,4vw,56px)',fontWeight:900,color:'white',marginBottom:18,letterSpacing:'-0.025em',lineHeight:1.12 }}>
                  Find the Perfect Tutor<br/>for Your Child 🎓
                </h2>
                <p className="jk" style={{ color:'rgba(255,255,255,0.7)',fontSize:16,maxWidth:500,margin:'0 auto 42px',lineHeight:1.82 }}>
                  Book a <strong style={{ color:'white' }}>free demo class</strong> today. No commitments — just see the difference expert tutoring makes in your child's confidence and grades.
                </p>
                <div style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
                  <button className="btn-white" onClick={()=>router.push('/tutors')}>
                    🎓 Find a Tutor for Your Child
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" stroke="var(--indigo)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-ghost" onClick={()=>router.push('/#kids-courses')}>
                    Explore Other Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default JuniorSection;
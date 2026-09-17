import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { countryPages } from "@/lib/countryPages";
import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import ContactPage from "@/components/contact/ContactPage";
// ─── Country Meta ─────────────────────────────────────────────────────────────
const countryMeta: Record<string, {
  label: string; flag: string; heroImage: string;
  accent: string; accentRgb: string; accentLight: string;
  tagline: string; stats: { value: string; label: string }[];
  highlights: { icon: string; title: string; desc: string }[];
  currency: string; boards: string[]; heroGradient: string;
  tutors: { name: string; subject: string; exp: string; rating: string; avatar: string; badge: string }[];
  faqs: { q: string; a: string }[];
}> = {
  india: {
    label: "India", flag: "🇮🇳",
    heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=90",
    accent: "#f97316", accentRgb: "249,115,22", accentLight: "#fed7aa",
    tagline: "India's Most Trusted Online Learning Platform",
    stats: [
      { value: "50,000+", label: "Students Taught" },
      { value: "2,000+", label: "Expert Tutors" },
      { value: "4.9★", label: "Average Rating" },
      { value: "98%", label: "Success Rate" },
    ],
    highlights: [
      { icon: "🎯", title: "Live 1-on-1 & Group Classes", desc: "Real-time interactive sessions with instant doubt resolution and whiteboard tools." },
      { icon: "📋", title: "CBSE, ICSE & State Boards", desc: "Complete syllabus coverage for all Indian boards with chapter-wise practice sets." },
      { icon: "🚀", title: "JEE & NEET Specialists", desc: "Dedicated coaching from IITians and doctors with proven track records." },
      { icon: "⏰", title: "Flexible Timings 6AM–11PM", desc: "Book sessions that fit your schedule — morning, evening, or late night." },
      { icon: "🎥", title: "Recorded Sessions Included", desc: "Every class recorded automatically — revise anytime, as many times as you want." },
      { icon: "🎁", title: "Free Trial Class Available", desc: "Try before you commit — first class completely free, no card required." },
    ],
    currency: "₹",
    boards: ["CBSE", "ICSE", "IB", "State Boards", "JEE", "NEET", "CUET"],
    heroGradient: "linear-gradient(160deg, rgba(124,45,18,0.92) 0%, rgba(3,7,18,0.88) 55%, rgba(3,7,18,0.75) 100%)",
    tutors: [
      { name: "Priya Sharma", subject: "Mathematics & JEE", exp: "8 yrs exp", rating: "4.9", avatar: "PS", badge: "IIT Delhi" },
      { name: "Rahul Verma", subject: "Physics & NEET", exp: "6 yrs exp", rating: "4.8", avatar: "RV", badge: "AIIMS" },
      { name: "Anita Patel", subject: "Chemistry", exp: "10 yrs exp", rating: "5.0", avatar: "AP", badge: "Top Rated" },
      { name: "Vikram Singh", subject: "Biology & NEET", exp: "7 yrs exp", rating: "4.9", avatar: "VS", badge: "IIT Bombay" },
      { name: "Sneha Gupta", subject: "English & CBSE", exp: "5 yrs exp", rating: "4.8", avatar: "SG", badge: "Delhi Univ" },
      { name: "Arjun Mehta", subject: "Computer Science", exp: "9 yrs exp", rating: "4.9", avatar: "AM", badge: "Expert" },
    ],
    faqs: [
      { q: "How do I book a tutor for online classes in India?", a: "Simply click 'Find Tutor', set your subject and grade, and browse verified profiles. You can book a free trial instantly — no payment needed upfront." },
      { q: "Are the tutors verified and background-checked?", a: "Yes, every tutor on TutVex undergoes a rigorous 3-step verification including ID check, qualification proof, and a demo teaching session before being listed." },
      { q: "What subjects are available for CBSE Class 10 and 12?", a: "We cover all CBSE subjects — Maths, Science (Physics, Chemistry, Biology), English, Social Studies, Computer Science, Accounts, Economics, and more." },
      { q: "Can I get JEE or NEET coaching online?", a: "Absolutely. We have over 200 IITian and MBBS-qualified tutors specialising in JEE Main, JEE Advanced, and NEET preparation with mock test support." },
      { q: "What is the cost of online tuition in India?", a: "Rates start from ₹300/hour and vary by tutor experience and subject. You can filter by budget on our Find Tutor page. First session is always free." },
    ],
  },
  uk: {
    label: "United Kingdom", flag: "🇬🇧",
    heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1800&q=90",
    accent: "#3b82f6", accentRgb: "59,130,246", accentLight: "#bfdbfe",
    tagline: "Top-Rated Tutors Across the United Kingdom",
    stats: [
      { value: "15,000+", label: "Students Taught" },
      { value: "800+", label: "DBS-Checked Tutors" },
      { value: "4.8★", label: "Average Rating" },
      { value: "96%", label: "Grade Improvement" },
    ],
    highlights: [
      { icon: "🛡️", title: "DBS-Checked & Verified", desc: "Every tutor holds a current Enhanced DBS certificate — your child's safety is our top priority." },
      { icon: "📚", title: "GCSE & A-Level Specialists", desc: "Targeted exam preparation across all major UK boards with past-paper techniques." },
      { icon: "🎓", title: "All Exam Boards Covered", desc: "AQA, Edexcel, OCR, WJEC — we have subject specialists for every board." },
      { icon: "🏠", title: "In-Home & Online Sessions", desc: "Choose what works best — a tutor at your door or a seamless online classroom." },
      { icon: "🎯", title: "University Entrance Support", desc: "Personal statement coaching, Oxbridge prep, and UCAS application guidance." },
      { icon: "✅", title: "First Session Guarantee", desc: "Not satisfied with your first session? We'll match you with another tutor, free." },
    ],
    currency: "£",
    boards: ["AQA", "Edexcel", "OCR", "WJEC", "Cambridge", "IB"],
    heroGradient: "linear-gradient(160deg, rgba(30,58,95,0.92) 0%, rgba(3,7,18,0.88) 55%, rgba(3,7,18,0.75) 100%)",
    tutors: [
      { name: "James Mitchell", subject: "GCSE Maths", exp: "9 yrs exp", rating: "4.9", avatar: "JM", badge: "Oxford" },
      { name: "Sarah Thompson", subject: "A-Level Chemistry", exp: "7 yrs exp", rating: "4.8", avatar: "ST", badge: "Cambridge" },
      { name: "David Clarke", subject: "English Literature", exp: "11 yrs exp", rating: "5.0", avatar: "DC", badge: "Top Rated" },
      { name: "Emma Wilson", subject: "Biology A-Level", exp: "6 yrs exp", rating: "4.9", avatar: "EW", badge: "Imperial" },
      { name: "Tom Harrison", subject: "Physics GCSE", exp: "8 yrs exp", rating: "4.8", avatar: "TH", badge: "UCL" },
      { name: "Lucy Roberts", subject: "11+ & SATs", exp: "5 yrs exp", rating: "4.9", avatar: "LR", badge: "Expert" },
    ],
    faqs: [
      { q: "How do I find a DBS-checked tutor in the UK?", a: "All tutors on TutVex hold a valid Enhanced DBS certificate. Filter by subject and location, view profiles, and book a free first session." },
      { q: "Do you cover all UK exam boards?", a: "Yes — AQA, Edexcel, OCR, WJEC, and Cambridge International are all supported. Select your board when searching for tutors." },
      { q: "Can tutors come to my home in the UK?", a: "Yes, many of our tutors offer in-home sessions across England, Scotland, Wales, and Northern Ireland. You can also opt for online-only." },
      { q: "How much does a GCSE tutor cost in the UK?", a: "Rates typically start from £25/hour. A-Level and specialist tutors may charge £35–£60/hour. Your first trial session is free." },
      { q: "Do you offer 11 Plus preparation?", a: "Absolutely. We have dedicated 11+ tutors for GL Assessment, CEM, and independent school entrance exams, including mock tests and timed practice." },
    ],
  },
  canada: {
    label: "Canada", flag: "🇨🇦",
    heroImage: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1800&q=90",
    accent: "#ef4444", accentRgb: "239,68,68", accentLight: "#fecaca",
    tagline: "Expert Tutors Serving All Canadian Provinces",
    stats: [
      { value: "12,000+", label: "Students Taught" },
      { value: "600+", label: "Expert Tutors" },
      { value: "4.8★", label: "Average Rating" },
      { value: "95%", label: "Satisfaction Rate" },
    ],
    highlights: [
      { icon: "🍁", title: "Province-Specific Curricula", desc: "Ontario, BC, Alberta, Quebec — tutors trained on your exact provincial syllabus." },
      { icon: "🇫🇷", title: "French Immersion Support", desc: "Bilingual tutors for French Immersion students across all grades and subjects." },
      { icon: "📊", title: "SAT & ACT Prep", desc: "Comprehensive US college entrance test preparation with strategy sessions and full mocks." },
      { icon: "🎓", title: "University Application Coaching", desc: "Personal statement writing, scholarship essays, and university selection guidance." },
      { icon: "💬", title: "Bilingual Tutors Available", desc: "English and French tutors available — choose the language you're most comfortable in." },
      { icon: "💻", title: "Flexible Online & In-Person", desc: "Nationwide coverage — from Toronto and Vancouver to smaller cities and rural areas." },
    ],
    currency: "CA$",
    boards: ["Ontario Curriculum", "BC Curriculum", "Alberta Program", "IB", "AP", "Quebec"],
    heroGradient: "linear-gradient(160deg, rgba(127,29,29,0.92) 0%, rgba(3,7,18,0.88) 55%, rgba(3,7,18,0.75) 100%)",
    tutors: [
      { name: "Sophie Tremblay", subject: "French Immersion", exp: "8 yrs exp", rating: "5.0", avatar: "ST", badge: "McGill" },
      { name: "Liam O'Brien", subject: "Ontario Math", exp: "6 yrs exp", rating: "4.9", avatar: "LO", badge: "UofT" },
      { name: "Mei Lin Chen", subject: "AP Chemistry", exp: "7 yrs exp", rating: "4.8", avatar: "MC", badge: "UBC" },
      { name: "Aiden MacDonald", subject: "English & Writing", exp: "9 yrs exp", rating: "4.9", avatar: "AM", badge: "Top Rated" },
      { name: "Priya Nair", subject: "SAT & ACT Prep", exp: "5 yrs exp", rating: "4.8", avatar: "PN", badge: "Queen's" },
      { name: "Ethan Bouchard", subject: "Physics & IB", exp: "10 yrs exp", rating: "4.9", avatar: "EB", badge: "Waterloo" },
    ],
    faqs: [
      { q: "Do tutors cover provincial curricula across Canada?", a: "Yes. Our tutors are matched to your specific province — Ontario, BC, Alberta, Quebec, and all others — so lessons align perfectly with your curriculum." },
      { q: "Are French Immersion tutors available?", a: "Absolutely. We have bilingual tutors across Canada who specialise in French Immersion at all grade levels, from elementary through high school." },
      { q: "Can I get help with AP or IB courses in Canada?", a: "Yes — we have dedicated AP and IB tutors for all subjects. Many of our tutors have taught these programs in schools and know exactly what examiners look for." },
      { q: "How much does online tutoring cost in Canada?", a: "Rates start from CA$30/hour and vary by subject and tutor experience. Your first trial session is always free." },
      { q: "Do you offer in-person tutoring in Toronto and Vancouver?", a: "Yes, many tutors are available in major cities including Toronto, Vancouver, Calgary, Ottawa, and Montreal for in-home sessions." },
    ],
  },
  uae: {
    label: "UAE", flag: "🇦🇪",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=90",
    accent: "#10b981", accentRgb: "16,185,129", accentLight: "#a7f3d0",
    tagline: "Premium Tutoring in Dubai, Abu Dhabi & Across UAE",
    stats: [
      { value: "8,000+", label: "Students Taught" },
      { value: "400+", label: "Expert Tutors" },
      { value: "4.9★", label: "Average Rating" },
      { value: "97%", label: "Parent Satisfaction" },
    ],
    highlights: [
      { icon: "🌍", title: "All Major Curricula Covered", desc: "CBSE, British, American, IB, IGCSE — tutors specialised in every curriculum offered in UAE schools." },
      { icon: "🏆", title: "IB & IGCSE Specialists", desc: "Experienced IB and IGCSE tutors helping students achieve 6s and 7s consistently." },
      { icon: "🏠", title: "Home & Online Sessions", desc: "Tutors available across Dubai, Abu Dhabi, Sharjah, Ajman, and all seven emirates." },
      { icon: "🌐", title: "Arabic & English Tutors", desc: "Native Arabic-speaking tutors available for Arabic language, Islamic Studies, and MOE subjects." },
      { icon: "📝", title: "School Entrance Test Prep", desc: "Preparation for UAE school admissions tests and international school entrance exams." },
      { icon: "📅", title: "Flexible Weekend Classes", desc: "Weekend and evening slots available — perfect for working parents and busy school schedules." },
    ],
    currency: "AED",
    boards: ["CBSE", "British Curriculum", "American", "IB", "IGCSE", "MOE UAE"],
    heroGradient: "linear-gradient(160deg, rgba(6,78,59,0.92) 0%, rgba(3,7,18,0.88) 55%, rgba(3,7,18,0.75) 100%)",
    tutors: [
      { name: "Fatima Al Rashid", subject: "Arabic & Islamic Studies", exp: "10 yrs exp", rating: "5.0", avatar: "FA", badge: "UAE MOE" },
      { name: "Ravi Krishnan", subject: "CBSE Maths & Science", exp: "8 yrs exp", rating: "4.9", avatar: "RK", badge: "IIT Grad" },
      { name: "Sarah O'Connor", subject: "British Curriculum English", exp: "7 yrs exp", rating: "4.8", avatar: "SO", badge: "Cambridge" },
      { name: "Ahmed Hassan", subject: "IGCSE Physics", exp: "6 yrs exp", rating: "4.9", avatar: "AH", badge: "Top Rated" },
      { name: "Priya Menon", subject: "IB Chemistry & Biology", exp: "9 yrs exp", rating: "4.9", avatar: "PM", badge: "IB Expert" },
      { name: "Mark Johnson", subject: "American Curriculum Math", exp: "5 yrs exp", rating: "4.8", avatar: "MJ", badge: "Certified" },
    ],
    faqs: [
      { q: "Which school curricula do your UAE tutors cover?", a: "We cover all major curricula available in UAE schools — CBSE, British (Cambridge/Edexcel), American, IB, IGCSE, and the UAE Ministry of Education (MOE) curriculum." },
      { q: "Can I find a home tutor in Dubai?", a: "Yes. We have hundreds of tutors available for in-home sessions across Dubai, Abu Dhabi, Sharjah, Ajman, and all other emirates." },
      { q: "Are Arabic language tutors available?", a: "Absolutely. We have native Arabic-speaking tutors for Arabic language, Islamic Studies, and MOE Arabic curriculum at all grade levels." },
      { q: "How much does a tutor cost in UAE?", a: "Rates typically start from AED 80/hour and vary by curriculum and tutor experience. Your first session is free, with no commitment required." },
      { q: "Do you help with school entrance exams in UAE?", a: "Yes — we offer targeted preparation for UAE school admissions tests, international school entrance assessments, and scholarship exams." },
    ],
  },
  singapore: {
    label: "Singapore", flag: "🇸🇬",
    heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1800&q=90",
    accent: "#8b5cf6", accentRgb: "139,92,246", accentLight: "#ddd6fe",
    tagline: "Singapore's Most Trusted MOE-Aligned Tutors",
    stats: [
      { value: "10,000+", label: "Students Taught" },
      { value: "500+", label: "Expert Tutors" },
      { value: "4.9★", label: "Average Rating" },
      { value: "99%", label: "PSLE Pass Rate" },
    ],
    highlights: [
      { icon: "🎓", title: "MOE Syllabus Aligned", desc: "Every lesson is mapped to the exact MOE syllabus — no wasted time on irrelevant content." },
      { icon: "📊", title: "PSLE, O-Level & A-Level", desc: "Specialist tutors for every major Singapore exam with past-year paper analysis." },
      { icon: "🏫", title: "IP & DSA Coaching", desc: "Integrated Programme and Direct School Admission coaching for competitive school placements." },
      { icon: "👥", title: "Small Group & 1-on-1", desc: "Choose your learning format — private sessions or small groups of 3–5 students." },
      { icon: "🇨🇳", title: "Mandarin & Mother Tongue", desc: "Mother Tongue specialists for Chinese, Malay, and Tamil at all levels." },
      { icon: "⚡", title: "Results in 8 Weeks Guaranteed", desc: "See measurable improvement within 8 weeks or we'll provide additional sessions free." },
    ],
    currency: "SGD",
    boards: ["MOE", "PSLE", "O-Levels", "A-Levels", "IB", "IP"],
    heroGradient: "linear-gradient(160deg, rgba(59,7,100,0.92) 0%, rgba(3,7,18,0.88) 55%, rgba(3,7,18,0.75) 100%)",
    tutors: [
      { name: "Wei Ling Tan", subject: "PSLE Mathematics", exp: "9 yrs exp", rating: "5.0", avatar: "WT", badge: "MOE Teacher" },
      { name: "Raj Kumar", subject: "O-Level Physics", exp: "7 yrs exp", rating: "4.9", avatar: "RK", badge: "NUS Grad" },
      { name: "Chloe Lim", subject: "A-Level Chemistry", exp: "6 yrs exp", rating: "4.8", avatar: "CL", badge: "NTU" },
      { name: "Jing Wen Liu", subject: "Chinese & Mother Tongue", exp: "11 yrs exp", rating: "5.0", avatar: "JL", badge: "Top Rated" },
      { name: "Aaron Ng", subject: "IP Mathematics", exp: "8 yrs exp", rating: "4.9", avatar: "AN", badge: "RI Alumni" },
      { name: "Priya Selvam", subject: "Tamil & English", exp: "5 yrs exp", rating: "4.8", avatar: "PS", badge: "Certified" },
    ],
    faqs: [
      { q: "Are your tutors aligned with Singapore's MOE syllabus?", a: "Yes. Every tutor on TutVex is trained on the exact MOE syllabus. Many are current or former MOE school teachers with official teaching experience." },
      { q: "Do you offer PSLE preparation?", a: "Absolutely. We have dedicated PSLE tutors for all four subjects — English, Mathematics, Science, and Mother Tongue — with past-year paper practice and mock exams." },
      { q: "Can my child get help with IP or DSA applications?", a: "Yes. We have specialists in Integrated Programme schools and Direct School Admission preparation, including portfolio guidance and interview coaching." },
      { q: "Are Mother Tongue tutors available?", a: "Yes — we have native-speaking tutors for Chinese, Malay, and Tamil at all levels from primary through A-Level." },
      { q: "How much does tutoring cost in Singapore?", a: "Rates start from SGD 35/hour for primary levels and SGD 60–100/hour for O/A-Level specialists. First session is always free." },
    ],
  },
  australia: {
    label: "Australia", flag: "🇦🇺",
    heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1800&q=90",
    accent: "#f59e0b", accentRgb: "245,158,11", accentLight: "#fde68a",
    tagline: "Award-Winning Tutors Across All Australian States",
    stats: [
      { value: "14,000+", label: "Students Taught" },
      { value: "700+", label: "Expert Tutors" },
      { value: "4.8★", label: "Average Rating" },
      { value: "96%", label: "ATAR Improvement" },
    ],
    highlights: [
      { icon: "📋", title: "Australian Curriculum Aligned", desc: "Full coverage of the Australian Curriculum for all year levels across every state." },
      { icon: "🎯", title: "VCE, HSC & ATAR Specialists", desc: "State-specific exam preparation to maximise your ATAR score with proven strategies." },
      { icon: "📝", title: "NAPLAN Preparation", desc: "Dedicated NAPLAN coaches for Years 3, 5, 7, and 9 — literacy and numeracy covered." },
      { icon: "🏫", title: "Selective School Coaching", desc: "Targeted preparation for selective high school entry tests across all Australian states." },
      { icon: "🌏", title: "Regional & Remote Support", desc: "Online tutors available across all states — including rural and remote areas of Australia." },
      { icon: "🏠", title: "Online & In-Home Sessions", desc: "Flexible choice of in-person sessions in major cities or live online classes anywhere in Australia." },
    ],
    currency: "AU$",
    boards: ["VCE", "HSC", "QCE", "SACE", "WACE", "IB"],
    heroGradient: "linear-gradient(160deg, rgba(120,53,15,0.92) 0%, rgba(3,7,18,0.88) 55%, rgba(3,7,18,0.75) 100%)",
    tutors: [
      { name: "Olivia Chen", subject: "VCE Mathematics", exp: "8 yrs exp", rating: "4.9", avatar: "OC", badge: "Monash" },
      { name: "Lachlan Murphy", subject: "HSC English", exp: "6 yrs exp", rating: "4.8", avatar: "LM", badge: "USYD" },
      { name: "Isabelle Park", subject: "NAPLAN Specialist", exp: "7 yrs exp", rating: "5.0", avatar: "IP", badge: "Top Rated" },
      { name: "Jake Williams", subject: "QCE Physics", exp: "9 yrs exp", rating: "4.9", avatar: "JW", badge: "UQ Grad" },
      { name: "Aisha Patel", subject: "Selective Entry Prep", exp: "5 yrs exp", rating: "4.8", avatar: "AP", badge: "UNIMELB" },
      { name: "Noah Fraser", subject: "Biology & Chemistry", exp: "10 yrs exp", rating: "4.9", avatar: "NF", badge: "Expert" },
    ],
    faqs: [
      { q: "Do your tutors cover state-specific curricula like VCE and HSC?", a: "Yes. We have tutors for every Australian state curriculum — VCE (Victoria), HSC (NSW), QCE (Queensland), SACE (SA), WACE (WA), and more." },
      { q: "Can I get help with NAPLAN preparation?", a: "Absolutely. We have dedicated NAPLAN preparation tutors for Years 3, 5, 7, and 9 covering all test domains — literacy, numeracy, writing, and reading." },
      { q: "Do you help with selective school entrance exams?", a: "Yes — we have selective school specialists for all states, including the NSW Selective High School Placement Test, Victorian Selective Entry, and Queensland." },
      { q: "Are tutors available in regional and rural Australia?", a: "Yes. Our online platform means any student in Australia — city, regional, or remote — can access our full network of tutors from anywhere." },
      { q: "How much does tutoring cost in Australia?", a: "Rates typically start from AU$40/hour for primary school tutors and AU$70–120/hour for senior secondary and ATAR specialists. First session is free." },
    ],
  },
};

const relatedLinks: Record<string, { label: string; href: string }[]> = {
  india: [
    { label: "Home Tutor India", href: "/country/india/home-tutor" },
    { label: "Best Tutors Near Me", href: "/country/india/tutors-near-me" },
    { label: "CBSE Tutor", href: "/country/india/cbse-tutor" },
    { label: "IIT JEE Coaching", href: "/country/india/jee-coaching" },
    { label: "NEET Preparation", href: "/country/india/neet-preparation" },
    { label: "Maths Tutor India", href: "/country/india/maths-tutor" },
  ],
  uk: [
    { label: "Maths Tutor UK", href: "/country/uk/maths-tutor-uk" },
    { label: "English Tutor UK", href: "/country/uk/english-tutor-uk" },
    { label: "Science Tutor UK", href: "/country/uk/science-tutor-uk" },
    { label: "11 Plus Tutors", href: "/country/uk/11-plus-tutor" },
    { label: "Online Tutoring UK", href: "/country/uk/online-tutor-uk" },
    { label: "London Tutors", href: "/country/uk/london-tutor" },
  ],
  canada: [
    { label: "Vancouver Tutor", href: "/country/canada/vancouver-tutor" },
    { label: "Calgary Tutor", href: "/country/canada/calgary-tutor" },
    { label: "Ottawa Tutor", href: "/country/canada/ottawa-tutor" },
    { label: "French Immersion Tutor", href: "/country/canada/french-immersion" },
    { label: "AP Tutor Canada", href: "/country/canada/ap-tutor" },
    { label: "Science Tutor Canada", href: "/country/canada/science-tutor" },
  ],
  uae: [
    { label: "IGCSE Tutor UAE", href: "/country/uae/igcse-tutor-uae" },
    { label: "IB Tutor Dubai", href: "/country/uae/ib-tutor-dubai" },
    { label: "Sharjah Tutor", href: "/country/uae/tutor-sharjah" },
    { label: "Science Tutor UAE", href: "/country/uae/science-tutor-uae" },
    { label: "English Tutor Dubai", href: "/country/uae/english-tutor-dubai" },
    { label: "Physics Tutor UAE", href: "/country/uae/physics-tutor-uae" },
  ],
  singapore: [
    { label: "Science Tutor SG", href: "/country/singapore/science-tutor-sg" },
    { label: "English Tutor SG", href: "/country/singapore/english-tutor-sg" },
    { label: "Chinese Tutor SG", href: "/country/singapore/chinese-tutor-sg" },
    { label: "IP Tutor Singapore", href: "/country/singapore/ip-tutor-singapore" },
    { label: "JC Tutor Singapore", href: "/country/singapore/jc-tutor-singapore" },
    { label: "DSA Coaching SG", href: "/country/singapore/dsa-coaching" },
  ],
  australia: [
    { label: "Brisbane Tutor", href: "/country/australia/brisbane-tutor" },
    { label: "Perth Tutor", href: "/country/australia/perth-tutor" },
    { label: "Adelaide Tutor", href: "/country/australia/adelaide-tutor" },
    { label: "NAPLAN Tutor", href: "/country/australia/naplan-tutor" },
    { label: "Science Tutor AU", href: "/country/australia/science-tutor-au" },
    { label: "English Tutor AU", href: "/country/australia/english-tutor-au" },
  ],
};

interface Props {
  page: { slug: string; title: string; description: string };
  country: string;
  allPages: { slug: string; title: string }[];
}

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
  const el = ref.current;

  if (!el) return;

  const obs = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (entry?.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    },
    { threshold }
  );

  obs.observe(el);

  return () => {
    obs.disconnect();
  };
}, [threshold]);

return { ref, visible };
}

export default function DynamicCountryPage({ page, country, allPages }: Props) {
 const meta = (countryMeta[country] ?? countryMeta["india"])!;
  const related = relatedLinks[country] ?? [];
  // const [formState, setFormState] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  // const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  const heroRef = useReveal(0.05);
  const statsRef = useReveal();
  const aboutRef = useReveal();
  const stepsRef = useReveal();
  const featuresRef = useReveal();
  const tutorsRef = useReveal();
  const pagesRef = useReveal();
  const ctaRef = useReveal();
  const faqRef = useReveal();
  // const formRef = useReveal();
  const relatedRef = useReveal();

  const visibleTutors = 3;
  const maxIndex = meta.tutors.length - visibleTutors;

  // function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setSubmitted(true);
  // }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --accent: ${meta.accent};
      --accent-rgb: ${meta.accentRgb};
      --accent-light: ${meta.accentLight};
      --bg: #060a12;
      --bg2: #0c1220;
      --bg3: #111827;
      --bg4: #1a2235;
      --border: rgba(255,255,255,0.08);
      --border2: rgba(255,255,255,0.04);
      --text: #f8fafc;
      --text2: #cbd5e1;
      --muted: #64748b;
      --font-head: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Inter', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; 
   margin: 0;
  padding: 0;
    }

    /* ── HERO ── */
 .cp-hero {
  position: relative;

  min-height: 78vh;

  display: flex;

  align-items: center;

  overflow: hidden;

  padding-top: 20px;

  padding-bottom: 40px;

  margin-top: 0;
}
    .cp-hero-bg {
      position: absolute; inset: 0;
      background-image: url('${meta.heroImage}');
      background-size: cover; background-position: center top;
      animation: cpZoom 20s ease-in-out infinite alternate;
    }
    @keyframes cpZoom { from { transform: scale(1); } to { transform: scale(1.07); } }

    .cp-hero-gradient {
      position: absolute; inset: 0;
      background: ${meta.heroGradient};
    }
    /* Extra bottom darkening for text legibility */
    .cp-hero-bottom {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(6,10,18,1) 0%, rgba(6,10,18,0.75) 30%, transparent 60%);
    }
    .cp-hero-side {
      position: absolute; inset: 0;
      background: linear-gradient(to right, rgba(6,10,18,0.85) 0%, rgba(6,10,18,0.3) 60%, transparent 100%);
    }

    .cp-hero-content {
      position: relative; z-index: 3;
      width: 100%; padding: 0 6vw 80px;
      opacity: 0; transform: translateY(32px);
      transition: opacity 1s ease, transform 1s ease;
    }
    .cp-hero-content.visible { opacity: 1; transform: none; }
    .cp-hero-inner { max-width: 780px; }

    .cp-hero-eyebrow {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 7px 18px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px; margin-bottom: 28px;
    }
    .cp-hero-eyebrow-flag { font-size: 20px; line-height: 1; }
    .cp-hero-eyebrow-text {
      font-family: var(--font-head); font-size: 12px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase; color: #fff;
    }
    .cp-hero-eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent); animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

    .cp-hero-title {
      font-family: var(--font-head);
      font-size: clamp(2.4rem, 5.5vw, 4.5rem);
      font-weight: 800; line-height: 1.08;
      letter-spacing: -0.025em;
      color: #ffffff;
      text-shadow: 0 2px 20px rgba(0,0,0,0.5);
      margin-bottom: 22px;
    }
    .cp-hero-title .accent-word { color: var(--accent); }
    .cp-hero-desc {
      font-size: clamp(1rem, 1.8vw, 1.15rem);
      color: rgba(255,255,255,0.85);
      max-width: 580px; line-height: 1.75; margin-bottom: 40px;
      text-shadow: 0 1px 8px rgba(0,0,0,0.6);
    }
    .cp-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

    .cp-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 10px;
      font-family: var(--font-head); font-size: 15px; font-weight: 700;
      text-decoration: none; cursor: pointer;
      transition: all 0.22s ease; border: none;
    }
    .cp-btn-primary {
      background: var(--accent); color: #fff;
      box-shadow: 0 8px 24px rgba(var(--accent-rgb),0.4);
    }
    .cp-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(var(--accent-rgb),0.5); }
    .cp-btn-ghost {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.25);
      color: #fff;
    }
    .cp-btn-ghost:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }

    .cp-hero-scroll-hint {
      position: absolute; bottom: 28px; left: 50%;
      transform: translateX(-50%); z-index: 3;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      font-size: 11px; font-family: var(--font-head); font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(255,255,255,0.5);
    }
    .cp-scroll-line {
      width: 1px; height: 36px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
      animation: scrollPulse 2s infinite;
    }
    @keyframes scrollPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

    /* ── TICKER ── */
    .cp-ticker {
      background: rgba(var(--accent-rgb),0.08);
      border-top: 1px solid rgba(var(--accent-rgb),0.2);
      border-bottom: 1px solid rgba(var(--accent-rgb),0.2);
      overflow: hidden; padding: 12px 0;
    }
    .cp-ticker-track {
      display: flex; gap: 0;
      animation: cpTicker 30s linear infinite;
      white-space: nowrap; width: max-content;
    }
    @keyframes cpTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .cp-ticker-item {
      display: inline-flex; align-items: center; gap: 20px;
      padding: 0 30px;
      font-family: var(--font-head); font-size: 12px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(var(--accent-rgb),0.9);
    }
    .cp-ticker-sep { color: var(--accent); opacity: 0.4; font-size: 8px; }

    /* ── STATS ── */
    .cp-stat {
  text-align: center;

  padding: 32px 24px;

  border-right: 1px solid rgba(255,255,255,0.06);

  background: rgba(255,255,255,0.02);

  backdrop-filter: blur(10px);

  transition: all 0.3s ease;
}
    .cp-stats-grid {
      display: grid; grid-template-columns: repeat(4,1fr);
      gap: 0; max-width: 1100px; margin: auto;
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.8s, transform 0.8s;
    }
    @media(max-width:768px){ .cp-stats-grid { grid-template-columns: repeat(2,1fr); } }
    .cp-stats-grid.visible { opacity: 1; transform: none; }
    .cp-stat {
      text-align: center; padding: 24px;
      border-right: 1px solid var(--border);
    }
    .cp-stat:last-child { border-right: none; }
    .cp-stat-val {
      font-family: var(--font-head); font-size: 2.8rem; font-weight: 800;
      color: var(--accent); line-height: 1; margin-bottom: 8px;
    }
    .cp-stat-label {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.72);
  font-weight: 500;
  letter-spacing: 0.02em;
}
  .cp-stat:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.04);

  box-shadow:
    0 12px 40px rgba(0,0,0,0.35),
    0 0 20px rgba(var(--accent-rgb),0.08);
}

    /* ── SECTION UTIL ── */
    .cp-section { padding: 64px 6vw; }
    .cp-section-dark { background: var(--bg2); }
    .cp-section-darker { background: var(--bg3); }
    .cp-inner { max-width: 1100px; margin: auto; }
.cp-steps-section {
  padding-top: 28px;
}
    .cp-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-head); font-size: 11px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--accent); margin-bottom: 16px;
    }
    .cp-eyebrow::before {
      content: ''; display: block; width: 24px; height: 2px;
      background: var(--accent); border-radius: 1px;
    }
   .cp-title {
  font-family: var(--font-head);
margin-top: 0;
  font-size: clamp(1.7rem, 3.5vw, 2.9rem);

  font-weight: 800;

  line-height: 1.12;

  margin-bottom: 18px;

  color: #ffffff;

  letter-spacing: -0.03em;

  text-shadow:
    0 2px 18px rgba(0,0,0,0.45),
    0 0 30px rgba(var(--accent-rgb),0.15);
}

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  background-clip: text;

  text-shadow:
    0 2px 12px rgba(0,0,0,0.18);

  letter-spacing: -0.03em;
}
    .cp-body {
  font-size: 1.08rem;

  color: rgba(255,255,255,0.78);

  max-width: 640px;

  line-height: 1.9;

  font-weight: 400;

  text-shadow:
    0 1px 8px rgba(0,0,0,0.15);
}
    .cp-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.85s, transform 0.85s; }
    .cp-reveal.visible { opacity: 1; transform: none; }

    /* ── ABOUT (2-col) ── */
    .cp-about-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
      align-items: center;
    }
    @media(max-width:900px){ .cp-about-grid { grid-template-columns: 1fr; gap: 40px; } }
    .cp-about-img-wrap {
      position: relative; border-radius: 24px; overflow: hidden;
      aspect-ratio: 4/3;
      box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px var(--border);
    }
    .cp-about-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .cp-about-badge {
      position: absolute; bottom: 20px; left: 20px;
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--accent); color: #fff;
      font-family: var(--font-head); font-weight: 700; font-size: 13px;
      padding: 8px 18px; border-radius: 999px;
    }
    .cp-about-img-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
    }
    .cp-boards { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
    .cp-board-chip {
      padding: 5px 14px;
      border: 1px solid var(--border);
      border-radius: 999px; font-size: 13px; color: var(--muted);
      transition: all 0.2s; cursor: default;
    }
    .cp-board-chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb),0.06); }

    /* ── STEPS ── */
  .cp-steps-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-top: 40px;
  //  padding-top: 40px;
}s
.cp-steps-grid::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 90%;
  height: 1px;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(var(--accent-rgb),0.22)
      transparent
    );

  transform: translateY(-50%);
  z-index: 0;
}

.cp-steps-grid::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(255,255,255,0.08),
      transparent
    );
  transform: translateX(-50%);
  z-index: 0;
}
@media (max-width: 900px) {
  .cp-steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .cp-steps-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .cp-steps-grid::before,
  .cp-steps-grid::after {
    display: none;
  }
}
.cp-step {
  position: relative;
z-index: 2;
  padding: 30px 28px;
  border-radius: 24px;
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.02)
    );
  border: 1px solid rgba(255,255,255,0.08);

  backdrop-filter: blur(10px);

  overflow: hidden;

  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
}

.cp-step::before {
  content: "";

  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at top right,
      rgba(var(--accent-rgb),0.12),
      transparent 40%
    );

  opacity: 0;

  transition: opacity 0.3s ease;
}

.cp-step:hover {
  transform: translateY(-6px);

  border-color: rgba(var(--accent-rgb),0.3);

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.06),
      rgba(255,255,255,0.03)
    );

  box-shadow:
    0 24px 60px rgba(0,0,0,0.4),
    0 0 24px rgba(var(--accent-rgb),0.08);
}

.cp-step:hover::before {
  opacity: 1;
}

.cp-step-num {
  font-family: var(--font-head);

  font-size: 4rem;

  font-weight: 800;

  line-height: 1;

  margin-bottom: 22px;

  color: rgba(var(--accent-rgb),0.95);

  text-shadow:
    0 0 20px rgba(var(--accent-rgb),0.2);
}

.cp-step-title {
  font-family: var(--font-head);

  font-size: 1.15rem;

  font-weight: 700;

  color: #ffffff;

  margin-bottom: 14px;
}

.cp-step-desc {
  font-size: 0.96rem;

  line-height: 1.8;

  color: rgba(255,255,255,0.72);
}

.cp-step-connector {
  display: none;
}

    /* ── FEATURES ── */
    .cp-features-grid {
      display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr));
      gap: 20px; margin-top: 56px;
    }
    .cp-feature {
  position: relative;

  overflow: hidden;

  padding: 32px;

  border-radius: 24px;

  border: 1px solid rgba(255,255,255,0.08);

  background:
    radial-gradient(
      circle at top right,
      rgba(var(--accent-rgb),0.14),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      rgba(18,28,58,0.96) 0%,
      rgba(10,18,40,0.98) 45%,
      rgba(6,12,28,1) 100%
    );

  backdrop-filter: blur(12px);

  box-shadow:
    0 10px 40px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.04);

  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
}

.cp-feature::before {
  content: "";

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.04),
      transparent 40%
    );

  pointer-events: none;
}

.cp-feature:hover {
  transform: translateY(-8px);

  border-color: rgba(var(--accent-rgb),0.3);

  background:
    radial-gradient(
      circle at top right,
      rgba(var(--accent-rgb),0.22),
      transparent 38%
    ),
    linear-gradient(
      135deg,
      rgba(22,34,68,1) 0%,
      rgba(12,20,46,1) 48%,
      rgba(8,14,34,1) 100%
    );

  box-shadow:
    0 22px 60px rgba(0,0,0,0.42),
    0 0 24px rgba(var(--accent-rgb),0.12);
}
    .cp-feature::after {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--accent), transparent);
      opacity: 0; transition: opacity 0.25s;
    }
    .cp-feature:hover { transform: translateY(-5px); border-color: rgba(var(--accent-rgb),0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
    .cp-feature:hover::after { opacity: 1; }
    .cp-feature-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: rgba(var(--accent-rgb),0.12);
      display: grid; place-items: center; font-size: 22px;
      margin-bottom: 20px;
    }
 .cp-feature-title {
  font-family: var(--font-head);
  font-size: clamp(1.15rem, 2vw, 1.55rem);
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 18px;
  letter-spacing: -0.03em;
  color: #ffffff;
  text-shadow:
    0 2px 12px rgba(0,0,0,0.35),
    0 0 18px rgba(var(--accent-rgb),0.12);
}

    .cp-feature-desc {
  font-size: 0.875rem;

  line-height: 1.75;

  color: rgba(255,255,255,0.72);

  text-shadow:
    0 1px 10px rgba(255,60,60,0.08);

  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.82) 0%,
    rgba(255,210,210,0.88) 45%,
    rgba(255,120,120,0.92) 100%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  background-clip: text;
}
    /* ── TUTOR SLIDER ── */
    .cp-slider-header {
      display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;
      margin-bottom: 48px; flex-wrap: wrap;
    }
    .cp-slider-controls { display: flex; gap: 10px; }
    .cp-slider-btn {
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--bg4); border: 1px solid var(--border);
      color: var(--text2); cursor: pointer;
      display: grid; place-items: center;
      transition: all 0.2s; font-size: 18px;
    }
    .cp-slider-btn:hover:not(:disabled) {
      background: var(--accent); border-color: var(--accent); color: #fff;
    }
    .cp-slider-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .cp-slider-viewport { overflow: hidden; }
    .cp-slider-track {
      display: flex; gap: 20px;
      transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
    }
    .cp-tutor-card {
  flex: 0 0 calc(33.333% - 14px);

  background:
    linear-gradient(
      180deg,
      rgba(20, 30, 58, 0.96) 0%,
      rgba(10, 16, 34, 1) 100%
    );

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 28px;

  padding: 30px;

  position: relative;

  overflow: hidden;

  transition: all 0.35s ease;

  box-shadow:
    0 10px 40px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.04);
}
    
    @media(max-width:900px){ .cp-tutor-card { flex: 0 0 calc(50% - 10px); } }
    @media(max-width:600px){ .cp-tutor-card { flex: 0 0 100%; } }
    .cp-tutor-card:hover { border-color: rgba(var(--accent-rgb),0.4); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
    .cp-tutor-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
    .cp-tutor-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), rgba(var(--accent-rgb),0.4));
      display: grid; place-items: center;
      font-family: var(--font-head); font-weight: 800; font-size: 17px; color: #fff;
      flex-shrink: 0;
    }
    /* Name */
.cp-tutor-name {
  font-family: var(--font-head);

  font-weight: 800;

  font-size: 1.35rem;

  color: #ffffff;

  margin-bottom: 4px;

  letter-spacing: -0.02em;
}
    /* Subject */
.cp-tutor-sub {
  font-size: 0.95rem;

  color: rgba(255,255,255,0.68);

  margin-top: 2px;
}
    /* Badge */
.cp-tutor-badge {
  position: absolute;

  top: 20px;

  right: 20px;

  padding: 7px 14px;

  border-radius: 999px;

  background: rgba(249,115,22,0.12);

  border: 1px solid rgba(249,115,22,0.3);

  color: #fdba74;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.04em;
}
    /* Meta */
.cp-tutor-meta {
  display: flex;

  gap: 24px;

  margin-top: 24px;

  padding-top: 20px;

  border-top: 1px solid rgba(255,255,255,0.08);
}
    .cp-tutor-meta-item { display: flex; flex-direction: column; gap: 2px;color: #ffffff; }
    .cp-tutor-meta-val {
  font-size: 1.05rem;

  font-weight: 700;

  color: #ffffff;
}
   .cp-tutor-meta-key {
  font-size: 0.78rem;

  color: rgba(255,255,255,0.45);

  margin-top: 3px;
}

    /* Button */
.cp-tutor-cta {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  margin-top: 26px;

  padding: 14px;

  border-radius: 16px;

  background:
    linear-gradient(
      90deg,
      #f97316 0%,
      #fb923c 100%
    );

  color: #ffffff;

  font-weight: 700;

  text-decoration: none;

  transition: all 0.3s ease;

  box-shadow:
    0 10px 30px rgba(249,115,22,0.25);
}

    .cp-tutor-cta:hover { background: var(--accent); color: #fff; }
    .cp-slider-dots { display: flex; gap: 8px; justify-content: center; margin-top: 32px; }
    .cp-dot {
      width: 8px; height: 8px; border-radius: 4px;
      background: var(--border); transition: all 0.3s; cursor: pointer; border: none;
    }
    .cp-dot.active { width: 28px; background: var(--accent); }

    /* ── PAGES GRID ── */
    .cp-pages-grid {
      display: grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr));
      gap: 16px; margin-top: 48px;
    }
    .cp-page-card {
      background: var(--bg4); border: 1px solid var(--border);
      border-radius: 14px; padding: 24px;
      text-decoration: none; color: inherit;
      display: flex; flex-direction: column;
      transition: all 0.25s; position: relative; overflow: hidden;
      min-height: 130px;
    }
    .cp-page-card::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(var(--accent-rgb),0.06), transparent);
      opacity: 0; transition: opacity 0.25s;
    }
    .cp-page-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
    .cp-page-card:hover::before { opacity: 1; }
    .cp-page-num {
      font-family: var(--font-head); font-size: 2.2rem; font-weight: 800;
      color: rgba(255,255,255,0.04); line-height: 1;
      position: absolute; top: 10px; right: 14px;
    }
    .cp-page-title {
      font-family: var(--font-head); font-weight: 700; font-size: 0.97rem;
      color: var(--text); flex: 1; margin-bottom: 16px; line-height: 1.4;
    }
    .cp-page-arrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--font-head); font-size: 12px; font-weight: 700;
      color: var(--accent);
    }
    .cp-page-arrow svg { transition: transform 0.2s; }
    .cp-page-card:hover .cp-page-arrow svg { transform: translateX(4px); }

    /* ── CTA BANNER ── */
    .cp-cta-band {
      background: linear-gradient(135deg,
        rgba(var(--accent-rgb),0.15) 0%,
        rgba(var(--accent-rgb),0.05) 50%,
        transparent 100%);
      border-top: 1px solid rgba(var(--accent-rgb),0.2);
      border-bottom: 1px solid rgba(var(--accent-rgb),0.2);
    }
    .cp-cta-inner {
      display: flex; align-items: center; justify-content: space-between;
      gap: 40px; flex-wrap: wrap;
    }
    .cp-cta-text {
      font-family: var(--font-head);
      font-size: clamp(1.4rem, 3vw, 2.1rem);
      font-weight: 800; line-height: 1.2; max-width: 580px;
    }
    .cp-cta-text em { color: var(--accent); font-style: normal; }

    /* ── FAQ ── */
    .cp-faqs { margin-top: 56px; display: flex; flex-direction: column; gap: 12px; }
    .cp-faq-item {
      background: var(--bg4); border: 1px solid var(--border);
      border-radius: 14px; overflow: hidden;
      transition: border-color 0.2s;
    }
    .cp-faq-item.open { border-color: rgba(var(--accent-rgb),0.35); }
    .cp-faq-q {
      width: 100%; background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: space-between;
      gap: 20px; padding: 22px 28px; text-align: left;
      font-family: var(--font-head); font-size: 1rem; font-weight: 700;
      color: var(--text); transition: color 0.2s;
    }
    .cp-faq-q:hover { color: var(--accent); }
    .cp-faq-icon {
      flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
      background: rgba(var(--accent-rgb),0.1);
      display: grid; place-items: center;
      font-size: 18px; color: var(--accent);
      transition: transform 0.3s, background 0.2s;
    }
    .cp-faq-item.open .cp-faq-icon { transform: rotate(45deg); background: var(--accent); color: #fff; }
    .cp-faq-a {
      max-height: 0; overflow: hidden;
      transition: max-height 0.4s ease, padding 0.3s;
      font-size: 0.95rem; color: var(--text2); line-height: 1.75;
      padding: 0 28px;
    }
    .cp-faq-item.open .cp-faq-a { max-height: 300px; padding: 0 28px 22px; }

    /* ── FORM ── */
    .cp-form-wrap {
      background: var(--bg4); border: 1px solid var(--border);
      border-radius: 24px; padding: 48px;
      margin-top: 48px;
    }
    @media(max-width:640px){ .cp-form-wrap { padding: 28px 20px; } }
    .cp-form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px;
    }
    @media(max-width:640px){ .cp-form-grid { grid-template-columns: 1fr; } }
    .cp-form-full { grid-column: 1 / -1; }
    .cp-field { display: flex; flex-direction: column; gap: 8px; }
    .cp-field label {
      font-family: var(--font-head); font-size: 12px; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted);
    }
    .cp-field input, .cp-field select, .cp-field textarea {
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text);
      font-family: var(--font-body); font-size: 15px;
      padding: 13px 16px; outline: none; transition: border-color 0.2s;
      -webkit-appearance: none;
    }
    .cp-field input:focus, .cp-field select:focus, .cp-field textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.1); }
    .cp-field textarea { resize: vertical; min-height: 130px; }
    .cp-field select option { background: var(--bg3); }
    .cp-form-submit {
      width: 100%; padding: 16px; margin-top: 8px;
      background: var(--accent); color: #fff;
      border: none; border-radius: 12px; cursor: pointer;
      font-family: var(--font-head); font-size: 16px; font-weight: 700;
      box-shadow: 0 8px 28px rgba(var(--accent-rgb),0.4);
      transition: all 0.22s;
    }
    .cp-form-submit:hover { filter: brightness(1.08); transform: translateY(-2px); }
    .cp-form-success {
      padding: 32px; text-align: center; margin-top: 20px;
      background: rgba(var(--accent-rgb),0.08);
      border: 1px solid rgba(var(--accent-rgb),0.3);
      border-radius: 16px;
    }
    .cp-form-success-icon { font-size: 3rem; margin-bottom: 16px; }
    .cp-form-success-title { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; margin-bottom: 8px; }
    .cp-form-success-sub { font-size: 0.95rem; color: var(--muted); }

    /* ── RELATED ── */
    .cp-related-flex { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 36px; }
    .cp-related-link {
      padding: 9px 18px; border: 1px solid var(--border);
      border-radius: 999px; font-size: 13px; font-weight: 500;
      color: var(--text2); text-decoration: none;
      transition: all 0.2s;
    }
    .cp-related-link:hover { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb),0.06); }

    /* ── TRUST BAR ── */
    .cp-trust-bar {
      display: flex; align-items: center; gap: 32px; flex-wrap: wrap;
      padding: 20px 0; margin-top: 40px;
      border-top: 1px solid var(--border);
    }
    .cp-trust-item {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 0.92rem;
  font-weight: 600;

  color: rgba(255,255,255,0.92);

  text-shadow:
    0 1px 2px rgba(0,0,0,0.6),
    0 2px 10px rgba(0,0,0,0.5);
}
    .cp-trust-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}

    /* ── RESPONSIVE ── */
    @media(max-width:640px) {
      .cp-hero-content { padding: 0 5vw 56px; }
      .cp-cta-inner { flex-direction: column; text-align: center; align-items: center; }
      .cp-steps-grid .cp-step:first-child { border-radius: 16px 16px 0 0; }
      .cp-steps-grid .cp-step:last-child  { border-radius: 0 0 16px 16px; }
      .cp-steps-grid .cp-step:not(:first-child) { border-left: 1px solid var(--border); border-top: none; }
    }
  `;

  return (
    <>
      <NavBar />
      <Head>
        <title>{page.title} | TutVex — Find Expert Tutors</title>
        <meta name="description" content={page.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="cp-hero">
        <div className="cp-hero-bg" />
        <div className="cp-hero-gradient" />
        <div className="cp-hero-bottom" />
        <div className="cp-hero-side" />

        <div
          ref={heroRef.ref}
          className={`cp-hero-content ${heroRef.visible ? "visible" : ""}`}
        >
          <div className="cp-hero-inner">
            <div className="cp-hero-eyebrow">
              <span className="cp-hero-eyebrow-flag">{meta.flag}</span>
              <span className="cp-hero-eyebrow-text">{meta.label}</span>
              <span className="cp-hero-eyebrow-dot" />
              <span className="cp-hero-eyebrow-text" style={{ opacity: 0.6 }}>Live Now</span>
            </div>

            <h1 className="cp-hero-title">
              {page.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="accent-word">
                {page.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            <p className="cp-hero-desc">{page.description}</p>

            <div className="cp-hero-actions">
              <a
                href="/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR"
                className="cp-btn cp-btn-primary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Find a Tutor
              </a>
              <a
                href="/tutor-flow/tutor-registration?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR"
                className="cp-btn cp-btn-ghost"
              >
                Apply as Tutor →
              </a>
            </div>

            <div className="cp-trust-bar">
              {[
                { icon: "✅", text: "Verified Tutors" },
                { icon: "🎁", text: "Free Trial Class" },
                { icon: "⭐", text: meta.stats?.[2]?.value + " Avg Rating" },
                { icon: "🔒", text: "Secure & Safe" },
              ].map((t) => (
                <div key={t.text} className="cp-trust-item">
                  <span className="cp-trust-icon">{t.icon}</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cp-hero-scroll-hint">
          <span>Scroll</span>
          <div className="cp-scroll-line" />
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────────── */}
      <div className="cp-ticker">
        <div className="cp-ticker-track">
          {[...meta.boards, ...meta.boards, ...meta.boards, ...meta.boards].map((b, i) => (
            <span key={i} className="cp-ticker-item">
              {b}
              <span className="cp-ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div className="cp-stats">
        <div
          ref={statsRef.ref}
          className={`cp-stats-grid ${statsRef.visible ? "visible" : ""}`}
        >
          {meta.stats.map((s) => (
            <div key={s.label} className="cp-stat">
              <div className="cp-stat-val">{s.value}</div>
              <div className="cp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section className="cp-section">
        <div className="cp-inner">
          <div
            ref={aboutRef.ref}
            className={`cp-about-grid cp-reveal ${aboutRef.visible ? "visible" : ""}`}
          >
            <div className="cp-about-img-wrap">
              <img className="cp-about-img" src={meta.heroImage} alt={`${meta.label} Tutoring`} loading="lazy" />
              <div className="cp-about-img-overlay" />
              <div className="cp-about-badge">{meta.flag} {meta.label}</div>
            </div>
            <div>
              <span className="cp-eyebrow">About This Service</span>
              <h2 className="cp-title">{meta.tagline}</h2>
              <p className="cp-body">{page.description}</p>
              <div className="cp-boards">
                {meta.boards.map((b) => (
                  <span key={b} className="cp-board-chip">{b}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <a href="/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR" className="cp-btn cp-btn-primary" style={{ fontSize: 14, padding: "12px 22px" }}>
                  Find Tutor Now →
                </a>
                <a href="/tutor-flow/tutor-registration?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR" className="cp-btn" style={{ fontSize: 14, padding: "12px 22px", background: "var(--bg4)", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: 10 }}>
                  Become a Tutor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="cp-section cp-section-dark cp-steps-section">
        <div className="cp-inner">
          <div
            ref={stepsRef.ref}
            className={`cp-reveal ${stepsRef.visible ? "visible" : ""}`}
          >
            <span className="cp-eyebrow">How It Works</span>
            <h2 className="cp-title">Get Started in 4 Simple Steps</h2>
            <div className="cp-steps-grid">
              {[
                { n: "01", t: "Share Your Needs", d: "Tell us the subject, grade level, and your schedule preferences so we can find the perfect match." },
                { n: "02", t: "Get Matched", d: "Our system connects you with verified, expert tutors within 24 hours — no guesswork." },
                { n: "03", t: "Free Trial Class", d: "Attend a completely free, no-commitment trial session to make sure the fit is right." },
                { n: "04", t: "Start Learning", d: "Book sessions at your own pace and track your progress with weekly performance reports." },
              ].map((s, i, arr) => (
                <div key={s.n} className="cp-step" style={i === 0 ? { borderRadius: "16px 0 0 16px" } : i === arr.length - 1 ? { borderRadius: "0 16px 16px 0" } : {}}>
                  <div className="cp-step-num">{s.n}</div>
                  <div className="cp-step-title">{s.t}</div>
                  <div className="cp-step-desc">{s.d}</div>
                  {i < arr.length - 1 && (
                    <div className="cp-step-connector">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="cp-section">
        <div className="cp-inner">
          <div
            ref={featuresRef.ref}
            className={`cp-reveal ${featuresRef.visible ? "visible" : ""}`}
          >
            <span className="cp-eyebrow">Why Choose Us</span>
            <h2 className="cp-title">Everything You Need to Succeed</h2>
            <p className="cp-body">
              TutVex brings together the best tutors in {meta.label} with a platform built around your success.
            </p>
            <div className="cp-features-grid">
              {meta.highlights.map((h, i) => (
                <div key={i} className="cp-feature">
                  <div className="cp-feature-icon">{h.icon}</div>
                  <div className="cp-feature-title">{h.title}</div>
                  <div className="cp-feature-desc">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST TUTORS SLIDER ───────────────────────────────────────────── */}
      <section className="cp-section cp-section-dark">
        <div className="cp-inner">
          <div
            ref={tutorsRef.ref}
            className={`cp-reveal ${tutorsRef.visible ? "visible" : ""}`}
          >
            <div className="cp-slider-header">
              <div>
                <span className="cp-eyebrow">Top-Rated Educators</span>
                <h2 className="cp-title" style={{ marginBottom: 0 }}>Best Tutors in {meta.label}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <a
                  href="/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR"
                  className="cp-btn cp-btn-primary"
                  style={{ fontSize: 13, padding: "11px 20px" }}
                >
                  View All Tutors →
                </a>
                <div className="cp-slider-controls">
                  <button
                    className="cp-slider-btn"
                    disabled={sliderIndex <= 0}
                    onClick={() => setSliderIndex((i) => Math.max(0, i - 1))}
                    aria-label="Previous"
                  >‹</button>
                  <button
                    className="cp-slider-btn"
                    disabled={sliderIndex >= maxIndex}
                    onClick={() => setSliderIndex((i) => Math.min(maxIndex, i + 1))}
                    aria-label="Next"
                  >›</button>
                </div>
              </div>
            </div>

            <div className="cp-slider-viewport">
              <div
                className="cp-slider-track"
                style={{ transform: `translateX(calc(-${sliderIndex * (100 / visibleTutors + 20 / visibleTutors)}% - ${sliderIndex * 20 / visibleTutors}px))` }}
              >
                {meta.tutors.map((t, i) => (
                  <div key={i} className="cp-tutor-card">
                    <span className="cp-tutor-badge">{t.badge}</span>
                    <div className="cp-tutor-top">
                      <div className="cp-tutor-avatar">{t.avatar}</div>
                      <div>
                        <div className="cp-tutor-name">{t.name}</div>
                        <div className="cp-tutor-sub">{t.subject}</div>
                      </div>
                    </div>
                    <div className="cp-tutor-meta">
                      <div className="cp-tutor-meta-item">
                        <span className="cp-tutor-meta-val" style={{ color: "var(--accent)" }}>★ {t.rating}</span>
                        <span className="cp-tutor-meta-key">Rating</span>
                      </div>
                      <div className="cp-tutor-meta-item">
                        <span className="cp-tutor-meta-val">{t.exp}</span>
                        <span className="cp-tutor-meta-key">Experience</span>
                      </div>
                      <div className="cp-tutor-meta-item">
                        <span className="cp-tutor-meta-val">Free</span>
                        <span className="cp-tutor-meta-key">Trial Class</span>
                      </div>
                    </div>
                    <a
                      href="/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR"
                      className="cp-tutor-cta"
                    >
                      Book Free Trial →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="cp-slider-dots">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`cp-dot ${i === sliderIndex ? "active" : ""}`}
                  onClick={() => setSliderIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL PAGES ────────────────────────────────────────────────────── */}
      <section id="pages" className="cp-section cp-section-darker">
        <div className="cp-inner">
          <div
            ref={pagesRef.ref}
            className={`cp-reveal ${pagesRef.visible ? "visible" : ""}`}
          >
            <span className="cp-eyebrow">All Services in {meta.label}</span>
            <h2 className="cp-title">Browse Every Tutoring Page</h2>
            <p className="cp-body">
              Explore our complete range of tutoring services available across {meta.label} — crafted to help you find exactly the right support.
            </p>
            <div className="cp-pages-grid">
              {allPages.map((p, i) => (
                <Link key={p.slug} href={`/${country}/${p.slug}`} className="cp-page-card">
                  <div className="cp-page-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="cp-page-title">{p.title}</div>
                  <div className="cp-page-arrow">
                    Explore
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────────── */}
      <section className="cp-section cp-cta-band">
        <div className="cp-inner">
          <div
            ref={ctaRef.ref}
            className={`cp-cta-inner cp-reveal ${ctaRef.visible ? "visible" : ""}`}
          >
            <div className="cp-cta-text">
              Ready to find your perfect tutor in <em>{meta.label}</em>?<br />
              <span style={{ fontSize: "0.65em", fontWeight: 600, color: "var(--muted)" }}>
                First class completely free — no credit card required.
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR" className="cp-btn cp-btn-primary">
                Find a Tutor Now →
              </a>
              <a href="/tutor-flow/tutor-registration?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR" className="cp-btn" style={{ background: "var(--bg4)", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: 10 }}>
                Apply as Tutor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      <section className="cp-section cp-section-dark">
        <div className="cp-inner">
          <div
            ref={faqRef.ref}
            className={`cp-reveal ${faqRef.visible ? "visible" : ""}`}
          >
            <span className="cp-eyebrow">FAQ</span>
            <h2 className="cp-title">Frequently Asked Questions</h2>
            <p className="cp-body">
              Everything you need to know about finding a tutor in {meta.label}.
            </p>
            <div className="cp-faqs">
              {meta.faqs.map((f, i) => (
                <div
                  key={i}
                  className={`cp-faq-item ${openFaq === i ? "open" : ""}`}
                >
                  <button
                    className="cp-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {f.q}
                    <span className="cp-faq-icon">+</span>
                  </button>
                  <div className="cp-faq-a">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
{/* ── CONTACT SECTION ── */}
<section className="cp-section cp-section-dark">
  <div className="cp-inner">
    <ContactPage />
  </div>
</section>
      {/* ── CONTACT FORM ─────────────────────────────────────────────────── */}
      {/* <section id="contact" className="cp-section">
        <div className="cp-inner">
          <div
            ref={formRef.ref}
            className={`cp-reveal ${formRef.visible ? "visible" : ""}`}
          >
            <span className="cp-eyebrow">Get In Touch</span>
            <h2 className="cp-title">Book Your Free Trial Class</h2>
            <p className="cp-body">
              Fill in the form and our team will connect you with the perfect tutor within 24 hours — completely free, no commitment required.
            </p>

            <div className="cp-form-wrap">
              {submitted ? (
                <div className="cp-form-success">
                  <div className="cp-form-success-icon">🎉</div>
                  <div className="cp-form-success-title">You&apos;re all set!</div>
                  <div className="cp-form-success-sub">
                    We&apos;ll contact you within 24 hours to schedule your free trial class.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="cp-form-grid">
                    <div className="cp-field">
                      <label>Full Name *</label>
                      <input required type="text" placeholder="Your full name" value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} />
                    </div>
                    <div className="cp-field">
                      <label>Email Address *</label>
                      <input required type="email" placeholder="you@example.com" value={formState.email} onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))} />
                    </div>
                    <div className="cp-field">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="+1 234 567 8900" value={formState.phone} onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))} />
                    </div>
                    <div className="cp-field">
                      <label>Subject Required *</label>
                      <select required value={formState.subject} onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}>
                        <option value="">Select a subject</option>
                        <option>Mathematics</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Biology</option>
                        <option>English</option>
                        <option>Computer Science</option>
                        <option>Economics</option>
                        <option>History</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="cp-field cp-form-full">
                      <label>Tell Us More</label>
                      <textarea placeholder="Your grade level, goals, preferred schedule, and anything else that helps us match you perfectly..." value={formState.message} onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))} />
                    </div>
                    <div className="cp-form-full">
                      <button type="submit" className="cp-form-submit">
                        Request Free Trial Class — It&apos;s Free →
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section> */}

      {/* ── RELATED LINKS ────────────────────────────────────────────────── */}
      <section className="cp-section cp-section-dark">
        <div className="cp-inner">
          <div
            ref={relatedRef.ref}
            className={`cp-reveal ${relatedRef.visible ? "visible" : ""}`}
          >
            <span className="cp-eyebrow">Explore More</span>
            <h2 className="cp-title">Related Services in {meta.label}</h2>
            <div className="cp-related-flex">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="cp-related-link">
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// ─── Static Generation ────────────────────────────────────────────────────────
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { country: string; slug: string } }[] = [];
  Object.entries(countryPages).forEach(([country, pages]) => {
    pages.forEach((page) => {
      paths.push({ params: { country, slug: page.slug } });
    });
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const country = params?.country as string;
  const slug = params?.slug as string;
  const pages = countryPages[country as keyof typeof countryPages] || [];
  const page = pages.find((p) => p.slug === slug);
  if (!page) return { notFound: true };
  return {
    props: {
      page,
      country,
      allPages: pages.map(({ slug, title }) => ({ slug, title })),
    },
  };
};
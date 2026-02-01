"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  // TrendingUp,
  Users,
  Sparkles,
  Target,
  LineChart as LineIcon,
  Brain,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* =========================================================
   DESIGN SYSTEM CONSTANTS
========================================================= */

const GRADIENT_TEXT =
  "bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent";

const CARD_GLASS =
  "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.08)]";

/* =========================================================
   PUBLIC SAFE DATA (INTERNATIONAL BENCHMARK STYLE)
========================================================= */

// Academic performance score improvement
const studentPerformanceTimeline = [
  { month: "Start", score: 42 },
  { month: "3 Months", score: 62 },
  { month: "6 Months", score: 78 },
  { month: "10 Months", score: 90 },
];

// AI Learning Flow (Conceptual Data)
const aiLearningPath = [
  { stage: "Assessment", value: 1 },
  { stage: "Personalized Plan", value: 2 },
  { stage: "Adaptive Practice", value: 3 },
  { stage: "Progress Tracking", value: 4 },
  { stage: "Mastery & Revision", value: 5 },
];


// Milestone achievement %
const learningTargets = [
  { stage: "3 Months", achieved: 65 },
  { stage: "6 Months", achieved: 82 },
  { stage: "10 Months", achieved: 94 },
];

// Learning improvement composition
const engagementSplit = [
  { name: "Concept Mastery", value: 40 },
  { name: "Practice Consistency", value: 35 },
  { name: "Confidence Boost", value: 25 },
];

const tutorMatchingFactors = [
  { factor: "Subject Expertise Match", score: 92 },
  { factor: "Teaching Style Fit", score: 86 },
  { factor: "Availability Alignment", score: 89 },
  { factor: "Parent Feedback Score", score: 91 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899"];

/* =========================================================
   PAGE COMPONENT
========================================================= */

export default function PublicStudentCharts() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-32 overflow-hidden">

      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 space-y-40">

        {/* =================================================
           INTRO STORY
        ================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <h2 className={`text-4xl md:text-5xl font-extrabold ${GRADIENT_TEXT}`}>
            Measurable Learning. Real Outcomes.
          </h2>

          <p className="text-xl text-gray-700 leading-relaxed">
            At Tutvex, learning is not abstract. We track progress,
            milestones, and confidence — turning effort into measurable academic
            growth.
          </p>
        </motion.div>

        {/* =================================================
           PERFORMANCE TIMELINE
        ================================================= */}
        <AnimatedChartSection
          icon={<LineIcon />}
          title="Academic Performance Growth"
          description="Students demonstrate consistent academic improvement through structured one-to-one tutoring."
          explanation="This chart represents average academic score improvement observed across multiple cohorts, benchmarked against international tutoring models."
          highlights={[
            "Early traction within first 3 months",
            "Strong syllabus command by mid-term",
            "Long-term exam readiness",
          ]}
        >
          <LineChart data={studentPerformanceTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366F1"
              strokeWidth={4}
              dot={{ r: 6 }}
            />
          </LineChart>
        </AnimatedChartSection>

        {/* =================================================
           TARGET ACHIEVEMENT
        ================================================= */}
        <AnimatedChartSection
          icon={<Target />}
          title="Milestone-Based Learning Targets"
          description="Students achieve structured academic milestones aligned with global best practices."
          explanation="Milestone tracking ensures parents and students have visibility into learning outcomes at every phase."
          highlights={[
            "Clear short-term goals",
            "Reduced learning anxiety",
            "Predictable academic outcomes",
          ]}
        >
          <BarChart data={learningTargets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="achieved"
              fill="#8B5CF6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </AnimatedChartSection>

        {/* =================================================
           LEARNING COMPOSITION
        ================================================= */}
        <AnimatedChartSection
          icon={<Users />}
          title="How Learning Improves"
          description="Balanced development across understanding, consistency, and confidence."
          explanation="Unlike rote-driven systems, Tutvex emphasizes holistic learning that compounds over time."
          highlights={[
            "Conceptual clarity over memorization",
            "Habit-driven practice models",
            "Confidence-led performance",
          ]}
        >
          <PieChart>
            <Pie
              data={engagementSplit}
              dataKey="value"
              outerRadius={130}
              innerRadius={70}
              label
            >
              {engagementSplit.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </AnimatedChartSection>

        <AnimatedChartSection
  icon={<Brain />}
  title="AI-Driven Personalized Learning Path"
  description="Each student follows a dynamic learning journey powered by AI."
  explanation="The system adapts continuously based on student performance, pace, and confidence."
  highlights={[
    "No fixed syllabus pressure",
    "Adaptive difficulty adjustment",
    "Personalized revision cycles",
  ]}
>
  <LineChart data={aiLearningPath}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="stage" />
    <YAxis hide />
    <Tooltip />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#8B5CF6"
      strokeWidth={4}
      dot={{ r: 8 }}
    />
  </LineChart>
</AnimatedChartSection>

<AnimatedChartSection
  icon={<Users />}
  title="AI-Powered Tutor Matching (Parents & Tutors)"
  description="Our AI matches students with tutors based on compatibility — not just availability."
  explanation="Matching considers subject expertise, teaching style, parent expectations, and tutor preferences."
  highlights={[
    "Higher student-tutor retention",
    "Better parent satisfaction",
    "Fair & meaningful jobs for tutors",
  ]}
>
  <BarChart data={tutorMatchingFactors}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="factor" />
    <YAxis />
    <Tooltip />
    <Bar
      dataKey="score"
      fill="#EC4899"
      radius={[10, 10, 0, 0]}
    />
  </BarChart>
</AnimatedChartSection>


        {/* =================================================
           CLOSING STATEMENT
        ================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <Sparkles className="mx-auto text-indigo-600" size={36} />
          <p className="text-2xl font-semibold text-gray-900">
            Learning that compounds. Confidence that lasts.
          </p>
          <p className="text-lg text-gray-700">
            Tutvex’s public learning metrics reflect globally aligned,
            outcome-driven education — designed to scale responsibly across
            regions and systems.
          </p>
        </motion.div>
        

      </div>
    </section>
  );
}

/* =========================================================
   ANIMATED SECTION COMPONENT
========================================================= */

const AnimatedChartSection = ({
  icon,
  title,
  description,
  explanation,
  highlights,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  explanation: string;
  highlights: string[];
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.9 }}
    className={`grid lg:grid-cols-2 gap-16 rounded-3xl p-14 ${CARD_GLASS}`}
  >
    {/* LEFT */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-indigo-600">{icon}</div>
        <h3 className={`text-3xl font-extrabold ${GRADIENT_TEXT}`}>
          {title}
        </h3>
      </div>

      <p className="text-lg text-gray-700">{description}</p>

      <p className="text-sm text-gray-600 leading-relaxed">
        {explanation}
      </p>

      <ul className="space-y-3 pt-2">
        {highlights.map((item, i) => (
          <li key={i} className="flex gap-3">
            <CheckCircle className="text-indigo-600 mt-1" />
            <span className="font-medium text-gray-800">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* RIGHT */}
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </motion.div>
);

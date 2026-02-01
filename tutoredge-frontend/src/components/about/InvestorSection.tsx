"use client";

import React from "react";
import {
  CheckCircle,
  Users,
  GraduationCap,
  IndianRupee,
  MapPin,
  Brain,
  TrendingUp,
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

/* ======================
   DATA
====================== */

const studentGrowth = [
  { year: "2021", value: 1200 },
  { year: "2022", value: 3200 },
  { year: "2023", value: 6500 },
  { year: "2024", value: 10000 },
];

const tutorGrowth = [
  { year: "2021", value: 300 },
  { year: "2022", value: 850 },
  { year: "2023", value: 1400 },
  { year: "2024", value: 2000 },
];

// const revenueGrowth = [
//   { year: "2022", value: 25 },
//   { year: "2023", value: 75 },
//   { year: "2024", value: 180 },
// ];

const aiMatchingImpact = [
  { stage: "Before AI", retention: 62 },
  { stage: "After AI", retention: 84 },
];

const allahabadRevenueProjection = [
  { year: "Year 1", revenue: 1.8 },
  { year: "Year 3", revenue: 3.6 },
  { year: "Year 5", revenue: 6.0 },
  { year: "Year 7", revenue: 8.5 },
  { year: "Year 10", revenue: 10.0 },
];

const profitVsCostData = [
  { name: "Revenue", amount: 21 },
  { name: "Ads Cost", amount: 6 },
  { name: "Employee Cost", amount: 4 },
  { name: "Net Profit", amount: 11 },
];

const cacLtvData = [
  { name: "CAC", value: 1200 },
  { name: "LTV", value: 8500 },
];

const geoData = [
  { name: "Metro", value: 45 },
  { name: "Tier-2", value: 35 },
  { name: "Tier-3", value: 20 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899"];

/* ======================
   COMPONENT
====================== */
export default function InvestorSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-28">
      <div className="max-w-6xl mx-auto px-6 space-y-32">

        {/* STUDENT GROWTH */}
        <ChartSection
          title="Student Growth"
          gradient
          description="Strong demand-side traction driven by referrals and long-term retention."
          highlights={["8x growth in 4 years", "High repeat enrollments", "Organic acquisition"]}
          icon={<Users />}
        >
          <LineChart data={studentGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" stroke="#6366F1" strokeWidth={4} />
          </LineChart>
        </ChartSection>

        {/* AI MATCHING */}
        <ChartSection
          title="AI Tutor Matching Engine"
          gradient
          description="AI-driven matching improves retention and learning outcomes."
          highlights={["Lower mismatch drop-offs", "Higher engagement", "Personalized learning"]}
          icon={<Brain />}
        >
          <BarChart data={aiMatchingImpact}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="retention" fill="#8B5CF6" />
          </BarChart>
        </ChartSection>

        {/* TUTOR NETWORK */}
        <ChartSection
          title="Tutor Network Expansion"
          gradient
          description="Supply-side scalability with strict quality control."
          highlights={["2000+ verified tutors", "Pan-India onboarding", "Low tutor churn"]}
          icon={<GraduationCap />}
        >
          <BarChart data={tutorGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ChartSection>

        {/* ALLAHABAD REVENUE */}
        <ChartSection
          title="Allahabad Revenue Potential (Single-City Model)"
          gradient
          description="A conservative city-level model showing strong profitability before national expansion."
          highlights={[
            "Total students: ~1.5 lakh",
            "Home tuition TAM: ~20,000",
            "Capture: 5k–10k students",
            "₹5–10 Cr yearly potential",
          ]}
          icon={<TrendingUp />}
        >
          <LineChart data={allahabadRevenueProjection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#6366F1" strokeWidth={4} />
          </LineChart>
        </ChartSection>

        {/* PROFIT VS COST */}
        <ChartSection
          title="Profit vs Cost (Allahabad – Yearly)"
          gradient
          description="Only two major cost heads: ads and employees."
          highlights={[
            "Revenue: ₹21 Cr",
            "Ads: ₹6 Cr",
            "Employees: ₹4 Cr",
            "Net Profit: ₹11 Cr",
          ]}
          icon={<IndianRupee />}
        >
          <BarChart data={profitVsCostData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartSection>

        {/* CAC vs LTV */}
        <ChartSection
          title="CAC vs LTV (Allahabad Base)"
          gradient
          description="Strong unit economics with high lifetime value."
          highlights={[
            "CAC: ₹1,200",
            "LTV: ₹8,500+",
            "Healthy margin for scaling",
          ]}
          icon={<TrendingUp />}
        >
          <BarChart data={cacLtvData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#EC4899" />
          </BarChart>
        </ChartSection>

        {/* GEO */}
        <ChartSection
          title="Geographic Reach"
          gradient
          description="Balanced presence across metros and emerging cities."
          highlights={["Tier-2 & Tier-3 dominance", "Lower CAC", "Scalable ops"]}
          icon={<MapPin />}
        >
          <PieChart>
            <Pie data={geoData} dataKey="value" outerRadius={120} label>
              {geoData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartSection>

      </div>
    </section>
  );
}

/* ======================
   REUSABLE BLOCK
====================== */
const ChartSection = ({
  title,
  description,
  highlights,
  icon,
  gradient,
  children,
}: any) => (
  <div className="grid lg:grid-cols-2 gap-14 bg-white rounded-3xl shadow-xl p-12 items-center">

    {/* LEFT */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-indigo-600">{icon}</div>
        <h3
          className={`text-3xl font-extrabold ${
            gradient
              ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent"
              : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      </div>

      <p className="text-lg text-gray-700">{description}</p>

      <ul className="space-y-3">
        {highlights.map((item: string, i: number) => (
          <li key={i} className="flex gap-3">
            <CheckCircle className="text-indigo-600 mt-1" />
            <span className="font-medium text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* RIGHT */}
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

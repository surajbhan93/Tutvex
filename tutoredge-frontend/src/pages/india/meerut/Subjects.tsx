import React from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const Subjects: React.FC = () => {
  const subjectCategories = [
    {
      title: "Mathematics Home Tutor in Meerut",
      badge: "Highest Demand",
      description: `Expert 1-on-1 Math tutors in ${city.name} for Class 1 to 12, CBSE, ICSE, and UP Board. Specialized focus on algebra, geometry, trigonometry, calculus, and board exam model paper drills.`,
      tags: ["Class 10 Maths", "Class 12 Maths", "IIT-JEE Maths", "Vedic Maths"],
      icon: "∑",
    },
    {
      title: "Science & Physics / Chemistry / Biology",
      badge: "Top Rated Tutors",
      description: `Comprehensive home tuition in ${city.name} covering Physics numericals, Organic & Inorganic Chemistry, and NEET Biology with visual note-making and concept clarity.`,
      tags: ["Class 10 Science", "Class 12 Physics", "Organic Chem", "NEET Biology"],
      icon: "⚛",
    },
    {
      title: "CBSE & ICSE Board Home Tutor Meerut",
      badge: "Board Specialists",
      description: `Dedicated home tutors familiar with the latest CBSE 2026 pattern, Competency-Based Questions (CBQs), and ICSE Council curriculum for top percentage scores.`,
      tags: ["CBSE Board", "ICSE Board", "UP Board (English)", "Sample Papers"],
      icon: "📜",
    },
    {
      title: "JEE Main & NEET Medical Entrance",
      badge: "Rank Booster",
      description: `Mentorship by IITians and medical specialists in ${city.name}. In-depth doubt resolution, formula applications, and previous 15-year question bank practice at home.`,
      tags: ["JEE Physics", "JEE Maths", "NEET Biology", "NEET Chemistry"],
      icon: "🎯",
    },
    {
      title: "Commerce, Accountancy & Economics",
      badge: "Commerce Hub",
      description: `Qualified CA-foundation & M.Com private tutors for Class 11 & 12 Accountancy, Economics, Business Studies, and Financial Management in ${city.name}.`,
      tags: ["Accountancy", "Economics", "Business Studies", "Applied Maths"],
      icon: "📊",
    },
    {
      title: "Female Home Tutor in Meerut",
      badge: "Parent Preferred",
      description: `Empathetic, highly qualified female home tutors available across all ${city.name} localities for young learners, girls' education, primary, and secondary school subjects.`,
      tags: ["All Subjects (Class 1-8)", "Lady Tutors", "Primary Care", "Safe Mentorship"],
      icon: "👩‍🏫",
    },
    {
      title: "English & Foreign Languages",
      badge: "Grammar & Speaking",
      description: `Improve English grammar, literature comprehension, answer writing skills, and spoken fluency for students across CBSE, ICSE, and international boards in ${city.name}.`,
      tags: ["English Literature", "Grammar", "Spoken English", "French / German"],
      icon: "🗣",
    },
    {
      title: "Coding, Computers & Python",
      badge: "Future Skills",
      description: `One-on-one computer science tuition in ${city.name} covering Python programming, Java, C++, Scratch, Web Development, and CBSE Computer Applications (Code 165/083).`,
      tags: ["Python Coding", "Java ICSE", "Computer Apps", "Web Basics"],
      icon: "💻",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            Comprehensive Subject Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Home Tuition in {city.name} for Every Class & Subject
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            From primary school foundations to senior secondary board excellence and entrance exam coaching, Tutvex provides specialized subject teachers right at your residence.
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjectCategories.map((item, idx) => (
            <div
              key={`subject-${idx}`}
              className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tag Pills */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={`tag-${idx}-${tIdx}`}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Class-wise Breakdown Ribbon */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
            Classes We Cover in {city.name} Home Tuition
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              { label: "Class 1 to 5", detail: "All Primary Subjects" },
              { label: "Class 6 to 8", detail: "Maths, Science, English" },
              { label: "Class 9 & 10", detail: "Board Foundations" },
              { label: "Class 11 & 12", detail: "PCM / PCB / Commerce" },
              { label: "JEE Main / Adv", detail: "IIT Entrance Prep" },
              { label: "NEET Medical", detail: "Biology Specialist" },
            ].map((cls, cIdx) => (
              <div key={`cls-${cIdx}`} className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="block font-bold text-cyan-400 text-sm">{cls.label}</span>
                <span className="text-[11px] text-slate-400">{cls.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subjects;

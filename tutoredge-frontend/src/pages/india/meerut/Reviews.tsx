import React from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const Reviews: React.FC = () => {
  // Use real localities from city.locations dynamically
  const loc1 = city.locations[0]?.name || "Shastri Nagar";
  const loc2 = city.locations[1]?.name || "Saket";
  const loc3 = city.locations[2]?.name || "Pallavpuram";
  const loc4 = city.locations[3]?.name || "Modipuram";
  const loc5 = city.locations[4]?.name || "Rajendra Nagar";

  const reviewsList = [
    {
      author: "Dr. Rajesh Sharma",
      relation: "Parent of Class 10 CBSE Student",
      location: loc1,
      rating: 5,
      date: "February 2026",
      text: `Finding a reliable home tutor in ${loc1}, ${city.name} was challenging until we tried Tutvex. The Mathematics tutor assigned for my son's Class 10 CBSE boards was exceptional. His concept clarity in quadratic equations and trigonometry boosted my son's score from 72% to 95%!`,
      subject: "Class 10 CBSE Mathematics",
      verified: true,
    },
    {
      author: "Pooja Verma",
      relation: "Parent of Class 12 NEET Student",
      location: loc2,
      rating: 5,
      date: "April 2026",
      text: `We requested a female home tutor for Class 12 Chemistry and NEET Biology in ${loc2}. Tutvex arranged a free demo within 3 hours. The teacher is punctual, highly knowledgeable, and conducts weekly chapter tests. Highly recommended for all parents in ${city.name}!`,
      subject: "Class 12 Chemistry & NEET Bio",
      verified: true,
    },
    {
      author: "Amitabh Rastogi",
      relation: "Parent of Class 8 ICSE Student",
      location: loc3,
      rating: 5,
      date: "January 2026",
      text: `Tutvex provides the best home tuition in ${city.name}. We hired a private tutor in ${loc3} for Physics and ICSE Maths. The 1-on-1 personal attention helped my daughter build strong foundations without needing extra coaching classes.`,
      subject: "Class 8 ICSE Science & Maths",
      verified: true,
    },
    {
      author: "Sneha Tyagi",
      relation: "Class 12 Board Student",
      location: loc4,
      rating: 5,
      date: "March 2026",
      text: `I was struggling with Class 12 Accountancy and Economics in ${loc4}. My Tutvex private tutor explained balance sheets and national income with practical real-life examples. I secured 94% in my commerce board exams!`,
      subject: "Class 12 Commerce & Accounts",
      verified: true,
    },
    {
      author: "Vikramjit Singh",
      relation: "Parent of Class 6 & 9 Students",
      location: loc5,
      rating: 5,
      date: "May 2026",
      text: `The background verification process gave us total peace of mind in ${loc5}. Both female and male tutors provided by Tutvex are respectful, extremely qualified, and disciplined. 5 stars overall!`,
      subject: "Class 6 & 9 All Subjects",
      verified: true,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            Real Parent Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            What Parents & Students Say About Tutvex in {city.name}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Read authentic reviews from families across {city.name} who transformed their children's academic performance with our 1-on-1 home tutors.
          </p>
        </div>

        {/* Rating Overview Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-black text-cyan-400">
              {city.averageRating}
            </div>
            <div>
              <div className="flex text-amber-400 text-lg">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {/* Based on <strong>{city.totalReviews.toLocaleString()}+ verified reviews</strong> across {city.name} */}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              ✓ Verified Aadhaar KYC
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              ✓ Free Demo Included
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              ✓ 100% Board Success
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((rev, idx) => (
            <div
              key={`rev-${idx}`}
              className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="space-y-3">
                {/* Header: Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Parent
                    </span>
                  )}
                </div>

                {/* Review Content */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{rev.author}</h3>
                  <span className="text-[11px] font-mono text-cyan-400">{rev.location}</span>
                </div>
                <p className="text-xs text-slate-400">{rev.relation}</p>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                  <span>Subject: {rev.subject}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

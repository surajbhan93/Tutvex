import React from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const InternalLinks: React.FC = () => {
  const internalLinkBlocks = [
    { title: "Female Home Tutor in Meerut", slug: "female-home-tutor-meerut", count: "1,200+ Tutors" },
    { title: "Math Tutor Meerut", slug: "math-tutor-meerut", count: "2,400+ Tutors" },
    { title: "Science Tutor Meerut", slug: "science-tutor-meerut", count: "2,100+ Tutors" },
    { title: "English Tutor Meerut", slug: "english-tutor-meerut", count: "1,500+ Tutors" },
    { title: "CBSE Home Tutor Meerut", slug: "cbse-home-tutor-meerut", count: "3,800+ Tutors" },
    { title: "ICSE Home Tutor Meerut", slug: "icse-home-tutor-meerut", count: "1,100+ Tutors" },
    { title: "Commerce Tutor Meerut", slug: "commerce-tutor-meerut", count: "850+ Tutors" },
    { title: "JEE Tutor Meerut", slug: "jee-tutor-meerut", count: "920+ Tutors" },
    { title: "NEET Tutor Meerut", slug: "neet-tutor-meerut", count: "980+ Tutors" },
    { title: "Coding Tutor Meerut", slug: "coding-tutor-meerut", count: "650+ Tutors" },
  ];

  return (
    <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white">Popular Home Tuition Search Categories in {city.name}</h3>
            <p className="text-xs text-slate-400">Explore specialized home tutors by subject, board, and entrance exam requirements</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            SEO Keyword Links
          </span>
        </div>

        {/* Dynamic Internal Links Navigation Grid */}
        <nav aria-label={`Home Tutor Categories in ${city.name}`} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {internalLinkBlocks.map((item, idx) => (
            <a
              key={`int-link-${idx}`}
              href={`/india/${city.slug}/${item.slug}`}
              className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all flex flex-col justify-between group"
              title={`${item.title} - Tutvex`}
            >
              <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                {item.count}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default InternalLinks;

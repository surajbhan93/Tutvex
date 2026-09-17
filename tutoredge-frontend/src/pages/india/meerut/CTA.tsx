import React from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const CTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase tracking-widest">
              Transform Your Child's Academic Journey Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Get the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Home Tutor in {city.name}</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Book a 100% free 1-on-1 demo session at your home with a background-verified tutor. No upfront fees, no obligation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#book-tutor-form"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label={`Book Free Demo Class in ${city.name}`}
            >
              Book Free Demo Class Now
            </a>

            <a
              href={`tel:${city.contact.phone}`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-extrabold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label={`Call Tutvex counselor directly at ${city.contact.phone}`}
            >
              <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69.55 0 1 .45 1 1V20a1 1 0 01-1 1C10.5 21 3 13.5 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.57.11.35.03.74-.27 1.02l-2.3 2.2z" />
              </svg>
              Direct Support: {city.contact.phone}
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
            <span>✓ Zero Registration Fees</span>
            <span>✓ 2-Hour Tutor Matching</span>
            <span>✓ Free Replacement Guarantee</span>
            <span>✓ All {city.locations.length}+ {city.name} Localities Covered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

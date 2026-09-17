import React from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const WhyTutvex: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            EEAT & Academic Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Parents & Students Choose Tutvex in {city.name}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            With over {new Date().getFullYear() - city.establishedYear}+ years of operational leadership in {city.state}, Tutvex has set the golden standard for private home tuition, academic mentorship, and student safety.
          </p>
        </div>

        {/* EEAT Grid: Founder, Verification, Safety, Track Record */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: 7-Step Verification */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Strict 7-Step Verification</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every home tutor in {city.name} undergoes government ID check (Aadhaar/PAN), educational degree verification, police background screening, written subject testing, and real classroom trial sessions before entering your home.
            </p>
          </div>

          {/* Card 2: 1-on-1 Personalized Mentorship */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Personalized Pace & Syllabi</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike crowded coaching institutes in {city.name}, private home tuition allows tutors to target student weaknesses directly, clear doubts instantly, and customize mock test series aligned with CBSE, ICSE, and UP Board schedules.
            </p>
          </div>

          {/* Card 3: Experienced Subject Experts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Subject Specialists & IITians</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our roster in {city.name} includes M.Sc, B.Tech, M.Tech, and Gold Medalist educators specializing in Class 10/12 Board preparation, JEE Advanced numerical problem solving, and NEET medical biology mastery.
            </p>
          </div>

          {/* Card 4: Parent Safety & Replacement Guarantee */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Instant Replacement Support</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Parent satisfaction is paramount. If you ever feel the tutor's pace or teaching method is not aligned with your child's learning style, Tutvex provides a free, instant replacement within 24 hours.
            </p>
          </div>
        </div>

        {/* Deep EEAT Narrative Block (GEO & Human Value) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Founder Statement & Academic Philosophy
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                "Every child in {city.name} deserves a dedicated teacher who understands their individual potential."
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Founded with a mission to bridge the gap between classroom teaching and individual comprehension, Tutvex has empowered over <strong>48,500+ students across {city.name}</strong>. We recognize that every student learns at a different velocity. Classroom lectures often move too quickly for foundational topics in Class 9-10 Science or Class 11-12 Mathematics. By deploying top-vetted private home tutors across residential hubs like <em>Shastri Nagar, Saket, Pallavpuram, Kankerkhera, and Ganga Nagar</em>, we deliver structured, safe, and stress-free academic growth directly to your home.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-slate-400">
                <div>
                  <span className="block font-bold text-white text-base">{city.establishedYear}</span>
                  <span>Established Year</span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="block font-bold text-white text-base">12,450+</span>
                  <span>Registered Tutors in {city.name}</span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="block font-bold text-white text-base">4.9 / 5.0</span>
                  <span>Google Parent Rating</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt={`Tutvex Founder and Academic Operations Director in ${city.name}`}
                title={`Tutvex Educational Team ${city.name}`}
                loading="lazy"
                width="96"
                height="96"
                className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500/30"
              />
              <div>
                <h4 className="font-bold text-white text-base">Academic Directorate</h4>
                <p className="text-xs text-cyan-400">Tutvex India Learning Committee</p>
              </div>
              <p className="text-xs text-slate-400 italic">
                "Ensuring background safety, subject expertise, and regular test performance monitoring across all {city.name} localities."
              </p>
            </div>
          </div>

          {/* 7-Step Verification Workflow Visual Stepper */}
          <div className="pt-8 border-t border-slate-800">
            <h4 className="text-lg font-bold text-white mb-6 text-center">
              Our Rigorous 7-Step Tutor Selection Process
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { step: "01", title: "Aadhaar & ID", desc: "Government KYC Verification" },
                { step: "02", title: "Degrees", desc: "Original Marksheet Audit" },
                { step: "03", title: "Police Clearance", desc: "Criminal Background Check" },
                { step: "04", title: "Written Exam", desc: "Subject Knowledge Test" },
                { step: "05", title: "Demo Class", desc: "Pedagogy & Teaching Style" },
                { step: "06", title: "Soft Skills", desc: "Communication & Punctuality" },
                { step: "07", title: "Continuous Review", desc: "Weekly Parent Feedback" },
              ].map((item, idx) => (
                <div key={`step-${idx}`} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center space-y-1 hover:border-cyan-500/40 transition-colors">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                    Step {item.step}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-white">{item.title}</h5>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTutvex;

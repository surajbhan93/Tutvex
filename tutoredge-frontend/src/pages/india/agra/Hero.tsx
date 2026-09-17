import React, { useState } from "react";
import { city } from "@/components/seoIndia/locations/up/agra";
import apiClient from "@/lib/apiClient";

export const Hero: React.FC = () => {
  // Extract top 5 localities dynamically to feature in hero text snippet
  const topLocalities = city.locations
    .slice(0, 5)
    .map((l) => (typeof l === "string" ? l : (l as any).name))
    .join(", ");

  // Form state & submission handler
  const [studentClass, setStudentClass] = useState("");
  const [locality, setLocality] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentClass || !locality || !phone) {
      setErrorMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Call Backend API via apiClient instance -> POST http://localhost:3001/api/v1/book-demo
      const response = await apiClient.post("/book-demo", {
        city: city.name,
        state: city.state,
        studentClass,
        locality,
        phone,
        sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
      });

      if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
        setStatus("success");
      } else {
        setErrorMessage(response.data?.message || "Failed to submit demo request.");
        setStatus("error");
      }
    } catch (err: any) {
      console.error("Frontend Form Submit Error:", err);
      const apiMessage = err.response?.data?.message || err.message || "Failed to submit demo request.";
      setErrorMessage(apiMessage);
      setStatus("error");
    }
  };

  return (
    <header className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Dynamic Animated Gradient Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-slate-400">
            <li>
              <a href="/" className="hover:text-cyan-400 transition-colors">
                Home
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <a href="/india" className="hover:text-cyan-400 transition-colors">
                India
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <span className="text-cyan-400 font-semibold" aria-current="page">
                {city.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Copy & Key Trust Signals */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>#1 Verified Home Tutor Bureau in {city.name}, {city.state} (Taj Nagri)</span>
            </div>

            {/* Main H1 Title */}
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Home Tutor in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300">
                {city.name}
              </span>
            </h1>

            {/* H2 Subtitle */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-200 tracking-tight">
              Looking for the Best Home Tuition in {city.name}?
            </h2>

            {/* AEO / GEO Paragraph introducing dynamic locations */}
            <p className="speakable-intro text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Tutvex connects students with 100% background-verified home tutors across every locality of {city.name} including{" "}
              <strong className="text-white font-semibold">{topLocalities}</strong>, and over {city.locations.length}+ neighborhood zones. Get customized 1-on-1 private tuition at your residence for CBSE, ICSE, UP Board, Class 1-12, Math, Science, JEE & NEET.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#book-tutor-form"
                className="inline-flex justify-center items-center px-8 py-4 rounded-xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all duration-200 transform-gpu hover:-translate-y-0.5 shadow-xl shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label={`Find Tutor in ${city.name}`}
              >
                Find Tutor Now
              </a>

              <a
                href={`tel:${city.contact.phone}`}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-xl text-base font-extrabold text-white bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label={`Call Tutvex support at ${city.contact.phone}`}
              >
                <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69.55 0 1 .45 1 1V20a1 1 0 01-1 1C10.5 21 3 13.5 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.57.11.35.03.74-.27 1.02l-2.3 2.2z" />
                </svg>
                Call Now: {city.contact.phone}
              </a>
            </div>

            {/* Glassmorphic Quick Trust Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-200">100% Verified Tutors</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-200">Free 1-on-1 Demo</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-200">Background Checked</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-200">11,800+ Active Tutors</span>
              </div>
            </div>
          </div>

          {/* Right Column: Ultra-Attractive Glassmorphic Form Card */}
          <div className="lg:col-span-5">
            <div
              id="book-tutor-form"
              className="bg-slate-900/80 border border-slate-700/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/30 space-y-5 transform-gpu hover:border-cyan-500/40 transition-colors duration-300"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Book Free Demo Session</h3>
                  <p className="text-xs text-slate-400">Get matched with top home tutors in 2 hours</p>
                </div>
                <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Instant Response
                </span>
              </div>

              {/* Functional Lead Form submitting via apiClient */}
              {status === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 animate-bounce">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white">Free Demo Requested!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Thank you! Our counselor in <strong>{city.name}</strong> will contact you at <span className="text-cyan-400 font-semibold">{phone}</span> within 2 hours to arrange your free 1-on-1 demo session.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setStudentClass("");
                      setLocality("");
                      setPhone("");
                    }}
                    className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Submit another demo request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label htmlFor="student-class" className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Student Class / Grade *
                    </label>
                    <select
                      id="student-class"
                      name="student-class"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      required
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    >
                      <option value="">Select Student Class</option>
                      <option value="class-1-5">Class 1 to 5 (Primary School)</option>
                      <option value="class-6-8">Class 6 to 8 (Middle School)</option>
                      <option value="class-9-10">Class 9 & 10 (CBSE / ICSE / UP Board)</option>
                      <option value="class-11-12-pcm">Class 11 & 12 (Physics, Chemistry, Maths)</option>
                      <option value="class-11-12-pcb">Class 11 & 12 (Physics, Chemistry, Biology)</option>
                      <option value="class-11-12-commerce">Class 11 & 12 (Commerce / Accounts)</option>
                      <option value="jee-neet">JEE Main / NEET Medical Entrance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="student-locality" className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Locality in {city.name} *
                    </label>
                    <select
                      id="student-locality"
                      name="student-locality"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      required
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    >
                      <option value="">Select your area in {city.name}</option>
                      {city.locations.map((loc) => {
                        const name = typeof loc === "string" ? loc : (loc as any).name;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        return (
                          <option key={`hero-select-agra-${slug}`} value={slug}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="parent-phone" className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Parent / Student Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="parent-phone"
                      name="parent-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      required
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 px-4 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all duration-200 shadow-lg shadow-cyan-500/20 text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      "Request Call Back & Free Demo"
                    )}
                  </button>
                </form>
              )}

              {/* Fast Loading SVG Placeholder Badge */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-md">
                  4.9★
                </div>
                <div className="text-xs text-slate-300">
                  <p className="font-semibold text-slate-100">Trusted by 44,200+ parents in {city.name}</p>
                  <p className="text-slate-400">Top ratings across CBSE, ICSE & UP Boards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;

import React, { useState } from "react";
import { useRouter } from "next/router";
import { city } from "@/components/seoIndia/locations/up/meerut";
import apiClient from "@/lib/apiClient";

export const Hero: React.FC = () => {
  const router = useRouter();

  // Extract top 4 localities dynamically to feature in hero text snippet
  const topLocalities = city.locations.slice(0, 5).map((l) => l.name).join(", ");

  // Full signup form state — matches /auth/parent/signup schema exactly
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locality, setLocality] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !locality || !phone) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const localityName =
        city.locations.find((l) => l.slug === locality)?.name || locality;

      // Payload shape matches the "form" object used in CreateAccount.tsx
      const form = {
        fullName,
        email,
        password,
        phone,
        location: {
          city: city.name,
          area: localityName,
          coordinates: {
            type: "Point",
            coordinates: [78.9629, 20.5937],
          },
        },
      };

      const res = await apiClient.post("/auth/parent/signup", form);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      setStatus("success");

      // Redirect to the next onboarding step after successful signup
      router.push("/find-tutor-flow/preferences");
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || err.response?.data?.message;
      setErrorMessage(
        backendMessage ||
          "This email is already registered. Please login instead."
      );
      setStatus("error");
    }
  };

  return (
    <header className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400">
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
              <span className="text-cyan-400 font-medium" aria-current="page">
                {city.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              #1 Home Tutor Network in {city.name}, {city.state}
            </div>

            {/* Main H1 Title */}
            <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Home Tutor in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{city.name}</span>
            </h1>

            {/* H2 Subtitle */}
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-200">
              Looking for the Best Home Tutor in {city.name}?
            </h2>

            {/* AEO / GEO Paragraph introducing dynamic localities */}
            <p className="speakable-intro text-base sm:text-lg text-slate-300 leading-relaxed">
              Tutvex helps students connect with verified and experienced home tutors across every major locality of {city.name} including <strong className="text-white font-medium">{topLocalities}</strong>, and over {city.locations.length}+ neighborhood zones. Whether you need a private tutor for CBSE Class 10 Board exams, ICSE, UP Board, Class 11-12 PCM/PCB, or NEET/JEE preparation, our 100% background-verified teachers provide customized 1-on-1 home tuition at your residence.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#book-tutor-form"
                className="inline-flex justify-center items-center px-7 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label={`Find Tutor in ${city.name}`}
              >
                Find Tutor Now
              </a>

              <a
                href={`tel:${city.contact.phone}`}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-slate-800/90 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label={`Call Tutvex support at ${city.contact.phone}`}
              >
                <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69.55 0 1 .45 1 1V20a1 1 0 01-1 1C10.5 21 3 13.5 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.57.11.35.03.74-.27 1.02l-2.3 2.2z" />
                </svg>
                Call Now: {city.contact.phone}
              </a>
            </div>

            {/* Key Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-300">100% Verified Tutors</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-300">Free 1-on-1 Demo</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-300">Background Verified</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-300">12,000+ Active Tutors</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic Card & Fast Inquiry Form */}
          <div className="lg:col-span-5">
            <div id="book-tutor-form" className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Create Your Account</h3>
                  <p className="text-xs text-slate-400">Sign up to get matched with top home tutors</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Response
                </span>
              </div>

              {/* Functional Signup Form — /auth/parent/signup submission */}
              {status === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white">Account Created!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Thank you! Our academic counselor in <strong>{city.name}</strong> will contact you at <span className="text-cyan-400 font-semibold">{phone}</span> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setFullName("");
                      setEmail("");
                      setPassword("");
                      setLocality("");
                      setPhone("");
                    }}
                    className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Create another account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label htmlFor="full-name" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-locality" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Locality in {city.name} *
                    </label>
                    <select
                      id="student-locality"
                      name="student-locality"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="">Select your area in {city.name}</option>
                      {city.locations.map((loc) => (
                        <option key={`hero-select-${loc.slug}`} value={loc.slug}>
                          {loc.name} {loc.pincode ? `(${loc.pincode})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="parent-phone" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="parent-phone"
                      name="parent-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      "Create Account →"
                    )}
                  </button>
                </form>
              )}

              {/* Hero Image Placeholder with SEO tags & Lazy Loading */}
              <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=150&q=80"
                  alt={`Verified Home Tutor teaching student in ${city.name}`}
                  title={`Tutvex Certified Home Tutor in ${city.name}`}
                  loading="lazy"
                  width="48"
                  height="48"
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50"
                />
                <div className="text-xs text-slate-300">
                  <p className="font-semibold text-slate-100">Trusted by over 48,500+ parents</p>
                  <p className="text-slate-400">4.9 ★★★★★ rating across {city.name} school boards</p>
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
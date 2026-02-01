import { Users, GraduationCap, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="
        relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700
        px-4 py-14
        text-white
      "
    >
      {/* Decorative Elements */}
      <div className="absolute -top-14 -left-14 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        
        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
          Trusted Learning Platform
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          How <span className="text-indigo-200">Tutvex</span> Works
        </h1>

        {/* Subtitle */}
        <p className="text-indigo-100 max-w-2xl mx-auto text-lg">
          Tutvex connects parents, students, and verified tutors on
          one secure platform. Find the right tutor, track learning,
          and achieve better academic results — step by step.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <a
            href="/how-it-works?type=parent"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-white text-indigo-600
              px-6 py-3 font-semibold
              hover:bg-indigo-50 transition
            "
          >
            <Users size={18} />
            For Parents
            <ArrowRight size={16} />
          </a>

          <a
            href="/how-it-works?type=tutor"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-white/30
              px-6 py-3 font-semibold
              hover:bg-white hover:text-indigo-600 transition
            "
          >
            <GraduationCap size={18} />
            For Tutors
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 flex flex-wrap justify-center gap-6 text-sm text-indigo-100">
          <span>✔ Verified Tutors</span>
          <span>✔ Parent Dashboard</span>
          <span>✔ Secure Payments</span>
          <span>✔ Replacement Support</span>
        </div>
      </div>
    </section>
  );
}

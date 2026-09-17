import { ShieldCheck, UserCheck, PhoneCall, Award, Users, BookCheck, CheckCircle2 } from "lucide-react";

interface EEATTrustSectionProps {
  formattedLocation: string;
}

export default function EEATTrustSection({ formattedLocation }: EEATTrustSectionProps) {
  const trustPillars = [
    {
      icon: ShieldCheck,
      title: "100% Background Verified Tutors",
      description:
        "Every tutor assigned in " +
        formattedLocation +
        " undergoes strict Aadhaar identity verification, address checks, and academic degree validation.",
    },
    {
      icon: UserCheck,
      title: "Subject Experts & Local Mentors",
      description:
        "We source top educators from Allahabad University, MNNIT, and premier regional colleges with 3+ years teaching experience.",
    },
    {
      icon: PhoneCall,
      title: "Dedicated Local Parent Support",
      description:
        "Direct access to our Prayagraj relationship manager for monthly progress tracking, tutor replacements, and fee transparency.",
    },
    {
      icon: Award,
      title: "Proven Academic Track Record",
      description:
        "Over 8 years of excellence in Allahabad with 94%+ of students scoring 85%+ in CBSE, ICSE, and UP Board examinations.",
    },
    {
      icon: Users,
      title: "10,000+ Happy Allahabad Families",
      description:
        "Trusted by parents across " +
        formattedLocation +
        ", Civil Lines, Katra, Naini, Jhusi, and surrounding residential colonies.",
    },
    {
      icon: BookCheck,
      title: "Flexible Offline & Online Options",
      description:
        "Choose personalized 1-on-1 home tuition at your residence or interactive online direct coaching based on your child's preference.",
    },
  ];

  return (
    <section
      id="eeat-trust-framework"
      className="my-16 bg-gradient-to-b from-slate-50 to-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm"
      aria-label="Trust and Experience Framework"
    >
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-block px-3.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full uppercase tracking-wider mb-2">
          Why Parents Trust Tutvex
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Uncompromised Quality & Safety for Students in {formattedLocation}
        </h2>
        <p className="mt-3 text-base text-gray-600">
          We combine local academic mentorship with rigorous safety standards so your child gets the best learning outcome.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition duration-200 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                {pillar.title}
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

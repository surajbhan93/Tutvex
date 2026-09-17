import Link from "next/link";
import { ALLAHABAD_LOCATIONS, SUBJECTS } from "@/lib/allahabad/seo.config";
import { MapPin, BookOpen, UserPlus, Search, HelpCircle, Navigation } from "lucide-react";

interface InternalLinksSectionProps {
  location: string;
  intent: string;
  formattedLocation: string;
  formattedIntent: string;
}

export default function InternalLinksSection({
  location,
  intent,
  formattedLocation,
  formattedIntent,
}: InternalLinksSectionProps) {
  const currentLocSlug = location.toLowerCase().trim().replace(/\s+/g, "-");
  const currentIntentSlug = intent.toLowerCase().trim().replace(/\s+/g, "-");

  // Pick 12 nearby locations dynamically (excluding current location)
  const nearbyLocations = ALLAHABAD_LOCATIONS.filter(
    (loc) => loc.toLowerCase().trim().replace(/\s+/g, "-") !== currentLocSlug
  ).slice(0, 12);

  // Popular subject links
  const topSubjects = SUBJECTS.slice(0, 10);

  return (
    <section
      id="internal-linking-hub"
      className="my-16 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-10"
      aria-label="Nearby Locations & Related Tuitions"
    >
      {/* 1. Related Areas in Allahabad */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>Explore Home Tutors in Other Allahabad Areas</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {formattedIntent} in Nearby Localities
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {nearbyLocations.map((loc) => {
            const locSlug = loc.toLowerCase().trim().replace(/\s+/g, "-");
            return (
              <Link
                key={loc}
                href={`/allahabad/${locSlug}/${currentIntentSlug}`}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-900 transition duration-150"
              >
                <span className="truncate">{formattedIntent} in {loc}</span>
                <Navigation className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 ml-1" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Popular Subject Pages in Location */}
      <div className="border-t border-gray-100 pt-8">
        <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-3">
          <BookOpen className="w-4 h-4" />
          <span>Subject Specific Tutors in {formattedLocation}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Popular Subjects in {formattedLocation}
        </h3>

        <div className="flex flex-wrap gap-2">
          {topSubjects.map((sub) => {
            const subSlug = `${sub.toLowerCase().replace(/\s+/g, "-")}-tutor`;
            return (
              <Link
                key={sub}
                href={`/allahabad/${currentLocSlug}/${subSlug}`}
                className="px-3.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-100 text-xs font-semibold text-purple-900 transition"
              >
                {sub} Tutor in {formattedLocation}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Portal Links */}
      <div className="border-t border-gray-100 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Link
          href="/find-tutor-flow/create-account/?source=SEO_FOOTER&campaign=FIND_TUTOR"
          className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition flex flex-col items-center justify-center gap-2"
        >
          <Search className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-950">Find Home Tutor</span>
        </Link>

        <Link
          href="/tutor-flow/tutor-registration/?role=tutor&source=SEO_FOOTER&campaign=BECOME_TUTOR"
          className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition flex flex-col items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-950">Tutor Registration</span>
        </Link>

        <Link
          href="/tutors/"
          className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex flex-col items-center justify-center gap-2"
        >
          <Navigation className="w-5 h-5 text-slate-700" />
          <span className="text-xs font-bold text-slate-900">Browse All Tutors</span>
        </Link>

        <Link
          href="/about"
          className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition flex flex-col items-center justify-center gap-2"
        >
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold text-amber-950">About Tutvex</span>
        </Link>
      </div>
    </section>
  );
}

import { getLocalityDetail } from "@/lib/allahabad/allahabadData";
import { SUBJECTS, POPULAR_CLASSES } from "@/lib/allahabad/seo.config";
import { BookOpen, MapPin, GraduationCap, School,  Check } from "lucide-react";

interface DynamicLocalContentProps {
  location: string;
  intent: string;
  formattedLocation: string;
  formattedIntent: string;
}

export default function DynamicLocalContent({
  location,
 
  formattedLocation,
  formattedIntent,
}: DynamicLocalContentProps) {
  const locality = getLocalityDetail(location);

  return (
    <div className="space-y-14 my-10">
      {/* 1. Deep Local Paragraph & Landmark Context */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>Local Area Coverage: {formattedLocation}, Prayagraj</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
          Premier {formattedIntent} Services Near {formattedLocation}
        </h2>

        <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
          Students residing in <strong>{formattedLocation}</strong> (Pincode {locality.pincode}) face unique academic competitive standards. Whether your child attends prominent local institutions like{" "}
          <span className="font-semibold text-gray-900">
            {locality.schools.join(", ")}
          </span>
          , securing individual attention in large classroom coaching is often challenging. Tutvex bridges this gap by bringing top-tier, background-verified personal tutors right to your doorstep.
        </p>

        <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
          Our tutors regularly conduct home tuition sessions near key local hubs such as{" "}
          <span className="font-semibold text-gray-900">
            {locality.nearbyLandmarks.join(", ")}
          </span>
          . With seamless connectivity via {locality.transportHubs[0] || "local transport stops"}, our teachers ensure prompt attendance and dedicated 1-on-1 focus.
        </p>

        {/* Local Micro-Landmarks Pills */}
        <div className="mt-6 flex flex-wrap gap-2 pt-2">
          {locality.popularColonies.map((colony) => (
            <span
              key={colony}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
            >
              <MapPin className="w-3 h-3 text-indigo-500" />
              {colony}
            </span>
          ))}
        </div>
      </section>

      {/* 2. Educational Hubs & Nearby Schools/Colleges */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-300">
            <School className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-3">Prominent Schools Near {formattedLocation}</h3>
          <p className="text-sm text-slate-300 mb-4">
            We provide custom syllabus aligned home tutors for CBSE, ICSE, ISC, and UP Board students from:
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
            {locality.schools.map((school, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{school}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-300">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-3">Colleges & Higher Education Hubs</h3>
          <p className="text-sm text-slate-300 mb-4">
            Our experienced mentors include post-graduates and scholars associated with leading institutions:
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
            {locality.colleges.map((college, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>{college}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Available Subjects & Classes Grid */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Subjects & Classes Offered in {formattedLocation}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tailored 1-on-1 study plans for foundational concepts, board exams, and competitive entrances.
          </p>
        </div>

        {/* Classes Bar */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {POPULAR_CLASSES.map((cls) => (
            <span
              key={cls}
              className="bg-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-900 border border-indigo-100 shadow-2xs"
            >
              {cls}
            </span>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SUBJECTS.slice(0, 15).map((subject) => (
            <div
              key={subject}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition duration-200 flex flex-col items-start"
            >
              <BookOpen className="w-5 h-5 text-indigo-600 mb-2" />
              <span className="font-bold text-gray-900 text-sm">{subject}</span>
              <span className="text-xs text-gray-500 mt-1">Tutor in {formattedLocation}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

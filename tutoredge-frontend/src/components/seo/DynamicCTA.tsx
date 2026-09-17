import Link from "next/link";
import { COMPANY_DETAILS } from "@/lib/allahabad/seo.config";
import { PhoneCall, MessageCircle, ArrowRight, ShieldCheck, CheckCircle, Star } from "lucide-react";

interface DynamicCTAProps {
  location: string;
  intent: string;
  formattedLocation: string;
  formattedIntent: string;
  type: "top" | "middle" | "sticky" | "bottom";
}

export default function DynamicCTA({
  location,
  
  formattedLocation,
  formattedIntent,
  type,
}: DynamicCTAProps) {
  const findTutorUrl = `/find-tutor-flow/create-account/?source=LOCATION_PAGE_${type.toUpperCase()}&campaign=FIND_TUTOR&location=${encodeURIComponent(location)}`;
  const becomeTutorUrl = `/tutor-flow/tutor-registration/?role=tutor&source=LOCATION_PAGE_${type.toUpperCase()}&campaign=BECOME_TUTOR`;
  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Tutvex, I am looking for ${formattedIntent} in ${formattedLocation}, Allahabad.`)}`;

  // 1. Sticky Bottom Mobile CTA Bar
  if (type === "sticky") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3 md:hidden">
        <div className="flex flex-col">
          <span className="text-xs font-extrabold text-indigo-900 truncate">
            {formattedIntent} in {formattedLocation}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Verified Local Tutors Available</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, "")}`}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-300 active:scale-95 transition"
            aria-label="Call Tutvex"
          >
            <PhoneCall className="w-4 h-4 text-indigo-600" />
          </a>

          <Link
            href={findTutorUrl}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition flex items-center gap-1.5"
          >
            <span>Book Free Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Middle Page Lead Generator Banner CTA
  if (type === "middle") {
    return (
      <div className="my-14 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wide mb-3">
            Instant Match Guarantee
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Get a Verified {formattedIntent} at Home in {formattedLocation} Within 24 Hours
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Tell us your class, subject, and budget requirements. Our Prayagraj team will arrange a 100% free home demo session with top-rated tutors.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={findTutorUrl}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:scale-105 transition text-sm flex items-center gap-2"
            >
              <span>Book Free Demo Class</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold px-6 py-3.5 rounded-2xl transition text-sm flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Bottom Comprehensive Conversion Banner
  if (type === "bottom") {
    return (
      <div className="my-16 bg-slate-950 rounded-3xl text-white p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center items-center gap-2 text-amber-400">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-white">4.9/5 Rating by 10,000+ Prayagraj Families</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Academic Success in {formattedLocation}?
          </h2>

          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Whether you need expert coaching for 10th/12th Board exams or personal guidance for competitive entrances, Tutvex connects you with verified teachers near {formattedLocation}.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <Link
              href={findTutorUrl}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition text-base"
            >
              Find a Tutor Now
            </Link>

            <Link
              href={becomeTutorUrl}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-8 py-4 rounded-2xl transition text-base"
            >
              Become a Tutor
            </Link>

            <a
              href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, "")}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition text-base flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Local Support</span>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              No Advance Booking Fee
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              Free Tutor Replacement
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Hero Primary CTA buttons fallback (type === 'top')
  return (
    <div className="flex flex-wrap items-center gap-4 pt-4">
      <Link
        href={findTutorUrl}
        className="bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition text-base flex items-center gap-2"
      >
        <span>Find Tutor in {formattedLocation}</span>
        <ArrowRight className="w-5 h-5 text-indigo-600" />
      </Link>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-4 rounded-2xl shadow-lg transition text-base flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5 fill-slate-950 text-emerald-500" />
        <span>Instant WhatsApp Connect</span>
      </a>
    </div>
  );
}

import { COMPANY_DETAILS } from "@/lib/allahabad/seo.config";
import { MapPin, Phone, Star, ShieldCheck, Navigation, ExternalLink, MessageSquare } from "lucide-react";

interface GoogleBusinessProfileSectionProps {
  formattedLocation: string;
}

export default function GoogleBusinessProfileSection({
  formattedLocation,
}: GoogleBusinessProfileSectionProps) {
  return (
    <section
      id="google-business-profile"
      className="my-14 rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      aria-label="Google Business Profile & Official Local Office"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Info & Action Buttons */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official Verified Google Business Profile
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {COMPANY_DETAILS.name} Prayagraj HQ & Local Tutors
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Serving student home tuition requests in <strong>{formattedLocation}</strong> and across Allahabad city with 100% verified local teachers.
            </p>
          </div>

          {/* Rating & Reviews Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-amber-400">{COMPANY_DETAILS.ratingValue}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="h-6 w-px bg-slate-700 hidden sm:block" />
            <div className="text-xs sm:text-sm text-slate-300">
              <strong className="text-white font-semibold">{COMPANY_DETAILS.reviewCount}+ Verified Google Reviews</strong>
              <div className="text-slate-400 text-xs">Top Rated Tuition Agency in Allahabad</div>
            </div>
          </div>

          {/* Office Address */}
          <div className="flex items-start gap-3 text-slate-300 text-sm">
            <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>{COMPANY_DETAILS.officeAddress}</span>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <a
              href={COMPANY_DETAILS.gbpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition text-center shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              View on Google Maps
            </a>

            <a
              href={COMPANY_DETAILS.cidLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition text-center"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              Get Directions
            </a>

            <a
              href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition text-center shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>

            <a
              href={COMPANY_DETAILS.gbpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-center shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              Open Reviews
            </a>
          </div>
        </div>

        {/* Right Column: Google Maps Embed (Lazy Loaded) */}
        <div className="lg:col-span-5 h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-700 shadow-lg bg-slate-800 relative">
          <iframe
            title={`Tutvex Google Map Location near ${formattedLocation}`}
            src={COMPANY_DETAILS.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition duration-300"
          />
        </div>
      </div>
    </section>
  );
}

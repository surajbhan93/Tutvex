import React from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const GoogleBusiness: React.FC = () => {
  const cidLinkPlaceholder = "https://www.google.com/maps?cid=11751135537078639160";
  const googleReviewLinkPlaceholder = "https://maps.app.goo.gl/UhN5ktigY6QWpPRC8";
  const mapEmbedPlaceholderUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d223368.81254040217!2d77.7938784!3d28.983290450000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60bc23a70671653d%3A0xa3146b82c30a9a38!2sTutvex%20%E2%80%93%20Home%20Tuition%20Provider%2C%20Meerut!5e0!3m2!1sen!2sin!4v1785498283769!5m2!1sen!2sin`;

  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            Verified Local Presence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Tutvex Google Business Profile - {city.name} Center
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Visit our local educational counseling hub or contact us directly on Google Maps for verified home tutor allotments in {city.name}.
          </p>
        </div>

        {/* Attractive GBP Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: GBP Card Details */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            {/* GBP Header with Google Logo Styling & Verified Badge */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Google Business Profile
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Tutvex Home Tutors {city.name}
                </h3>
                <p className="text-xs text-cyan-400 font-medium">Educational Institution & Home Tuition Bureau</p>
              </div>

              {/* Rating Pill */}
              <div className="bg-slate-950 border border-amber-500/30 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="text-2xl font-black text-amber-400">{city.averageRating}</span>
                <div>
                  {/* <div className="flex text-amber-400 text-sm">★★★★★</div> */}
                  {/* <span className="text-[11px] text-slate-400 font-semibold">{city.totalReviews.toLocaleString()} Google Reviews</span> */}
                </div>
              </div>
            </div>

            {/* Address & Hours Information */}
            <div className="space-y-3 pt-2 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span><strong>Address:</strong> {city.contact.address}</span>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Working Hours:</strong> {city.contact.workingHours}</span>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span><strong>Support Phone:</strong> {city.contact.phone}</span>
              </div>
            </div>

            {/* Quick Action Buttons (Directions, Call, Website, Share, Review) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <a
                href={cidLinkPlaceholder}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors text-center"
              >
                <svg className="w-5 h-5 text-cyan-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-xs font-bold text-white">Directions</span>
              </a>

              <a
                href={`tel:${city.contact.phone}`}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors text-center"
              >
                <svg className="w-5 h-5 text-emerald-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-xs font-bold text-white">Call Now</span>
              </a>

              <a
                href="https://tutvex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors text-center"
              >
                <svg className="w-5 h-5 text-indigo-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs font-bold text-white">Website</span>
              </a>

              <a
                href={googleReviewLinkPlaceholder}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors text-center"
              >
                <svg className="w-5 h-5 text-amber-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-xs font-bold text-white">Write Review</span>
              </a>
            </div>

            {/* CID & Map Placeholders Notes */}
            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
              <span>Google CID:11751135537078639160</span>
              <a href={cidLinkPlaceholder} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                View on Google Maps →
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Embed Placeholder */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800">
            <iframe
              src={mapEmbedPlaceholderUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Tutvex Google Map Embed ${city.name}`}
              className="w-full h-full object-cover filter grayscale contrast-125 opacity-85 hover:opacity-100 transition-opacity"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">📍 Serving all {city.name} PIN codes</span>
              <a href={cidLinkPlaceholder} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-bold hover:underline">
                Open Full Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleBusiness;

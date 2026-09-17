import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock3,
  ShieldCheck,
  Headphones,
  Send,
} from "lucide-react";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-[#060a12] py-24">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(249, 115, 22, 0.16), transparent 28%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 30%)' }} />

      <div className="absolute inset-0 bg-[size:60px_60px]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-5 py-2 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />

            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
              Support & Enquiries
            </span>
          </div>

          <h2 className="text-5xl font-[800] leading-none tracking-[-0.04em] text-white md:text-7xl">
            Contact{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Tutvex
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-8 text-slate-400">
            Looking for a verified tutor in India? Have questions about our
            platform? We’d love to help you.
          </p>

          {/* Trust Items */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <TrustItem
              icon={<Clock3 size={15} />}
              text="Replies within 2 hours"
            />

            <TrustItem
              icon={<ShieldCheck size={15} />}
              text="100% Verified Tutors"
            />

            <TrustItem
              icon={<Headphones size={15} />}
              text="Dedicated Support"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-20 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT FORM */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,14,25,1))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_30%)]" />

            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-400">
                  <Send size={20} />
                </div>

                <div>
                  <h3 className="text-3xl font-[800] tracking-[-0.03em] text-white">
                    Send a Message
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    We usually reply within 2 hours
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Full Name"
                    placeholder="Your full name"
                    type="text"
                  />

                  <InputField
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>

                <InputField
                  label="Phone Number"
                  placeholder="+91 XXXXX XXXXX"
                  type="tel"
                />

                <div>
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">
                    Your Message
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-orange-400/40 focus:bg-orange-400/[0.04]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 px-6 py-4 text-[15px] font-[800] text-black shadow-[0_12px_40px_rgba(251,146,60,0.35)] transition-all hover:-translate-y-[2px]"
                >
                  Send Message →
                </button>

                <p className="text-center text-xs text-slate-600">
                  🔒 Your information is safe with us.
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* Info Card */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(10,14,25,1))] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.42)]">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(168, 85, 247, 0.12), transparent 30%)' }} />

              <div className="relative z-10">
                <div className="mb-8 h-[2px] w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

                <h3 className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-100 bg-clip-text text-5xl font-[900] tracking-[-0.05em] text-transparent">
                  Tutvex
                </h3>

                <p className="mt-3 text-sm text-slate-500">
                  India’s trusted tutor marketplace
                </p>

                <div className="mt-10 space-y-7">
                  <InfoItem
                    icon={<Mail size={17} />}
                    label="Email"
                    value="support@tutvex.com"
                  />

                  <InfoItem
                    icon={<Phone size={17} />}
                    label="Phone"
                    value="+91 9305275932"
                  />

                  <InfoItem
                    icon={<MapPin size={17} />}
                    label="Location"
                    value="India"
                  />
                </div>

                <div className="mt-10 rounded-2xl border border-green-400/10 bg-green-400/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />

                    <p className="text-sm text-slate-400">
                      Avg. response time:
                      <span className="ml-1 font-semibold text-green-400">
                        under 2 hours
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-green-400/20 bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-sm font-bold text-white shadow-[0_15px_45px_rgba(34,197,94,0.25)] transition-all hover:-translate-y-[2px]">
              <MessageCircle size={18} />
              Chat on WhatsApp
            </button>

            {/* Map */}
            <div className="overflow-hidden rounded-[30px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <iframe
                title="map"
                src="https://www.google.com/maps?q=India&output=embed"
                width="100%"
                height="280"
                loading="lazy"
                className="w-full grayscale-[0.15]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* TRUST ITEM */

function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/10 text-orange-400">
        {icon}
      </div>

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

/* INPUT */

function InputField({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-orange-400/40 focus:bg-orange-400/[0.04]"
      />
    </div>
  );
}

/* INFO ITEM */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-orange-400">
        {icon}
      </div>

      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
          {label}
        </p>

        <p className="font-medium text-slate-300">{value}</p>
      </div>
    </div>
  );
}
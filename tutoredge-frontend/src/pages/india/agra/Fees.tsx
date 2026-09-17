import React from "react";
import { city } from "@/components/seoIndia/locations/up/agra";

export const Fees: React.FC = () => {
  const feeStructure = [
    {
      category: "Primary School (Class 1 - 5)",
      frequency: "5 Days / Week",
      hourlyRate: "₹250 - ₹350 / hr",
      monthlyFee: "₹2,500 - ₹4,000 / month",
      popularIn: "Kamla Nagar, Dayalbagh, Civil Lines",
      features: ["All subjects coverage", "Daily homework support", "Base building"],
    },
    {
      category: "Middle School (Class 6 - 8)",
      frequency: "5 Days / Week",
      hourlyRate: "₹350 - ₹450 / hr",
      monthlyFee: "₹3,500 - ₹5,500 / month",
      popularIn: "Sadar Bazaar, Shahganj, Bodla",
      features: ["Maths & Science focus", "Weekly surprise tests", "Conceptual clarity"],
    },
    {
      category: "Secondary (Class 9 & 10 Board)",
      frequency: "5-6 Days / Week",
      hourlyRate: "₹450 - ₹600 / hr",
      monthlyFee: "₹5,000 - ₹8,000 / month",
      popularIn: "Sikandra, Khandari, Lohamandi",
      features: ["CBSE / ICSE / UP board paper drills", "Competency questions", "1-on-1 revision"],
    },
    {
      category: "Senior Secondary (Class 11 & 12 PCM/PCB)",
      frequency: "4-5 Days / Week",
      hourlyRate: "₹600 - ₹900 / hr",
      monthlyFee: "₹7,000 - ₹12,000 / month",
      popularIn: "DEI Campus, Agra University, Taj Ganj",
      features: ["Physics, Chem, Maths/Bio", "Lab practical guidance", "Board exam focus"],
    },
    {
      category: "Competitive Exams (JEE Main & NEET)",
      frequency: "Flexible / 6 Days",
      hourlyRate: "₹800 - ₹1,200 / hr",
      monthlyFee: "₹10,000 - ₹15,000 / month",
      popularIn: "Anand Engg College Area, Trans Yamuna",
      features: ["IITian / Doctor faculty", "Advanced problem sets", "Speed & accuracy focus"],
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            Transparent Pricing Structure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Home Tuition Fees in {city.name} ({new Date().getFullYear()})
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Tutvex maintains 100% transparent and affordable home tuition fee structures across all {city.name} localities with no hidden agent fees or registration charges.
          </p>
        </div>

        {/* Pricing Table (Responsive Layout) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="py-4 px-6 font-bold text-white">Academic Level</th>
                <th scope="col" className="py-4 px-6 font-bold text-white">Weekly Frequency</th>
                <th scope="col" className="py-4 px-6 font-bold text-cyan-400">Approx Hourly Rate</th>
                <th scope="col" className="py-4 px-6 font-bold text-emerald-400">Estimated Monthly Fee</th>
                <th scope="col" className="py-4 px-6 font-bold text-white">Popular Areas in {city.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {feeStructure.map((item, idx) => (
                <tr key={`fee-agra-${idx}`} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-white">
                    {item.category}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.features.map((feat, fIdx) => (
                        <span key={`feat-agra-${fIdx}`} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-slate-300">{item.frequency}</td>
                  <td className="py-5 px-6 font-semibold text-cyan-300">{item.hourlyRate}</td>
                  <td className="py-5 px-6 font-bold text-emerald-400 text-base">{item.monthlyFee}</td>
                  <td className="py-5 px-6 text-xs text-slate-400">{item.popularIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Factors Affecting Fees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">Tutor Qualification & Experience</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Senior teachers, school faculties, and IITians/DEI alumni command higher hourly rates compared to university graduate tutors.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">Class Duration & Frequency</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sessions ranging from 1 hour to 2 hours per day, 3 to 6 days a week, adjust monthly pricing proportionately.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">Board & Exam Level</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ICSE & Senior Secondary Board syllabi require specialized test series preparation, influencing monthly tuition packages.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-2xl p-8 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Need a Customized Home Tuition Fee Quote in {city.name}?
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Contact our {city.name} counselor to get an exact tuition fee estimate based on your specific locality, subjects, and schedule.
          </p>
          <a
            href={`tel:${city.contact.phone}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors text-sm uppercase tracking-wide"
          >
            Get Custom Fee Quote: {city.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Fees;

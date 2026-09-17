import React, { useState } from "react";
import { city } from "@/components/seoIndia/locations/up/agra";

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: `How do I find the best home tutor in ${city.name} through Tutvex?`,
      answer: `Finding a verified home tutor in ${city.name} is seamless with Tutvex. Parents can submit student grade, subject, and locality details online or call our counselor. Tutvex matches your requirements with top-rated nearby educators, scheduling a free 1-on-1 demo session at your residence within 2 hours.`,
      category: "Booking & Demo",
    },
    {
      question: `What is the average monthly fee for home tuition in ${city.name}?`,
      answer: `Home tuition fees in ${city.name} range from ₹2,500 to ₹4,000 monthly for Primary classes (1 to 5), ₹3,500 to ₹5,500 for Middle classes (6 to 8), ₹5,000 to ₹8,000 for Class 9 and 10 Board prep, and ₹7,000 to ₹15,000 for Senior Secondary PCM, PCB, JEE, and NEET coaching.`,
      category: "Fees & Pricing",
    },
    {
      question: `Are all home tutors in ${city.name} background verified by Tutvex?`,
      answer: `Yes, 100% of home tutors on the Tutvex platform undergo a stringent 7-step background verification protocol. This includes government Aadhaar KYC identity checks, university degree qualification audits, criminal record clearances, written subject proficiency tests, and mandatory trial teaching evaluations before taking home assignments.`,
      category: "Safety & Verification",
    },
    {
      question: `Can I request a female home tutor in ${city.name} for my daughter?`,
      answer: `Yes, Tutvex maintains an extensive network of experienced, background-verified female home tutors across all key localities in ${city.name} including Kamla Nagar, Dayalbagh, Sadar Bazaar, Civil Lines, and Shahganj for all school grades, board exams, and foundational subjects.`,
      category: "Tutor Availability",
    },
    {
      question: `What happens if we are not satisfied after the free demo class?`,
      answer: `The initial 1-on-1 demo class at your residence is completely free with no financial obligation. If the tutor's teaching methodology or pace does not align with your child's learning style, Tutvex will immediately assign an alternative qualified subject specialist tailored to your expectations within 24 hours.`,
      category: "Guarantee & Trial",
    },
    {
      question: `Does Tutvex provide home tutors for CBSE, ICSE, and UP Board exams in ${city.name}?`,
      answer: `Yes, Tutvex provides expert home tutors for CBSE, ICSE, ISC, and UP Board curricula in ${city.name}. Tutors are thoroughly trained in updated NCERT guidelines, board pattern sample papers, competency-based questions, and strategic revision techniques to maximize your child's overall percentage.`,
      category: "Boards & Syllabi",
    },
    {
      question: `How quickly can a home tutor start teaching at our residence in ${city.name}?`,
      answer: `Once you share your learning requirements with Tutvex, our algorithm shortlists the best matched verified tutors near your locality within 2 hours. We schedule your free 1-on-1 demo class at a convenient time, and regular home tuition can begin immediately upon your approval.`,
      category: "Turnaround Time",
    },
    {
      question: `Do home tutors in ${city.name} prepare students for JEE and NEET entrance exams?`,
      answer: `Yes, Tutvex offers specialized home tutors for JEE Main, JEE Advanced, and NEET medical entrance exam preparation in ${city.name}. Our competitive exam tutors include engineering graduates, doctors, and DEI/Agra University alumni focused on advanced problem-solving, speed, accuracy, and previous 15-year entrance question banks.`,
      category: "Competitive Prep",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            AEO & AI Overview Optimized FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions: Home Tutor in {city.name}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Get instant, direct answers to common parent questions about home tuition fees, teacher verification, and demo bookings in {city.name}.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={`faq-item-agra-${idx}`}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-agra-${idx}`}
                >
                  <span className="font-bold text-white text-base sm:text-lg pr-4">
                    {faq.question}
                  </span>
                  <span className="shrink-0 p-1.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800">
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-agra-${idx}`}
                    className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 space-y-2"
                  >
                    {/* AEO Speakable answer block */}
                    <p className="speakable-faq-answer text-slate-200 font-medium">
                      {faq.answer}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                        {faq.category}
                      </span>
                      <span>Verified for Google AI Overview & Featured Snippets</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

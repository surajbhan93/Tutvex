import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

const faqs = [
  {
    q: "Is Tutvex free for parents?",
    a: "Yes. Parents can create an account, search tutors, compare profiles, and book demo classes for free. Payment is required only after finalizing a tutor.",
    icon: <HelpCircle className="text-indigo-600" />,
  },
  {
    q: "How does Tutvex verify tutors?",
    a: "All tutors go through phone verification, profile screening, subject expertise review, and interview before approval.",
    icon: <ShieldCheck className="text-indigo-600" />,
  },
  {
    q: "How do tutors get students?",
    a: "Approved tutors receive student requests based on subject, class, and location through the Tutvex dashboard.",
    icon: <Users className="text-indigo-600" />,
  },
  {
    q: "How are tutor payments managed?",
    a: "Tutors can track earnings, payments, and payout history transparently from their dashboard.",
    icon: <Wallet className="text-indigo-600" />,
  },
  {
    q: "Is Tutvex safe and reliable?",
    a: "Yes. Tutvex verifies both parents and tutors to ensure a secure and trusted learning experience.",
    icon: <ShieldCheck className="text-indigo-600" />,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-24 bg-gradient-to-b from-indigo-50 to-white rounded-3xl px-6 py-14">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex justify-center items-center gap-2">
          <HelpCircle className="text-indigo-600" />
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-gray-600">
          Common questions asked by parents and tutors on Tutvex
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border"
            >
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="w-full flex justify-between items-center px-6 py-4 text-left"
              >
                <div className="flex items-center gap-3 font-semibold text-gray-900">
                  {faq.icon}
                  {faq.q}
                </div>
                <ChevronDown
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

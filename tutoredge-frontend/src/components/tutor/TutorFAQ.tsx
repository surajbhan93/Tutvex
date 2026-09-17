import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface TutorFAQProps {
  tutorName: string;
  subjects?: string[];
  city?: string;
  area?: string;
  teachingMode?: string;
  price?: number;
  priceType?: "per_hour" | "per_month";
  experience?: number;
  customFAQs?: FAQ[];
}

/**
 * Generate dynamic FAQs based on tutor information
 */
function generateDynamicFAQs(props: TutorFAQProps): FAQ[] {
  const {
    tutorName,
    subjects = [],
    city,
    area,
    teachingMode,
    price,
    priceType,
    experience,
  } = props;

  const subjectList = subjects.length > 0 ? subjects.join(", ") : "various subjects";
  const location = [area, city].filter(Boolean).join(", ") || "the area";
  const cityName = city || "your area";
  const hasHomeMode = teachingMode?.toLowerCase().includes("home");
  const hasOnlineMode = teachingMode?.toLowerCase().includes("online");

  const faqs: FAQ[] = [
    {
      question: `What subjects does ${tutorName} teach?`,
      answer: `${tutorName} specializes in teaching ${subjectList}. They have ${experience || "extensive"} years of experience helping students excel in these subjects through personalized attention and proven teaching methods.`,
    },
    {
      question: `Does ${tutorName} provide home tuition in ${cityName}?`,
      answer: hasHomeMode
        ? `Yes, ${tutorName} provides home tuition in ${location}. They can visit your home at a convenient time to provide personalized one-on-one tutoring in a comfortable learning environment.`
        : `${tutorName} offers flexible teaching modes. Please contact them directly to discuss the best option for your location in ${location}, including the possibility of home tuition.`,
    },
    {
      question: `Are online classes available with ${tutorName}?`,
      answer: hasOnlineMode
        ? `Yes, ${tutorName} offers online classes through video conferencing platforms. This allows students from anywhere to learn with high-quality virtual instruction, interactive sessions, and digital study materials.`
        : `For information about online class availability, please book a free demo class or contact ${tutorName} directly to discuss your preferred learning mode.`,
    },
    {
      question: `What are ${tutorName}'s tuition fees?`,
      answer: price
        ? `${tutorName}'s tuition fees start at ₹${price} ${priceType === "per_hour" ? "per hour" : "per month"}. The actual fees may vary based on the class level, subject complexity, teaching mode (home/online), and session frequency. Book a free demo to get a personalized quote.`
        : `Tuition fees vary based on class, subject, teaching mode, and session frequency. ${tutorName} offers competitive and transparent pricing. Book a free demo class to discuss fees that fit your requirements and budget.`,
    },
    {
      question: `Can I book a free demo class with ${tutorName}?`,
      answer: `Absolutely! ${tutorName} offers a free demo class so you can experience their teaching style firsthand. This no-obligation demo helps you understand their methodology and decide if it's the right fit for your learning needs. Click the "Book Free Demo Class" button to schedule your session.`,
    },
    {
      question: `What is ${tutorName}'s teaching experience?`,
      answer: experience
        ? `${tutorName} has ${experience}+ years of teaching experience with a proven track record of helping students achieve academic excellence. They have worked with students of various levels and understand different learning styles.`
        : `${tutorName} is an experienced educator with a strong track record in teaching ${subjectList}. They use modern teaching methods and personalized approaches to ensure every student reaches their full potential.`,
    },
    {
      question: `How do I contact ${tutorName}?`,
      answer: `You can connect with ${tutorName} through multiple ways: (1) Click "Book Free Demo Class" to schedule a session directly, (2) Use the WhatsApp button for instant messaging, (3) Request a callback and we'll connect you within 1 hour. Choose the method that's most convenient for you.`,
    },
    {
      question: `What classes does ${tutorName} teach?`,
      answer: `${tutorName} teaches students across various class levels. Whether you're looking for help with school curriculum, competitive exam preparation, or conceptual understanding, ${tutorName} customizes the teaching approach based on your specific class and learning goals.`,
    },
    {
      question: `Is ${tutorName} verified on Tutvex?`,
      answer: `Yes, ${tutorName} is a verified tutor on Tutvex. All our tutors undergo thorough background verification, credential checks, and quality assessments before being listed on our platform. You can trust that you're learning from a qualified and certified educator.`,
    },
    {
      question: `What teaching methodology does ${tutorName} follow?`,
      answer: `${tutorName} follows a student-centric teaching approach that includes concept-based learning, regular assessments, doubt-solving sessions, and personalized study plans. They focus on building strong fundamentals while preparing students for exams through practice and revision.`,
    },
  ];

  return faqs;
}

export default function TutorFAQ(props: TutorFAQProps) {
  const { customFAQs } = props;
  const faqs = customFAQs || generateDynamicFAQs(props);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <HelpCircle size={16} />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Have Questions? We've Got Answers
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about learning with {props.tutorName}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div
                className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
                  openIndex === index
                    ? "border-indigo-500"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 group"
                  aria-expanded={openIndex === index}
                >
                  <span className="flex-1">
                    <h3
                      className={`text-base sm:text-lg font-bold transition-colors duration-200 ${
                        openIndex === index
                          ? "text-indigo-600"
                          : "text-gray-900 group-hover:text-indigo-600"
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </span>

                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      size={24}
                      className={`transition-colors duration-200 ${
                        openIndex === index
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600"
                      }`}
                    />
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100 shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <MessageCircle size={28} className="text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Still Have Questions?
            </h3>

            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Our team is here to help! Book a free demo class or get in touch with us directly.
              We'll answer all your questions and help you get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <MessageCircle size={18} />
                Contact Support
              </button>

              <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 px-6 py-3 rounded-xl font-semibold border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300">
                <HelpCircle size={18} />
                View More FAQs
              </button>
            </div>
          </div>
        </motion.div>

        {/* SEO Structured Data Note */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>
            This FAQ section is optimized for search engines to help students and parents find answers quickly.
          </p>
        </div>
      </div>
    </section>
  );
}

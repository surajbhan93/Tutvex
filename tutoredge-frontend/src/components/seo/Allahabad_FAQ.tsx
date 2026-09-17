import Head from "next/head";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  HelpCircle,
  MapPin,
  Users,
  GraduationCap,
  Wallet,
  Laptop,
  BadgeCheck,
  BookOpen,
} from "lucide-react";

interface AllahabadFAQProps {
  area?: string; // optional (Civil Lines, Katra etc.)
  intent: string;
}

export default function AllahabadFAQSchema({ area }: AllahabadFAQProps) {
  const locationText = area ? `${area}, Allahabad` : "Allahabad (Prayagraj)";

  /* =====================================================
     🔥 ALLAHABAD-SPECIFIC FAQ DATA
  ===================================================== */

  const faqList = [
    {
      icon: MapPin,
      q: `How can I find home tutors in ${locationText}?`,
      a: `You can find verified home tutors in ${locationText} through Tutvex. Simply choose your area, select the subject, and get matched with nearby qualified tutors.`,
    },
    {
      icon: BadgeCheck,
      q: `Are home tutors in Allahabad verified by Tutvex?`,
      a: `Yes, all tutors listed on Tutvex for Allahabad are verified through background checks and profile screening to ensure quality and safety.`,
    },
    {
      icon: GraduationCap,
      q: `Which boards and classes do tutors in Allahabad teach?`,
      a: `Tutors in Allahabad teach CBSE, ICSE, UP Board, and help with competitive exams like NEET and JEE across multiple classes.`,
    },
    {
      icon: Laptop,
      q: `Is online tuition available in Allahabad along with home tuition?`,
      a: `Yes, students in Allahabad can choose between home tuition and online classes depending on convenience and tutor availability.`,
    },
    {
      icon: Wallet,
      q: `What is the average fee for home tutors in Allahabad?`,
      a: `Home tutor fees in Allahabad depend on subject, class, and tutor experience. Tutvex offers flexible and affordable pricing options.`,
    },
    {
      icon: Users,
      q: `Can I choose a tutor near my locality in Allahabad?`,
      a: `Yes, Tutvex matches students with tutors located near their area in Allahabad to ensure convenient and regular home tuition.`,
    },
    {
      icon: BookOpen,
      q: `Do tutors in Allahabad provide demo classes?`,
      a: `Many tutors offer demo or trial classes so parents and students can evaluate teaching quality before making a final decision.`,
    },
    {
      icon: GraduationCap,
      q: `How can I become a tutor in Allahabad with Tutvex?`,
      a: (
        <>
          If you want to teach students in Allahabad, you can{" "}
          <Link
            href="/tutor-flow/tutor-registration/?role=tutor&source=FAQ&campaign=BECOME_TUTOR"
            className="text-blue-600 font-semibold hover:underline"
          >
            register as a tutor
          </Link>{" "}
          on Tutvex and start connecting with local students.
        </>
      ),
    },
  ];

  /* =====================================================
     🔥 JSON-LD SCHEMA (SEO SAFE)
  ===================================================== */

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          typeof item.a === "string"
            ? item.a
            : `Tutvex provides verified home and online tutors in ${locationText}.`,
      },
    })),
  };

  /* =====================================================
     🔥 UI (SAME LOOK & FEEL)
  ===================================================== */

  return (
    <>
      {/* SEO: FAQ Schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <section className="relative bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
              <HelpCircle size={16} />
              FAQs
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Common questions about home tuition and tutors in{" "}
              <strong>{locationText}</strong>.
            </p>
          </motion.div>

          {/* ACCORDION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-14 bg-white border rounded-3xl shadow-sm overflow-hidden"
          >
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              className="divide-y"
            >
              {faqList.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="px-6 py-2"
                >
                  <AccordionTrigger className="flex items-center gap-3 text-left font-semibold text-gray-900 hover:no-underline">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <item.icon size={18} />
                    </span>
                    <span className="flex-1">{item.q}</span>
                  </AccordionTrigger>

                  <AccordionContent className="pl-12 pr-2 pb-6 text-gray-600 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 bg-blue-50 border border-blue-100 rounded-2xl p-6"
          >
            <p className="text-gray-800 font-medium">
              Ready to find the right tutor in {locationText}?
            </p>

            <div className="flex gap-4">
              <Link
                href="/find-tutor-flow/create-account/?source=FAQ&campaign=FIND_TUTOR"
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Find a Tutor
              </Link>

              <Link
                href="/tutor-flow/tutor-registration/?role=tutor&source=FAQ&campaign=BECOME_TUTOR"
                className="px-5 py-2.5 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
              >
                Become a Tutor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

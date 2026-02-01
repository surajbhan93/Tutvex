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
} from "lucide-react";

interface FAQSchemaProps {
  cityName: string;
  location: string;
  intent: string;
}

export default function FAQSchema({
  cityName,
  location,
  intent,
}: FAQSchemaProps) {
  /* =====================================================
     🔥 FAQ DATA (SINGLE SOURCE OF TRUTH)
  ===================================================== */

  const faqList = [
    {
      icon: MapPin,
      q: `How to find ${intent} in ${location}, ${cityName}?`,
      a: (
        <>
          You can easily find <strong>{intent}</strong> in {location},{" "}
          {cityName} using our platform. Simply start with{" "}
          <Link
            href="/find-tutor-flow/create-account/?source=FAQ&campaign=FIND_TUTOR"
            className="text-blue-600 font-semibold hover:underline"
          >
            Find a Tutor
          </Link>{" "}
          and get matched with verified home and online tutors near you.
        </>
      ),
    },
    {
      icon: BadgeCheck,
      q: `Are tutors in ${location}, ${cityName} verified?`,
      a: (
        <>
          Yes, all tutors in {location}, {cityName} are background-checked and
          verified. You can also{" "}
          <Link
            href="/tutors/"
            className="text-blue-600 font-semibold hover:underline"
          >
            browse tutor profiles
          </Link>{" "}
          to review experience, subjects and ratings.
        </>
      ),
    },
    {
      icon: Laptop,
      q: `Do tutors provide home tuition or online classes in ${location}?`,
      a: `Tutors in ${location}, ${cityName} offer both home tuition and online classes depending on the student's preference.`,
    },
    {
      icon: GraduationCap,
      q: `What subjects are covered by tutors in ${location}, ${cityName}?`,
      a: `Tutors in ${location}, ${cityName} cover Maths, Science, English, CBSE, ICSE, State Boards and competitive exam preparation.`,
    },
    {
      icon: Wallet,
      q: `How much does ${intent} cost in ${cityName}?`,
      a: `The cost depends on subject, class and tutor experience. Our platform offers affordable and flexible fee options.`,
    },
    {
      icon: Users,
      q: `Can I choose a tutor near my home in ${location}?`,
      a: `Yes, we match students with tutors located near ${location}, ${cityName} for convenient home tuition.`,
    },
    {
      icon: HelpCircle,
      q: `Is demo class available before hiring a tutor?`,
      a: `Many tutors provide demo or trial classes so parents and students can evaluate teaching quality before finalizing.`,
    },
    {
      icon: GraduationCap,
      q: `I want to teach students in ${cityName}. How can I join as a tutor?`,
      a: (
        <>
          If you are an experienced teacher, you can{" "}
          <Link
            href="/tutor-flow/tutor-registration/?role=tutor&source=FAQ&campaign=BECOME_TUTOR"
            className="text-blue-600 font-semibold hover:underline"
          >
            become a tutor
          </Link>{" "}
          and start earning by teaching students near you.
        </>
      ),
    },
  ];

  /* =====================================================
     🔥 JSON-LD (NO LOGIC CHANGE)
  ===================================================== */

  const faqs = {
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
            : `${intent} services available in ${location}, ${cityName}.`,
      },
    })),
  };

  const faqCount = faqList.length;

  /* =====================================================
     🔥 UI
  ===================================================== */

  return (
    <>
      {/* ===========================
          SEO: FAQ SCHEMA
      =========================== */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
        />
      </Head>

      {/* ===========================
          FAQ SECTION
      =========================== */}
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
              {faqCount} Frequently Asked Questions
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Everything parents and students need to know about{" "}
              <strong>{intent}</strong> in {location}, {cityName}.
            </p>
          </motion.div>

          {/* FAQ ACCORDION */}
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
                  <AccordionTrigger className="flex items-center gap-3 text-left text-gray-900 font-semibold hover:no-underline">
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

          {/* BOTTOM CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 bg-blue-50 border border-blue-100 rounded-2xl p-6"
          >
            <p className="text-gray-800 font-medium">
              Still have questions? Find the right tutor near you.
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

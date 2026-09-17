// ✅ Allahabad-only auto SEO

import Head from "next/head";
import {
  ALLAHABAD_LOCATIONS,
  INTENTS,
  SUBJECTS,
} from "./seo.config";

function generateAllahabadKeywords() {
  const keywords = new Set<string>();

  ALLAHABAD_LOCATIONS.forEach((location) => {
    Object.values(INTENTS).forEach((intentGroup) => {
      intentGroup.forEach((intent) => {
        keywords.add(`${intent} in ${location}`);
        keywords.add(`${intent} near ${location}`);

        SUBJECTS.forEach((subject) => {
          keywords.add(`${subject} ${intent} in ${location}`);
          keywords.add(`${subject} ${intent} near ${location}`);
        });
      });
    });
  });

  return Array.from(keywords).join(", ");
}

export default function AllahabadSEO({
  pageType = "home",
}: {
  pageType?: "home" | "need-tutor" | "become-tutor";
}) {
  const keywords = generateAllahabadKeywords();

  const titles = {
    home:
      "Best Home Tutor in Allahabad | Maths, Science, CBSE, ICSE",
    "need-tutor":
      "Need Home Tutor in Allahabad? Verified Tutors Near You",
    "become-tutor":
      "Become a Home Tutor in Allahabad | Tutor Jobs Available",
  };

  const descriptions = {
    home:
      "Find the best home tutors in Allahabad, Prayagraj, Jhusi, Naini & nearby areas. Maths, Science, English & more.",
    "need-tutor":
      "Looking for a trusted home tutor in Allahabad? Hire verified tutors for all classes and subjects.",
    "become-tutor":
      "Want to become a tutor in Allahabad? Start earning by teaching students near your area.",
  };

  return (
    <Head>
      <title>{titles[pageType]}</title>

      <meta name="description" content={descriptions[pageType]} />
      <meta name="keywords" content={keywords} />

      {/* Local SEO */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Allahabad, Prayagraj" />
      <meta name="geo.position" content="25.4358;81.8463" />
      <meta name="ICBM" content="25.4358, 81.8463" />

      <link rel="canonical" href="https://yourdomain.com" />
    </Head>
  );
}

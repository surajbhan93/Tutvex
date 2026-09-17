// LocalBusinessSchema.tsx

import Head from "next/head";

interface LocalBusinessSchemaProps {
  city: string;
  cityName: string;
  location: string;
}

export default function LocalBusinessSchema({
  city,
  cityName,
  location,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://yourdomain.com/india/${city}/${location
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    name: `Tutvex – Home Tutors in ${location}, ${cityName}`,
    description: `Tutvex provides verified home and online tutors in ${location}, ${cityName} for CBSE, ICSE, state boards and competitive exams.`,
    url: `https://yourdomain.com/india/${city}/${location
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    areaServed: {
      "@type": "Place",
      name: `${location}, ${cityName}, India`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressRegion: cityName,
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    serviceOffered: {
      "@type": "Service",
      name: "Home Tuition & Online Tutoring",
      areaServed: {
        "@type": "Place",
        name: `${location}, ${cityName}`,
      },
    },
    sameAs: [
      "https://www.facebook.com/yourbrand",
      "https://www.instagram.com/yourbrand",
      "https://www.linkedin.com/company/yourbrand",
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

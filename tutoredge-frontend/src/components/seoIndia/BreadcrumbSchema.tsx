import Head from "next/head";

interface BreadcrumbProps {
  city: string;
  cityName: string;
  location: string;
  intent: string;
}

export default function BreadcrumbSchema({
  city,
  cityName,
  location,
  intent,
}: BreadcrumbProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yourdomain.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "India",
        item: "https://yourdomain.com/india",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: `https://yourdomain.com/india/${city}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: location,
        item: `https://yourdomain.com/india/${city}/${location
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: intent,
        item: `https://yourdomain.com/india/${city}/${location
          .toLowerCase()
          .replace(/\s+/g, "-")}/${intent
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}

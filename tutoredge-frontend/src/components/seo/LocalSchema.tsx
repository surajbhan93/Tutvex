import Head from "next/head";

export default function LocalSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Home Tutor Allahabad",
    areaServed: "Allahabad",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Allahabad",
      addressRegion: "UP",
      addressCountry: "IN",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
}

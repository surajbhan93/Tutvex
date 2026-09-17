// ✅ future cities (reuse)

import Head from "next/head";

export default function CitySEO({
  city,
  locations,
  subjects,
}: {
  city: string;
  locations: string[];
  subjects: string[];
}) {
  const keywords: string[] = [];

  locations.forEach((loc) => {
    subjects.forEach((sub) => {
      keywords.push(`home tutor ${sub} in ${loc} ${city}`);
      keywords.push(`private tutor ${sub} near ${loc}`);
    });
  });

  return (
    <Head>
      <title>{`Best Home Tutor in ${city}`}</title>
      <meta
        name="description"
        content={`Find verified home tutors in ${city} for all subjects and classes.`}
      />
      <meta name="keywords" content={keywords.join(", ")} />
    </Head>
  );
}

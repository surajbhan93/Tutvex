import Head from "next/head";

export default function GlobalSEO() {
  return (
    <Head>
      {/* Default Title & Description */}
      <title>
        Best Home Tutor in Allahabad | Maths, Science, CBSE, ICSE
      </title>

      <meta
        name="description"
        content="Find verified home tutors in Allahabad, Prayagraj, Jhusi, Naini and nearby areas. Maths, Science, English, CBSE & ICSE tuition available."
      />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Author / Brand */}
      <meta name="author" content="Tutvex Allahabad" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph (Social Sharing) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tutvex Allahabad" />
      <meta
        property="og:title"
        content="Best Home Tutor in Allahabad"
      />
      <meta
        property="og:description"
        content="Verified home tutors in Allahabad for all subjects and classes."
      />

      {/* Geo (Global + Local) */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Allahabad, Prayagraj" />
      <meta name="geo.position" content="25.4358;81.8463" />
      <meta name="ICBM" content="25.4358, 81.8463" />
    </Head>
  );
}

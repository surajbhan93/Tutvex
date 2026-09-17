import Head from "next/head";

interface LocalSEOHeadProps {
  location: string;
  intent: string;
  formattedLocation: string;
  formattedIntent: string;
  domain?: string;
  ogImage?: string;
}

export default function LocalSEOHead({
  location,
  intent,
  formattedLocation,
  formattedIntent,
  domain = "https://tutvex.com",
  ogImage = "https://res.cloudinary.com/dmljfhxig/image/upload/v1784880603/ChatGPT_Image_Jul_24_2026_01_39_19_PM_v6xfol.png",
}: LocalSEOHeadProps) {
  const cleanLocationSlug = location.toLowerCase().trim().replace(/\s+/g, "-");
  const cleanIntentSlug = intent.toLowerCase().trim().replace(/\s+/g, "-");
  const canonicalUrl = `${domain}/allahabad/${cleanLocationSlug}/${cleanIntentSlug}`;

  // SEO Title (55 - 60 chars optimal)
  const rawTitle = `${formattedIntent} in ${formattedLocation}, Allahabad | Verified Tutors - Tutvex`;
  const title =
    rawTitle.length > 60
      ? `${formattedIntent} in ${formattedLocation}, Allahabad | Tutvex`
      : rawTitle;

  // Meta Description (150 - 160 chars optimal)
  const rawDescription = `Hire verified ${formattedIntent.toLowerCase()} in ${formattedLocation}, Allahabad (Prayagraj). CBSE, ICSE, UP Board & JEE/NEET experts. Book a free demo class today!`;
  const description =
    rawDescription.length > 160
      ? `Hire verified ${formattedIntent.toLowerCase()} in ${formattedLocation}, Allahabad. Experienced tutors for CBSE, ICSE & entrance exams. Book free demo now!`
      : rawDescription;

  const keywords = [
    `${formattedIntent} in ${formattedLocation}`,
    `${formattedIntent} near ${formattedLocation} Allahabad`,
    `home tutor in ${formattedLocation}`,
    `private tuition ${formattedLocation} prayagraj`,
    `maths physics chemistry tutor ${formattedLocation}`,
    `best home tutor prayagraj`,
    `tutvex home tuition`,
  ].join(", ");

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Tutvex Home Learning" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Local Geo SEO Tags for Allahabad / Prayagraj */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content={`${formattedLocation}, Allahabad, Prayagraj, Uttar Pradesh, India`} />
      <meta name="geo.position" content="25.4358;81.8463" />
      <meta name="ICBM" content="25.4358, 81.8463" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${formattedIntent} in ${formattedLocation}, Allahabad`} />
      <meta property="og:site_name" content="Tutvex" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@tutvex" />
      <meta name="twitter:creator" content="@tutvex" />

      {/* Performance Preconnects for Core Web Vitals */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </Head>
  );
}

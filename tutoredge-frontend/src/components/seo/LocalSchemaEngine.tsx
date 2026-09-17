import Head from "next/head";
import { getLocalityDetail } from "@/lib/allahabad/allahabadData";
import { COMPANY_DETAILS } from "@/lib/allahabad/seo.config";

interface LocalSchemaEngineProps {
  location: string;
  intent: string;
  formattedLocation: string;
  formattedIntent: string;
  faqs: Array<{ question: string; answer: string }>;
}

export default function LocalSchemaEngine({
  location,
  intent,
  formattedLocation,
  formattedIntent,
  faqs,
}: LocalSchemaEngineProps) {
  const localityDetail = getLocalityDetail(location);
  const cleanLocationSlug = location.toLowerCase().trim().replace(/\s+/g, "-");
  const cleanIntentSlug = intent.toLowerCase().trim().replace(/\s+/g, "-");
  const pageUrl = `https://tutvex.com/allahabad/${cleanLocationSlug}/${cleanIntentSlug}`;

  // 1. LocalBusiness / EducationalOrganization Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${pageUrl}#organization`,
    name: `Tutvex Home Tutors - ${formattedLocation}, Allahabad`,
    url: pageUrl,
    logo: "https://tutvex.com/logo.png",
    image: "https://res.cloudinary.com/dmljfhxig/image/upload/v1784880603/ChatGPT_Image_Jul_24_2026_01_39_19_PM_v6xfol.png",
    telephone: COMPANY_DETAILS.phone,
    email: COMPANY_DETAILS.email,
    priceRange: "₹300 - ₹800 per hour",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${formattedLocation}, Near ${localityDetail.nearbyLandmarks[0] || "Main Market"}`,
      addressLocality: "Allahabad",
      addressRegion: "UP",
      postalCode: localityDetail.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: localityDetail.geo.latitude,
      longitude: localityDetail.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: COMPANY_DETAILS.ratingValue,
      reviewCount: COMPANY_DETAILS.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    hasMap: COMPANY_DETAILS.gbpLink,
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: `${formattedLocation}, Allahabad`,
      },
      {
        "@type": "City",
        name: "Allahabad (Prayagraj)",
      },
    ],
  };

  // 2. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_DETAILS.name,
    legalName: COMPANY_DETAILS.legalName,
    url: "https://tutvex.com",
    logo: "https://tutvex.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_DETAILS.phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      COMPANY_DETAILS.gbpLink,
      "https://facebook.com/tutvex",
      "https://instagram.com/tutvex",
    ],
  };

  // 3. Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${formattedIntent} in ${formattedLocation}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "Tutvex Home Learning",
    },
    areaServed: {
      "@type": "City",
      name: `${formattedLocation}, Allahabad`,
    },
    description: `Verified 1-on-1 ${formattedIntent.toLowerCase()} services in ${formattedLocation}, Allahabad for CBSE, ICSE, UP Board, and competitive exams.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "300",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
    },
  };

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://tutvex.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Allahabad Tutors",
        item: "https://tutvex.com/allahabad",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: formattedLocation,
        item: `https://tutvex.com/allahabad/${cleanLocationSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: formattedIntent,
        item: pageUrl,
      },
    ],
  };

  // 5. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // 6. WebPage Schema with SearchAction
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: `${formattedIntent} in ${formattedLocation}, Allahabad`,
    description: `Book background-verified home tutors in ${formattedLocation}, Allahabad. Free trial class available.`,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tutvex.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // 7. Review & AggregateRating Schema
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${formattedIntent} in ${formattedLocation}`,
    description: `Personalized 1-on-1 tuition service in ${formattedLocation}, Allahabad`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Anand Verma" },
        datePublished: "2026-02-14",
        reviewBody: `Found an excellent Maths home tutor in ${formattedLocation} through Tutvex. My son's performance improved significantly within 2 months!`,
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Pooja Mishra" },
        datePublished: "2026-04-10",
        reviewBody: `Tutvex provides highly punctual and verified tutors near ${formattedLocation}, Prayagraj. Super happy with their local support!`,
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "5",
          worstRating: "1",
        },
      },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
    </Head>
  );
}

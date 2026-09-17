import React from "react";
import { city } from "@/components/seoIndia/locations/up/agra";

export const Schema: React.FC = () => {
  const baseUrl = "https://tutvex.com";
  const pageUrl = `${baseUrl}/india/${city.slug}`;

  // 1. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Tutvex",
    description: "India's Premier Verified Home Tutor & Private Tuition Platform",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // 2. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Tutvex Learning Systems India Pvt. Ltd.",
    alternateName: ["Tutvex Home Tutors", "Tutvex Agra"],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/tutvex-logo.jpg`,
      caption: "Tutvex Home Tutor Network Logo",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: city.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    sameAs: [
      "https://facebook.com/tutvex",
      "https://twitter.com/tutvex",
      "https://instagram.com/tutvex",
      "https://linkedin.com/company/tutvex",
    ],
  };

  // 3. LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${pageUrl}/#localbusiness`,
    name: `Tutvex Home Tutors ${city.name}`,
    image: `${baseUrl}/images/agra-home-tutors.jpg`,
    url: pageUrl,
    telephone: city.contact.phone,
    email: city.contact.email,
    priceRange: "₹2,500 - ₹15,000 per month",
    address: {
      "@type": "PostalAddress",
      streetAddress: city.contact.address,
      addressLocality: city.name,
      addressRegion: city.state,
      postalCode: "282005",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.geo.latitude,
      longitude: city.geo.longitude,
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
        opens: "08:00",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: city.averageRating.toString(),
      reviewCount: city.totalReviews.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  };

  // 4. EducationalOrganization Schema
  const educationalOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${pageUrl}/#educational-organization`,
    name: `Tutvex Educational Institute ${city.name}`,
    description: `Leading provider of 1-on-1 home tutors, CBSE, ICSE, UP Board coaching, JEE & NEET preparation in ${city.name}.`,
    url: pageUrl,
    telephone: city.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: "IN",
    },
  };

  // 5. TutorService / Service Schema
  const tutorServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}/#tutorservice`,
    name: `Home Tutor Service in ${city.name}`,
    serviceType: "Private Home Tuition & Personal Mentorship",
    provider: {
      "@type": "LocalBusiness",
      name: `Tutvex ${city.name}`,
    },
    areaServed: city.locations.map((loc) => {
      const name = typeof loc === "string" ? loc : (loc as any).name;
      return {
        "@type": "AdministrativeArea",
        name: `${name}, ${city.name}, ${city.state}`,
      };
    }),
    description: `Personalized 1-on-1 home tuition in ${city.name} for Class 1 to 12 (CBSE, ICSE, UP Board), Math, Science, Physics, Chemistry, Biology, Commerce, JEE & NEET.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "300",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Home Tuition Services in ${city.name}`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Primary & Middle School Home Tuition in ${city.name}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Class 9 & 10 Board Exam Home Tutor in ${city.name}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Class 11 & 12 PCM / PCB Home Tutor in ${city.name}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `JEE Main & NEET Medical Entrance Home Tutor in ${city.name}`,
          },
        },
      ],
    },
  };

  // 6. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "India Home Tutors",
        item: `${baseUrl}/india`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Home Tutor in ${city.name}`,
        item: pageUrl,
      },
    ],
  };

  // 7. FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I find the best home tutor in ${city.name} through Tutvex?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can request a verified home tutor in ${city.name} by submitting your class, subject, and locality requirements on the Tutvex portal or calling direct support. We match your child with an expert nearby tutor within 2 hours and arrange a free 1-on-1 demo session at your residence.`,
        },
      },
      {
        "@type": "Question",
        name: `Are all home tutors in ${city.name} background verified by Tutvex?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, 100% of home tutors listed on Tutvex in ${city.name} undergo rigorous 7-step verification including Aadhaar government identity checks, academic qualification verification, permanent address checks, and teaching aptitude assessments before taking any tuition assignment.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the average monthly cost of home tuition in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Home tuition fees in ${city.name} depend on the student's grade level and subjects. Classes 1 to 5 range from ₹2,500 to ₹4,000 per month; Classes 6 to 8 range from ₹3,500 to ₹5,500 per month; Classes 9 & 10 range from ₹5,000 to ₹8,000 per month; while Class 11-12 & JEE/NEET tutors range from ₹7,000 to ₹15,000 per month.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I request a qualified female home tutor in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, Tutvex maintains an extensive network of experienced female home tutors across all key localities in ${city.name} including Kamla Nagar, Dayalbagh, Sadar Bazaar, Civil Lines, and Shahganj for all subjects from primary to senior secondary classes.`,
        },
      },
      {
        "@type": "Question",
        name: `What if we are not satisfied with the tutor after the demo class?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The demo class is 100% free with no upfront payment or obligation. If you are not completely satisfied with the teaching methodology during the demo session, Tutvex will immediately assign an alternative expert tutor tailored to your specific preferences at no extra cost.`,
        },
      },
    ],
  };

  // 8. AggregateRating & Reviews Schema
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Tutvex Home Tuition Service ${city.name}`,
    description: `Verified home tutor network across ${city.name} for school subjects, boards, and entrance exams.`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: city.averageRating.toString(),
      reviewCount: city.totalReviews.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Sanjay Agrawal",
        },
        datePublished: "2026-03-12",
        reviewBody: `Found an exceptional Class 10 Math & Science home tutor in Kamla Nagar, ${city.name}. My daughter scored 95% in her CBSE board exams thanks to Tutvex!`,
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Dr. Anshu Gupta",
        },
        datePublished: "2026-05-18",
        reviewBody: `We hired a female home tutor for Class 12 Physics and Chemistry in Dayalbagh, ${city.name}. Very punctual, background verified, and extremely skilled teacher!`,
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    ],
  };

  // 9. Speakable Schema
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Home Tutor in ${city.name} - Tutvex`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable-intro", ".speakable-faq-answer", ".hero-title"],
    },
    url: pageUrl,
  };

  const allSchemas = [
    websiteSchema,
    organizationSchema,
    localBusinessSchema,
    educationalOrganizationSchema,
    tutorServiceSchema,
    breadcrumbSchema,
    faqSchema,
    reviewSchema,
    speakableSchema,
  ];

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`jsonld-schema-agra-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default Schema;

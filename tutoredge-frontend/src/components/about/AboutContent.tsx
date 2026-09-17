// ← switch logic

import AboutSection from "./AboutSection";
import TeamSection from "./TeamSection";
import TestimonialSection from "./TestimonialSection";
import CareerSection from "./CareerSection";

// legal pages
import PrivacyPolicy from "./privacy";
import RefundPolicy from "./refund";
import TermsConditions from "./terms";
import SitemapPage from "./sitemap";

interface Props {
  active: string;
}

export default function AboutContent({ active }: Props) {
  switch (active) {
    case "team":
      return <TeamSection />;

    case "testimonials":
      return <TestimonialSection />;

    case "careers":
      return <CareerSection />;

    // 🔐 LEGAL PAGES
    case "privacy":
    case "privacy-policy":
      return <PrivacyPolicy />;

    case "refund":
    case "refund-cancellation":
      return <RefundPolicy />;

    case "terms":
    case "terms-conditions":
      return <TermsConditions />;

    case "sitemap":
      return <SitemapPage />;

    // DEFAULT ABOUT
    default:
      return <AboutSection />;
  }
}

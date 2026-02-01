import CourseHighlights from '@/components/landing/CourseHighlights';
import CoursesForKids from '@/components/landing/CoursesForKids';
import FeaturedTutors from '@/components/landing/FeaturedTutors';
import Footer from '@/components/landing/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import OurImpact from '@/components/landing/OurImpact';
import OurOfferings from '@/components/landing/OurOfferings';
import TutorCTA from '@/components/landing/TutorCTA';
import NavBar from '@/components/navbar/NavBar';
import AllahabadSEO from '@/components/seo/AllahabadSEO';
import LocalSchema from '@/components/seo/LocalSchema';
// import Reveal from '@/components/ui/Reveal';
const heroData = {
  title:
    'Learn from expert tutors – personalized for every student with Tutvex',
  subtitle: 'Trusted by 5000+ parents last year.',
  ctaText: 'About Tutvex',
  ctaLink: {
    pathname: '/',
    query: {
      source: 'HERO_CTA',
      fromPage: '/',
      campaign: 'FIND_TUTORS',
      medium: 'website',
    },
  },
  imageUrl: '/images/heroImage.png',
};

const LandingPage = () => {
  return (
    <>
      {/* 🔥 SEO */}
      <AllahabadSEO pageType="home" />
      <LocalSchema />

      <NavBar />

      {/* ======================
          GLOBAL GRADIENT WRAPPER
      ====================== */}
      <main
        className="
          relative overflow-hidden
          bg-[radial-gradient(circle_at_top_left,#6366f140,transparent_45%),radial-gradient(circle_at_top_right,#22d3ee40,transparent_45%),radial-gradient(circle_at_bottom_left,#a855f740,transparent_45%),linear-gradient(to_br,#f8fafc,#eef2ff,#fdf4ff)]
        "
      >
        {/* SOFT COLOR BLOBS */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-cyan-400/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-fuchsia-400/30 rounded-full blur-[120px] -z-10" />

        {/* ======================
            HERO (already strong)
        ====================== */}
        <HeroSection
          title={heroData.title}
          subtitle={heroData.subtitle}
          ctaText={heroData.ctaText}
          imageUrl={heroData.imageUrl}
        />

        {/* ======================
            SECTIONS WITH DEPTH
        ====================== */}

        <SectionWrapper>
          <CourseHighlights />
        </SectionWrapper>

        <SectionWrapper variant="light">
          <OurOfferings />
        </SectionWrapper>

        <SectionWrapper>
          <CoursesForKids />
        </SectionWrapper>

        <SectionWrapper variant="glass">
          <FeaturedTutors />
        </SectionWrapper>

        <SectionWrapper>
          <HowItWorks />
        </SectionWrapper>

        <SectionWrapper variant="gradient">
          <TutorCTA />
        </SectionWrapper>

        <SectionWrapper>
          <OurImpact />
        </SectionWrapper>

        {/* 🔥 SEO AUTHORITY (HIDDEN) */}
        <section style={{ display: 'none' }}>
          <h1>Best Home Tutors in Allahabad</h1>
          <p>
            Tutvex provides verified home tutors in Allahabad, Prayagraj,
            Jhusi, Naini, Civil Lines, Katra, Rajapur and nearby areas.
          </p>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default LandingPage;

/* ======================
   SECTION WRAPPER
====================== */

const SectionWrapper = ({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'light' | 'glass' | 'gradient';
}) => {
  const variants = {
    default: 'py-20',
    light: 'py-20 bg-white/60 backdrop-blur-xl',
    glass:
      'py-20 bg-white/40 backdrop-blur-xl border-y border-white/30',
    gradient:
      'py-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white',
  };

  return (
    <section className={variants[variant]}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
};

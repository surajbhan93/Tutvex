import Head from "next/head";
import dynamic from "next/dynamic";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import FilterSidebar from "@/components/filters/FilterSidebar";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import SubjectsGrid from "@/components/subjects/SubjectsGrid";
import { GraduationCap, ShieldCheck } from "lucide-react"
/* ======================
   LAZY LOAD SEO CONTENT
====================== */
const SubjectsContent = dynamic(
  () => import("@/components/seo/SubjectsContent"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-16 text-center text-gray-500">
        Loading detailed information...
      </div>
    ),
  }
);

export default function SubjectsPage() {
  return (
    <>
    <NavBar />
      {/* ======================
          SEO HEAD
      ====================== */}
      <Head>
        <title>
          School Subject Tutors | CBSE, ICSE & State Board | Tutvex
        </title>

        <meta
          name="description"
          content="Find expert Maths, Science, Commerce & Language tutors for CBSE, ICSE and State Board students. English medium, verified tutors available on Tutvex."
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://www.Tutvex.com/subjects"
        />

        {/* Open Graph */}
        <meta property="og:title" content="School Subject Tutors | Tutvex" />
        <meta
          property="og:description"
          content="Verified subject-wise tutors for CBSE, ICSE & State Board students."
        />
        <meta property="og:type" content="website" />

        {/* Breadcrumb schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.Tutvex.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Subjects",
                  item: "https://www.Tutvex.com/subjects",
                },
              ],
            }),
          }}
        />
      </Head>

      {/* ======================
          PAGE CONTENT
      ====================== */}
      <div className="
  relative
  min-h-screen
  bg-gradient-to-b
  from-gray-10
  via-indigo-50/40
  to-black
">
      <div className="max-w-7xl mx-auto px-1 py-1">

        {/* ======================
            HERO / INTRO
        ====================== */}
      <header
  className="
    relative
    mb-12
    rounded-3xl
    bg-gradient-to-b from-indigo-50 via-white to-white
    px-6 py-10
    text-center
  "
>
  {/* Badge */}
  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
    <ShieldCheck size={16} />
    Verified Tutors Platform
  </div>

  {/* Title */}
  <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
    School Subject Tutors
  </h1>

  {/* Subtitle */}
  <p className="mt-4 mx-auto max-w-2xl text-gray-600 text-base md:text-lg">
    Find expert subject-wise tutors for
    <span className="font-semibold text-gray-800">
      {" "}CBSE, ICSE & State Board
    </span>{" "}
    students. All tutors teach in
    <span className="font-semibold text-gray-800">
      {" "}English medium
    </span>{" "}
    and are background verified.
  </p>

  {/* Highlights */}
  <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-700">
    <span className="flex items-center gap-2">
      <GraduationCap size={18} className="text-indigo-600" />
      Board-Expert Tutors
    </span>
    <span className="flex items-center gap-2">
      <ShieldCheck size={18} className="text-indigo-600" />
      Background Verified
    </span>
  </div>
</header>

        {/* ======================
            MOBILE FILTER
        ====================== */}
        <MobileFilterDrawer />

        {/* ======================
            MAIN LAYOUT
        ====================== */}
        <div className="flex gap-8">

          {/* Sidebar */}
          <FilterSidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <SubjectsGrid />
          </main>
        </div>

        {/* ======================
            SEO CONTENT (LAZY)
        ====================== */}
        <SubjectsContent />
      </div>
      </div>
      <Footer />
    </>
  );
}

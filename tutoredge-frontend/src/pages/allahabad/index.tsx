import Link from "next/link";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";

import { ALLAHABAD_LOCATIONS } from "@/components/seo/seo.config";

export default function AllahabadLandingPage() {
  return (
    <>
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">
          Home Tutors in Allahabad (Prayagraj)
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          Find verified home tutors across all areas of Allahabad for CBSE,
          ICSE, UP Board and competitive exams.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">
          Popular Areas in Allahabad
        </h2>

        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ALLAHABAD_LOCATIONS.slice(0, 12).map((area) => (
            <Link
              key={area}
              href={`/allahabad/${area.toLowerCase().replace(/\s+/g, "-")}/home-tutor`}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md"
            >
              Home Tutor in {area}
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

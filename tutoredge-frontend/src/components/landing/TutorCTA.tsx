import Image from "next/image";
import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

// --- Data ---
const bigImage = {
  src: "/images/tutors/collage-main.jpg",
};

const smallImages = [
  { src: "/images/tutors/collage-1.jpg", className: "h-24 w-24 top-0 left-40 z-0" },
  { src: "/images/tutors/collage-2.jpg", className: "h-20 w-20 top-1/2 left-10 z-0" },
  { src: "/images/tutors/collage-3.jpg", className: "h-28 w-28 bottom-2 left-1/4 z-20" },
  { src: "/images/tutors/collage-4.jpg", className: "h-20 w-20 top-10 right-24 z-20" },
  { src: "/images/tutors/collage-5.jpg", className: "h-24 w-24 top-1/2 right-2 z-20" },
  { src: "/images/tutors/collage-6.jpg", className: "h-16 w-16 bottom-5 right-1/4 z-20" },
];

// --- Component ---
const TutorCTA = () => {
  return (
    <div className="mx-auto max-w-6xl p-6 py-16">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col items-start gap-6">
          <h2 className="text-4xl font-bold text-gray-800">
            Looking to <span className="text-primary">Teach?</span>
          </h2>

          <p className="max-w-md text-lg text-gray-600">
            Join Tutvex and connect with hundreds of students in your area.
            Share your knowledge, grow your teaching career, and earn from the
            comfort of your home.
          </p>

          {/* 🔥 CTA LINK */}
        <Link
  href={{
    pathname: "/tutor-flow/tutor-registration/",
    query: {
      role: "tutor",
      source: "HOME_TUTOR_CTA",
      fromPage: "/",
      campaign: "BECOME_TUTOR",
      medium: "website",
    },
  }}
  className="inline-flex w-fit"
>
  <Button className="mt-2 px-8 py-3 text-base">
    Signup as a Tutor
  </Button>
</Link>

        </div>

        {/* Right Column: Image Collage */}
        <div className="relative flex min-h-[350px] w-full items-center justify-center">
          {/* Big Image */}
          <div className="relative z-10 size-48 overflow-hidden rounded-full border-4 border-white shadow-lg md:size-56">
            <Image
              src={bigImage.src}
              alt="Main tutor profile"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Small Images */}
          {smallImages.map((image, index) => (
            <div
              key={index}
              className={`absolute overflow-hidden rounded-full border-4 border-white shadow-lg ${image.className}`}
            >
              <Image
                src={image.src}
                alt={`Tutor profile picture ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorCTA;

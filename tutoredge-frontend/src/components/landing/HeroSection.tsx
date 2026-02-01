import { CreditCard, ShieldCheck, UserCircle, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

const trustBadges = [
  {
    icon: ShieldCheck,
    text: "Verified Tutors",
    colors: "bg-blue-50 text-blue-800 border-blue-200",
  },
  {
    icon: CreditCard,
    text: "Safe Payments",
    colors: "bg-green-50 text-green-800 border-green-200",
  },
  {
    icon: Users,
    text: "1-on-1 Learning",
    colors: "bg-yellow-50 text-yellow-800 border-yellow-200",
  },
  {
    icon: UserCircle,
    text: "Interviewed & Approved",
    colors: "bg-purple-50 text-purple-800 border-purple-200",
  },
];

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  imageUrl,
}) => {
  return (
    <section className="mx-auto max-w-6xl p-6 py-10">
      {/* Hero Content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Text */}
        <div className="relative z-20 flex flex-col justify-center gap-8 lg:w-2/5">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-4xl font-bold leading-tight tracking-[-0.033em] text-[#111518] sm:text-5xl">
              {title}
            </h1>
            <h2 className="mt-4 text-base font-normal leading-normal text-gray-600">
              {subtitle}
            </h2>
          </div>

          {/* 🔥 FIXED CTA LINK */}
          <Link
            href={{
              pathname: "/https://www.youtube.com/watch?v=TlIX427wKDg",
              query: {
                source: "HERO_CTA",
                fromPage: "/",
                campaign: "EXPLORE_TUTORS",
                medium: "website",
              },
            }}
            className="inline-flex w-fit"
          >
            <Button className="w-full lg:w-auto lg:px-8">
              {ctaText}
            </Button>
          </Link>
        </div>

        {/* Image */}
        <div className="relative aspect-video min-h-[250px] w-full overflow-hidden rounded-xl lg:w-3/5">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-xl pointer-events-none"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-16">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-transform hover:scale-105 ${badge.colors}`}
              >
                <Icon className="size-6 shrink-0" />
                <p className="text-base font-bold leading-tight">
                  {badge.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

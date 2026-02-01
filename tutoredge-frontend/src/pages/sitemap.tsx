"use client";

import React from "react";
import Link from "next/link";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";

import {
  FaBook,
  FaUserGraduate,
  FaFileAlt,
  FaClipboardList,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import { Card, Badge } from "flowbite-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ======================
   DATA
====================== */

const runningCities = [
  "Meerut",
  "Lucknow",
  "Prayagraj",
  "Varanasi",
  "Kanpur",
  "Noida",
  "Agra",
];

const upcomingCities = [
  "Delhi",
  "Gurugram",
  "Faridabad",
  "Jaipur",
  "Jodhpur",
  "Udaipur",
  "Kota",
];

const serviceTypes = [
  "Home Tutors",
  "Maths Tutors",
  "Science Tutors",
  "English Tutors",
  "Female Tutors",
  "Private Tutors",
];

const generateSlug = (service: string, city: string) =>
  `${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-in-${city.toLowerCase()}`;

const serviceLinks = serviceTypes.flatMap((service) =>
  runningCities.map((city) => ({
    name: `${service} in ${city}`,
    href: `/services/${generateSlug(service, city)}`,
  }))
);

const chartData = [
  { name: "Running Cities", count: runningCities.length },
  { name: "Upcoming Cities", count: upcomingCities.length },
];

const companyLinks = [
  { name: "About Us", href: "/about", icon: <FaUserGraduate /> },
  { name: "Contact Us", href: "/contact", icon: <FaEnvelope /> },
  { name: "Privacy Policy", href: "/privacy-policy", icon: <FaFileAlt /> },
  { name: "Refund Policy", href: "/refund-policy", icon: <FaClipboardList /> },
  { name: "Terms & Conditions", href: "/terms-and-conditions", icon: <FaFileAlt /> },
];

/* ======================
   PAGE
====================== */

export default function SitemapPage() {
  return (
    <>
      <NavBar />

      {/* HERO */}
      <section className="
        -mt-[72px]
        pt-[160px]
        pb-28
        text-center
        text-white
        bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700
      ">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Tutvex Sitemap
        </h1>
        <p className="mt-6 text-lg text-indigo-100 max-w-3xl mx-auto">
          Discover all services, cities, and important pages in one place.
        </p>
      </section>

      {/* CONTENT */}
      <main className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">

          {/* SERVICES */}
          <Card>
            <SectionTitle icon={<FaBook />} title="Our Services" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 hover:underline"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </Card>

          {/* CITIES */}
          <Card>
            <SectionTitle icon={<FaMapMarkerAlt />} title="Cities We Serve" />

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-semibold text-indigo-600 mb-3">
                  Currently Running
                </h3>
                <div className="flex flex-wrap gap-2">
                  {runningCities.map((city) => (
                    <Badge key={city} color="success">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-violet-600 mb-3">
                  Expanding Soon
                </h3>
                <div className="flex flex-wrap gap-2">
                  {upcomingCities.map((city) => (
                    <Badge key={city} color="purple">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* CHART */}
          <Card>
            <SectionTitle icon={<FaGlobe />} title="City Expansion Overview" />
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* COMPANY */}
          <Card>
            <SectionTitle icon={<FaUserGraduate />} title="Company Pages" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 hover:text-indigo-600"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </Card>

          {/* CONTACT */}
          <Card>
            <SectionTitle icon={<FaEnvelope />} title="Contact & Support" />
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <FaPhone /> +91-XXXXXXXXXX
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope /> support@Tutvex.com
              </p>
            </div>
          </Card>

        </div>
      </main>

      <Footer />
    </>
  );
}

/* ======================
   HELPERS
====================== */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
      {icon} {title}
    </h2>
  );
}

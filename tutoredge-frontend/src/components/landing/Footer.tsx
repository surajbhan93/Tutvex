// src/components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaHome,
  FaBook,
  FaUserGraduate,
  FaFileAlt,
  FaClipboardList,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

const serviceTypes = [
  'Home Tutors',
  'Maths & Science Tutors',
  'Maths tutors',
  'Female tutor',
  'Best tuition bureau',
  'Private tutor',
  'English tutor',
  'Chemistry tutor',
  'Science tutors',
  'Best teacher',
  'Science & maths tutor',
  'Tuition bureau',
  'Female tutors',
  'CBSE & ICSE Tutors',
  'Best home tutor near me',
  'Home tuition for class 9 & class 10',
];

const cities = ['Varanasi', 'Prayagraj', 'Lucknow'];

const generateSlug = (service: string, city: string): string =>
  `${service.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}-in-${city.toLowerCase()}`;

const serviceLinks = serviceTypes.flatMap((service) =>
  cities.map((city) => ({
    name: `${service} in ${city}`,
    href: `/services/${generateSlug(service, city)}`,
  }))
);

const linksPerColumn = Math.ceil(serviceLinks.length / 3);
const serviceColumns = [
  serviceLinks.slice(0, linksPerColumn),
  serviceLinks.slice(linksPerColumn, linksPerColumn * 2),
  serviceLinks.slice(linksPerColumn * 2),
];

const companyLinks = [
  { name: 'About Us', href: '/about', icon: <FaUserGraduate /> },
  { name: 'Contact Us', href: '/contact', icon: <FaHome /> },
  { name: 'Privacy Policy', href: '/privacy-policy', icon: <FaFileAlt /> },
  { name: 'Refund & Cancellation', href: '/refund-policy', icon: <FaClipboardList /> },
  { name: 'Terms & Conditions', href: '/terms-and-conditions', icon: <FaFileAlt /> },
  { name: 'Sitemap', href: '/sitemap', icon: <FaClipboardList /> },
];

const socialLinks = [
  { icon: <FaFacebookF />, href: 'https://facebook.com' },
  { icon: <FaInstagram />, href: 'https://www.instagram.com/tutvexofficial/' },
  { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/company/mentorsetu/?viewAsMember=true' },
  { icon: <FaYoutube />, href: 'https://www.youtube.com/@Tutvex' },
  { icon: <FaTwitter />, href: 'https://x.com/tutvexofficial' },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo, Tagline, Social, Contact, Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image src="/images/logo.png" alt="Tutvex Logo" width={160} height={40} />
            </Link>
            <p className="mt-4 text-sm text-gray-400">Your partner in personalized learning.</p>

            {/* Social Icons */}
            <div className="mt-6 flex space-x-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-800 p-2 text-white hover:bg-indigo-600 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-gray-400 text-sm">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-500" /> 123, Tutvex Street, Varanasi
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-500" /> support@Tutvex.com
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-indigo-500" /> +91-XXXXXXXXXX
              </p>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Newsletter
              </h3>
              <p className="mt-2 text-xs text-gray-400">
                Subscribe to get updates on tutors and offers.
              </p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-l-md border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button className="rounded-r-md bg-indigo-600 px-4 text-sm font-medium hover:bg-indigo-500 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Company Links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h3>
              <ul className="mt-2 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name} className="flex items-center gap-2">
                    <span className="text-indigo-500">{link.icon}</span>
                    <Link
                      href={link.href}
                       className={`inline-block px-3 py-1 rounded-md font-semibold transition-colors ${
    link.name === 'Sitemap'
      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
      : 'text-gray-300 hover:text-indigo-500 hover:underline'
  }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columns 2-4: Services */}
          {serviceColumns.map((links, idx) => (
            <div key={idx}>
              <h3
                className={`text-sm font-semibold uppercase tracking-wider text-gray-400 ${
                  idx > 0 ? 'invisible sm:invisible lg:invisible' : ''
                }`}
              >
                Services
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name} className="flex items-center space-x-2">
                    <FaBook className="text-indigo-500" />
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-indigo-500 hover:underline transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download + Trust Badges */}
        <div className="mt-12 flex flex-col md:flex-row md:justify-between items-center gap-6 border-t border-gray-700 pt-6">
          {/* App download */}
          <div className="flex gap-4">
            <a href="#" className="inline-block">
              <Image src="/images/playstore.png" alt="Google Play" width={140} height={40} />
            </a>
            <a href="#" className="inline-block">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg"
                alt="App Store"
                width={140}
                height={40}
              />
            </a>
          </div>

          {/* Trust badges / payments */}
          <div className="flex gap-4">
            <Image src="https://logo.svgcdn.com/logos/visa.svg" alt="Visa" width={50} height={30} />
            <Image
              src="https://logo.svgcdn.com/logos/mastercard.svg"
              alt="MasterCard"
              width={50}
              height={30}
            />
            <Image
              src="https://logo.svgcdn.com/simple-icons/razorpay-dark.svg"
              alt="Razorpay"
              width={70}
              height={30}
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 bg-slate-900 p-6">
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Tutvex. All rights reserved. Made with ❤️ by Tutvex
          Team.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

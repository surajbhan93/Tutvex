import Link from 'next/link'; // Ensure Link is imported
import { useRouter } from 'next/router';
import React from 'react';

import Footer from '../../components/landing/Footer'; // Adjust path if needed
import NavBar from '../../components/navbar/NavBar'; // Adjust path if needed

// --- Data for Sub-Areas (Keep this updated or fetch from backend) ---
const subAreasByCity: Record<string, string[]> = {
  varanasi: [
    'Lanka',
    'Sigra',
    'Shivpur',
    'Sunderpur',
    'DLW',
    'Mahmorganj',
    'Laharata',
  ],
  prayagraj: [
    'Civil Lines',
    'Ashok Nagar',
    'Darbhanga',
    'Georgetown',
    'Tagore Town',
    'Rambagh',
    'Chauk',
    'Baluaghat',
    'Meerapur',
    'Sohbatiyabagh',
    'Allapur',
    'Bairhna',
    'Alopibagh',
    'Jhusi',
    'Shantipuram',
    'Lukergunj',
    'Sulem sarai',
    'Bamraul',
    'Jhalwa',
    'Transport nagar',
    'Beniganj',
    'Chauftka',
    'Chakiya',
    'Karelabagh',
    'Kalindipuran',
    'Kareli',
    'Agnipath Colony',
    'PWD colony',
    'Professor colony',
    'Mahatma Gandhi Marg',
    'Sardar Patel Marg',
    'Patrika Marg',
  ],
  lucknow: [
    'Gomti Nagar',
    'Hazratganj',
    'Indira Nagar',
    'Aliganj',
    'Mahanagar',
    'Amar Shaheed Path',
    'Vibhuti Khand',
    'Jankipuram',
    'Rajajipuram',
    'Sushant Golf City',
    'Faizabad Road',
    'Shaheed Path',
    'Jopling Road',
    'Civil Lines',
    'New Hyderabad',
    'Aashiana',
    'Alambagh',
    'Charbagh',
    'Chinhat',
    'Daliganj',
    'Kursi Road',
    'Nirala Nagar',
    'Vrindavan Yojana',
    'LDA Colony',
    'Jal Vayu Vihar',
    'Vikas Nagar',
    'Sahara States',
  ],
};

// --- Helper Functions ---
// Updated parseSlug to handle potential undefined or string array
const parseSlug = (
  slug: string | string[] | undefined,
): { service: string; city: string } | null => {
  if (typeof slug !== 'string') {
    // Ensure slug is a single string
    return null;
  }
  const parts = slug.split('-in-');
  const part0 = parts[0];
  const part1 = parts[1];
  if (parts.length !== 2 || !part0 || !part1) {
    return null;
  }
  const service = part0.replace(/-/g, ' ');
  const city = part1;

  return { service, city };
};

const generateTitle = (service: string, city: string): string => {
  const capitalize = (str: string) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  return `${capitalize(service)} in ${capitalize(city)}`;
};

// Basic content template - consider fetching unique content later
const generateContent = (service: string, city: string): string => {
  const capitalizedService = service
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
  return `
    Studies have become challenging for students without proper assistance. If you are seeking ${capitalizedService} in ${capitalizedCity} to make studies easy and enjoyable, then Tutvex home tutors is your destination. We take responsibility to fulfill your needs by providing professional home tutors who make learning easy through personalized guidance.
    <br/><br/>
    We understand you might be hesitant to trust an online tutor. We have built a platform allowing you to connect with home tutors, chat, meet, and even schedule demo classes. These features help build trust between you and your ${capitalizedService} in ${capitalizedCity}.
    <br/><br/>
    We have many skilled home tutors proficient in their subjects. All registered tutors are verified and have mastery in their field. Whatever your requirement, feel free to connect with us to hire one of the best home tutors without sacrificing comfort and convenience. Stop thinking and take a step towards success by registering with us.
  `;
};

// --- The Dynamic Page Component ---
const ServicePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Parse the slug safely
  const parsed = parseSlug(slug);

  // Handle loading state or invalid slug
  if (!parsed) {
    return (
      <>
        <NavBar />
        <div className="mx-auto max-w-4xl p-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
          <p className="mt-4 text-gray-600">
            If this persists, the requested service may not exist.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Go back home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // If parsed is valid, proceed with rendering
  const { service, city } = parsed;
  const title = generateTitle(service, city);
  const content = generateContent(service, city);
  const subAreas = subAreasByCity[city.toLowerCase()] || [];
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6 py-16">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">{title}</h1>
        {/* Use dangerouslySetInnerHTML for the basic HTML content */}
        <div
          className="prose max-w-none text-gray-700" // Tailwind 'prose' provides basic styling
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Display sub-areas if they exist for the city */}
        {subAreas.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Find Tutors in Specific Areas of {capitalizedCity}:
            </h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-blue-600 md:grid-cols-3">
              {subAreas.map((area) => (
                <li key={area}>
                  {/* Link these to a search page pre-filtered by area */}
                  <Link
                    href={`/search?city=${city}&area=${area}`}
                    className="hover:underline"
                  >
                    Best home tutors at {area}, {capitalizedCity}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ServicePage;

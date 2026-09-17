import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import OnboardingStepper from '@/pages/find-tutor-flow/OnboardingStepper';

import TutorPremiumCard from './TutorPremiumCard';
import apiClient from '../../lib/apiauth';

/* ---------------- TYPES ---------------- */
interface ApiTutor {
  _id: string;
  fullName: string;
  email: string;
  subjects: string[];
  yearsOfExperience: number;
  price: number;
  rating: number;
  testimonial: string;
}

/* ---------------- MOTION VARIANTS ---------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const TutorMatches: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const [allTutors, setAllTutors] = useState<ApiTutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    subject: '',
    experience: '',
    price: 12000,
  });

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.replace('/create-account');
  }, [router]);

  /* ---------------- FETCH TUTORS ---------------- */
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/auth/parent/tutors');
        setAllTutors(res.data || []);
      } catch {
        setError('Failed to fetch tutors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutors();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  const normalizeSubject = (value: string) =>
    value.toLowerCase().trim().replace(/s$/, '');

  const filteredTutors = useMemo(() => {
    let tutors = [...allTutors];

    const subjectPref =
      (filters.subject || query.subject) as string;

    if (subjectPref) {
      const normalized = normalizeSubject(subjectPref);
      tutors = tutors.filter((t) =>
        t.subjects.map(normalizeSubject).includes(normalized)
      );
    }

    if (filters.experience) {
      tutors = tutors.filter((t) => {
        const exp = t.yearsOfExperience;
        if (filters.experience === '0-1') return exp <= 1;
        if (filters.experience === '2-5') return exp >= 2 && exp <= 5;
        if (filters.experience === '5+') return exp >= 5;
        return true;
      });
    }

    return tutors.filter((t) => t.price <= filters.price);
  }, [allTutors, filters, query.subject]);

  /* ---------------- UI ---------------- */
  return (
    <>
      <NavBar />

      <main
        className="
          min-h-screen
          bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
          from-indigo-100 via-white to-cyan-100
          py-12 px-4
        "
      >
        <div className="max-w-7xl mx-auto">
          <OnboardingStepper currentStep={3} />

          {/* HEADER */}
          <div className="mt-12 mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Your Best Tutor Matches ✨
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Premium tutors selected just for your learning goals
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold block mb-1">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) =>
                  setFilters({ ...filters, subject: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              >
                <option value="">All Subjects</option>

{/* Core School Subjects */}
<option value="Maths">Maths</option>
<option value="Physics">Physics</option>
<option value="Chemistry">Chemistry</option>
<option value="Biology">Biology</option>
<option value="English">English</option>
<option value="Hindi">Hindi</option>
<option value="Social Science">Social Science</option>
<option value="History">History</option>
<option value="Geography">Geography</option>
<option value="Political Science">Political Science</option>
<option value="Economics">Economics</option>

{/* Commerce */}
<option value="Accountancy">Accountancy</option>
<option value="Business Studies">Business Studies</option>

{/* Computer & Tech */}
<option value="Computer Science">Computer Science</option>
<option value="Information Technology">Information Technology</option>
<option value="Programming">Programming</option>
<option value="Coding">Coding</option>

{/* Competitive & Skill-based */}
<option value="Science">General Science</option>
<option value="Environmental Studies">Environmental Studies</option>
<option value="Reasoning">Logical Reasoning</option>
<option value="Quantitative Aptitude">Quantitative Aptitude</option>
<option value="Spoken English">Spoken English</option>
<option value="Olympiad Preparation">Olympiad Preparation</option>
<option value="JEE Preparation">JEE Preparation</option>
<option value="NEET Preparation">NEET Preparation</option>

              </select>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1">
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) =>
                  setFilters({ ...filters, experience: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
              >
                <option value="">All</option>
                <option value="0-1">0–1 years</option>
                <option value="2-5">2–5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1">
                Max Price: ₹{filters.price.toLocaleString()}
              </label>
              <input
                type="range"
                min={500}
                max={12000}
                step={500}
                value={filters.price}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    price: Number(e.target.value),
                  })
                }
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* STATES */}
          {isLoading && (
            <p className="text-center text-gray-500">
              Loading premium tutors...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!isLoading && filteredTutors.length === 0 && (
            <div className="text-center py-24 text-gray-600">
              😔 No tutors found for selected filters
            </div>
          )}

          {/* PREMIUM TUTOR GRID */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="
              grid gap-10
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {filteredTutors.map((tutor) => (
              <TutorPremiumCard
                key={tutor._id}
                tutor={tutor}
                onOpenProfile={() =>
                  router.push(`/tutors/${tutor._id}`)
                }
              />
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TutorMatches;

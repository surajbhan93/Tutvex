import { useRouter } from 'next/router';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const JuniorSection = () => {
  const router = useRouter();

  // Full subject list for Class 6-8
  const subjects = [
    { name: 'Mathematics', desc: 'Algebra, Geometry, Mensuration, Fractions, Decimals, Word Problems, Logical Reasoning.' },
    { name: 'Science', desc: 'Physics, Chemistry, Biology concepts with experiments, Observations, and Scientific Thinking.' },
    { name: 'English', desc: 'Grammar, Writing Skills, Literature, Reading Comprehension, Vocabulary, Speaking Practice.' },
    { name: 'Hindi', desc: 'Grammar, Vocabulary, Creative Writing, Literature, Comprehension, Speaking Skills.' },
    { name: 'Social Science', desc: 'History, Civics, Geography, Cultural Awareness, Map Skills, Current Affairs.' },
    { name: 'Computer Basics', desc: 'MS Office (Word, Excel, PowerPoint), Typing, Internet Basics, Coding Fundamentals, Cyber Safety.' },
    { name: 'Art & Craft', desc: 'Drawing, Painting, DIY Projects, Creative Expression, School Projects.' },
  ];

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Navbar */}
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Top Back Button */}
        <button
          onClick={() => router.push('/#kids-courses')}
          className="self-start rounded-xl bg-indigo-500 px-5 py-2 text-white font-medium shadow hover:bg-indigo-600 transition transform hover:scale-105"
        >
          ← Back to Courses
        </button>

        {/* Header + Image */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-6 text-5xl font-extrabold text-indigo-600 drop-shadow-sm">
              🎓 Junior Section (Class 6th to 8th)
            </h1>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              The Junior Section strengthens your child’s academic foundation with concept-based learning and analytical thinking. Lessons encourage logic, reasoning, and creativity, preparing students for higher grades through projects, experiments, and practical examples.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our goal is to build confidence and problem-solving skills in students, nurturing curiosity and a love for learning that continues into higher classes.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/kids-courses/junior.png"
              alt="Junior Section"
              className="w-80 lg:w-full object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>

        {/* Subjects Section */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-3xl font-semibold text-indigo-500 text-center">
            Subjects Covered (Class 6-8)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <div
                key={sub.name}
                className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-indigo-100 shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <h3 className="font-semibold text-indigo-600 text-xl mb-1">{sub.name}</h3>
                <p className="text-gray-700">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Note + CTA */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="rounded-3xl bg-indigo-100 p-6 text-center shadow-md w-full md:w-2/3">
            <p className="text-xl font-semibold text-indigo-700">
              🚀 “Explore, question, and grow — that’s how knowledge blooms!”
            </p>
          </div>
          <button
            onClick={() => router.push('/find-tutor')}
            className="rounded-xl bg-indigo-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-indigo-600 transition transform hover:scale-105"
          >
            Find a Tutor for Your Child
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default JuniorSection;

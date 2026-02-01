import { useRouter } from 'next/router';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import { FaFlask, FaPalette, FaCalculator, FaGlobe, FaLanguage } from 'react-icons/fa';

const PrimarySection = () => {
  const router = useRouter();

  const subjects = [
    { name: 'English', desc: 'Reading, Writing, Grammar, Vocabulary, Storytelling.', icon: <FaLanguage className="text-3xl text-pink-600" /> },
    { name: 'Hindi', desc: 'Grammar, Vocabulary, Creative Writing, Comprehension.', icon: <FaLanguage className="text-3xl text-pink-600" /> },
    { name: 'Mathematics', desc: 'Numbers, Shapes, Problem Solving, Logical Thinking.', icon: <FaCalculator className="text-3xl text-pink-600" /> },
    { name: 'Science', desc: 'Curiosity-based experiments, Observations, and Fun Learning.', icon: <FaFlask className="text-3xl text-pink-600" /> },
    { name: 'Social Studies', desc: 'People, Places, Nature, History, and Cultural Awareness.', icon: <FaGlobe className="text-3xl text-pink-600" /> },
    { name: 'Art & Craft', desc: 'Drawing, Painting, DIY Projects, Creative Expression.', icon: <FaPalette className="text-3xl text-pink-600" /> },
  ];

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      {/* Navbar */}
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Top Back Button */}
        <button
          onClick={() => router.push('/#kids-courses')}
          className="self-start rounded-xl bg-pink-500 px-5 py-2 text-white font-medium shadow hover:bg-pink-600 transition transform hover:scale-105"
        >
          ← Back to Courses
        </button>

        {/* Header + Image */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-6 text-5xl font-extrabold text-pink-600 drop-shadow-sm">
              📚 Primary Section (Class 1st to 5th)
            </h1>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              Welcome to our Primary Section, where young learners embark on an exciting journey of discovery. Our interactive lessons, hands-on activities, and creative exercises make learning fun, engaging, and memorable.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From building strong foundations in English and Math to exploring Science, Arts, and Social Studies, every subject is crafted to spark curiosity and inspire confidence in your child.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/kids-courses/primary.png"
              alt="Primary Section"
              className="w-80 lg:w-full object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>

        {/* Subjects Section */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-3xl font-semibold text-pink-500 text-center">
            Subjects Covered
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((sub) => (
              <div
                key={sub.name}
                className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-100 shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <div>{sub.icon}</div>
                <div>
                  <h3 className="font-semibold text-pink-600 text-xl">{sub.name}</h3>
                  <p className="text-gray-700">{sub.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Note + CTA */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="rounded-3xl bg-pink-100 p-6 text-center shadow-md w-full md:w-2/3">
            <p className="text-xl font-semibold text-pink-700">
              🌟 “Learning is fun when curiosity meets creativity!” 🌟
            </p>
          </div>
          <button
            onClick={() => router.push('/find-tutor')}
            className="rounded-xl bg-pink-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-pink-600 transition transform hover:scale-105"
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

export default PrimarySection;

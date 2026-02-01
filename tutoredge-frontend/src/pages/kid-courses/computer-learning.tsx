import { useRouter } from 'next/router';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const ComputerLearning = () => {
  const router = useRouter();

  const topics = [
    // Class 1-2
    'Introduction to Computers',
    'Parts of a Computer',
    'Using Keyboard & Mouse',
    'Basic Typing Skills',
    'Drawing & Painting using Paint App',

    // Class 3-5
    'Introduction to MS Word',
    'Basic Word Processing',
    'Introduction to MS PowerPoint',
    'Creating Simple Presentations',
    'Introduction to Internet & Search Engines',
    'Safe Internet Practices',
    'Email Basics',

    // Class 6-8
    'MS Excel Basics & Formulas',
    'Intermediate Typing Skills',
    'Introduction to Scratch Programming',
    'Basic Python Concepts',
    'Digital Ethics & Cyber Safety',
    'File Handling & Organization',
    'Fun Projects: Create Games, Stories, and Animations',
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Main Content Wrapper */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Top Back Button */}
        <button
          onClick={() => router.push('/#kids-courses')}
          className="self-start rounded-xl bg-green-500 px-5 py-2 text-white font-medium shadow hover:bg-green-600 transition transform hover:scale-105"
        >
          ← Back to Courses
        </button>

        {/* Header + Image */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-6 text-5xl font-extrabold text-green-600 drop-shadow-sm">
              💻 Computer Learning (Class 1 to 8)
            </h1>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              Our comprehensive Computer Learning course is designed for children from Class 1 to 8. 
              From understanding the basics of computers to exploring coding, internet safety, and digital creativity, 
              this course ensures children develop strong computer literacy in a fun and interactive way.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hands-on projects, exercises, and interactive lessons help students learn by doing. 
              We focus on building skills in typing, MS Office, programming, internet usage, and digital ethics, 
              preparing children to confidently use technology in academics and daily life.
            </p>
          </div>

          {/* Right: Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/kids-courses/computer.png"
              alt="Computer Learning"
              className="w-80 lg:w-full object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>

        {/* Topics Section */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-3xl font-semibold text-green-500 text-center">
            Topics Covered (Class 1-8)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <h3 className="font-semibold text-green-600 text-lg">{topic}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Note */}
        <div className="mt-10 rounded-3xl bg-green-100 p-6 text-center shadow-md w-full md:w-2/3 mx-auto">
          <p className="text-xl font-semibold text-green-700">
            💡 “The future is digital — start exploring it today!”
          </p>
        </div>

        {/* Bottom Find a Tutor Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push('/find-tutor')}
            className="rounded-xl bg-green-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-green-600 transition transform hover:scale-105"
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

export default ComputerLearning;

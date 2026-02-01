import { useRouter } from 'next/router';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const SpokenEnglish = () => {
  const router = useRouter();

  const topics = [
    'Basic Grammar and Vocabulary Building',
    'Daily Conversation Practice',
    'Public Speaking and Storytelling',
    'Listening and Pronunciation Improvement',
    'Confidence and Personality Development',
  ];

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-white min-h-screen">
      {/* Navbar */}
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Top Back Button */}
        <button
          onClick={() => router.push('/#kids-courses')}
          className="self-start rounded-xl bg-yellow-500 px-5 py-2 text-white font-medium shadow hover:bg-yellow-600 transition transform hover:scale-105"
        >
          ← Back to Courses
        </button>

        {/* Header + Image */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-6 text-5xl font-extrabold text-yellow-600 drop-shadow-sm">
              🗣️ Spoken English
            </h1>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              Speak confidently and express freely! This course helps children improve their pronunciation, listening, and speaking skills through interactive games, dialogues, and fun activities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our goal is to nurture confident communicators who can articulate ideas clearly and engage in conversations with ease.
            </p>
          </div>

          {/* Right: Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/kids-courses/english.png"
              alt="Spoken English"
              className="w-80 lg:w-full object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>

        {/* Topics Section */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-3xl font-semibold text-yellow-500 text-center">
            Topics Covered
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-gradient-to-r from-yellow-50 to-yellow-100 shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <h3 className="font-semibold text-yellow-600 text-xl mb-1">{topic}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Note */}
        <div className="mt-10 rounded-3xl bg-yellow-100 p-6 text-center shadow-md w-full md:w-2/3 mx-auto">
          <p className="text-xl font-semibold text-yellow-700">
            🌟 “Confidence grows when you find your voice — let’s speak up!” 🌟
          </p>
        </div>

        {/* Bottom Find a Tutor Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push('/find-tutor')}
            className="rounded-xl bg-yellow-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
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

export default SpokenEnglish;

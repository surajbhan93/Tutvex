import { ArrowRightIcon } from '@heroicons/react/24/solid';
import React from 'react';

const stepsData = [
  {
    id: 1,
    img: 'images/how-it-works/demo.svg',
    title: '1 to 3 Tutors give a demo session to your child',
    color: 'bg-yellow-400',
  },
  {
    id: 2,
    img: 'images/how-it-works/selection.svg',
    title: 'Parents select the best tutor based on demo',
    color: 'bg-pink-500',
  },
  {
    id: 3,
    img: 'images/how-it-works/test.svg',
    title: 'Tutor conducts monthly test series on our platform',
    color: 'bg-blue-500',
  },
  {
    id: 4,
    img: 'images/how-it-works/analytics.svg',
    title: 'Student’s scorecard displayed on dashboard',
    color: 'bg-green-500',
  },
];

const HowItWorks = () => {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-20">
      {/* Decorative blobs */}
      <div className="absolute -left-32 -top-32 size-64 rounded-full bg-purple-200 opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 size-72 rounded-full bg-pink-200 opacity-30 blur-3xl"></div>

      <h2 className="relative z-10 mb-16 text-center text-4xl font-extrabold text-gray-900">
        Our <span className="text-primary">Step-by-Step</span> Learning Process
      </h2>

      <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row md:justify-between">
        {stepsData.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`relative flex w-full max-w-sm flex-col items-center justify-center rounded-3xl ${step.color} p-8 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl md:w-1/4`}
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={step.img}
                  alt={step.title}
                  className="size-20 object-contain drop-shadow-md"
                />
              </div>

              <p className="text-center text-lg font-bold text-gray-900">
                {step.title}
              </p>
            </div>

            {/* Arrow between steps */}
            {index < stepsData.length - 1 && (
              <div className="hidden items-center md:flex">
                <ArrowRightIcon className="size-8 text-gray-400" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;

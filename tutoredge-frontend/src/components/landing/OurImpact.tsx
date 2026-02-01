import { Globe, Video } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const statsData = [
  { value: 2800, unit: 'tutors', description: 'in Allahabad' },
  { value: 1000, unit: 'tutors', description: 'in Lucknow' },
  { value: 11500, unit: 'tutors', description: 'across other regions' },
  { value: 4000, unit: 'students', description: 'taught in the last 2 years' },
  { value: 2800, unit: 'students', description: 'scored 99% & above (1 year)', highlight: true },
  { value: 2300, unit: 'students', description: 'scored 98% & above (1 year)', highlight: true },
  { value: 500, unit: 'students', description: 'scored 95% & above (1 year)' },
  { value: 1500, unit: 'students', description: 'scored 90% & above (1 year)' },
];

const featuresData = [
  { text: 'Short animated videos', icon: Video, className: 'top-1/4 left-1/4' },
];

const avatarsData = [
  { src: '/images/avatars/avatar-1.jpg', className: 'top-10 right-1/4 h-12 w-12' },
  { src: '/images/avatars/avatar-2.jpg', className: 'top-1/3 left-10 h-16 w-16' },
  { src: '/images/avatars/avatar-3.jpg', className: 'top-1/2 left-1/2 h-10 w-10' },
  { src: '/images/avatars/avatar-4.jpg', className: 'bottom-1/4 right-1/4 h-14 w-14' },
];

const OurImpact = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl bg-gradient-to-b from-white to-gray-50 p-6 py-16 shadow-2xl">
      {/* Background Map */}
      <div className="absolute inset-y-0 left-1/2 right-0 z-0 opacity-20">
        <Image
          src="/images/india-map-dotted-blue.png"
          alt="Dotted map"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div ref={ref} className="relative z-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Our <span className="text-primary">Impact</span>
            </h2>
            <p className="mt-2 text-gray-600">
              Making education affordable and accessible across the globe
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {statsData.map((stat) => (
              <div
                key={stat.description}
                className="p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="text-4xl font-extrabold text-gray-900">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      duration={2}
                      separator=","
                    />
                  ) : (
                    0
                  )}
                  <span className="text-3xl text-gray-700"> {stat.unit}</span>
                </p>
                <p
                  className={`mt-1 text-sm ${
                    stat.highlight
                      ? 'font-semibold text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="relative min-h-[400px] w-full">
          {/* Features */}
          {featuresData.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.text}
                className={`absolute flex animate-bounce items-center gap-2 rounded-full bg-white p-2 pr-4 shadow-lg ${feature.className}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {feature.text}
                </span>
              </div>
            );
          })}

          {/* Avatars */}
          {avatarsData.map((avatar) => (
            <div
              key={avatar.src}
              className={`absolute overflow-hidden rounded-full border-2 border-white shadow-md ${avatar.className} animate-pulse`}
            >
              <Image
                src={avatar.src}
                alt="User avatar"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}

          {/* Company Logo */}
          <div className="absolute bottom-1/3 right-1/4 flex animate-bounce items-center gap-2 rounded-full bg-white p-2 pr-4 shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Tutvex</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurImpact;

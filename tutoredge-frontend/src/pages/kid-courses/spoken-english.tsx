import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const SpokenEnglish = () => {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const topics = [
    {
      icon: '📖',
      title: 'Basic Grammar & Vocabulary',
      desc: 'Master tenses, parts of speech, and 1000+ everyday words through immersive games and stories.',
      tag: 'Foundation',
    },
    {
      icon: '💬',
      title: 'Daily Conversation Practice',
      desc: 'Practice real-life dialogues — greetings, shopping, school, and social situations.',
      tag: 'Fluency',
    },
    {
      icon: '🎤',
      title: 'Public Speaking & Storytelling',
      desc: 'Develop stage presence, voice modulation, and the art of storytelling through debates and skits.',
      tag: 'Advanced',
    },
    {
      icon: '👂',
      title: 'Listening & Pronunciation',
      desc: 'Train accent, intonation, stress patterns, and active listening with expert guidance.',
      tag: 'Clarity',
    },
    {
      icon: '🌟',
      title: 'Confidence & Personality',
      desc: 'Build unshakeable self-confidence through role plays, group discussions, and communication techniques.',
      tag: 'Mindset',
    },
    {
      icon: '✍️',
      title: 'Reading & Comprehension',
      desc: 'Enhance reading speed and understanding through structured passages and critical thinking.',
      tag: 'Literacy',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Students Trained', icon: '👨‍🎓' },
    { value: '95%', label: 'Fluency Improvement', icon: '📈' },
    { value: '500+', label: 'Expert Tutors', icon: '👩‍🏫' },
    { value: '4.9★', label: 'Average Rating', icon: '⭐' },
  ];

  const faqs = [
    {
      q: 'What age group is this course designed for?',
      a: 'This course is tailored for children aged 6–16 years. We have separate batches for different age groups to ensure age-appropriate, engaging learning experiences.',
    },
    {
      q: 'How are the live classes conducted?',
      a: 'All classes are conducted online via interactive video sessions with certified tutors. Recorded sessions are also provided for revision and missed classes.',
    },
    {
      q: 'How soon will my child see real improvement?',
      a: 'Most students show noticeable improvement in pronunciation and speaking confidence within 4–6 weeks of consistent practice.',
    },
    {
      q: 'Is there a free demo class available?',
      a: 'Absolutely! We offer a complimentary 30-minute demo class so your child can experience our teaching approach before enrolling.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya S.',
      child: 'Mother of Aryan, Age 10',
      review: 'My son was very shy and afraid to speak English. After just 2 months, he now presents in class without any fear. Truly life-changing!',
      avatar: 'P',
      color: 'from-rose-400 to-pink-500',
    },
    {
      name: 'Rahul M.',
      child: 'Father of Ishaan, Age 8',
      review: 'The tutors are incredibly patient and fun. Ishaan actually looks forward to his English classes every day now. Amazing transformation!',
      avatar: 'R',
      color: 'from-amber-400 to-orange-500',
    },
    {
      name: 'Sunita K.',
      child: 'Mother of Diya, Age 13',
      review: "Diya's pronunciation and vocabulary have improved drastically. She even won a debate competition at school. Couldn't be prouder!",
      avatar: 'S',
      color: 'from-violet-400 to-purple-500',
    },
  ];

  return (
    <>
      <Head>
        <title>Spoken English Course for Kids | Build Fluency & Confidence | TutorApp</title>
        <meta name="description" content="Best Spoken English course for children. Improve pronunciation, vocabulary, public speaking & confidence with expert tutors. Interactive online classes for kids aged 6-16." />
        <meta name="keywords" content="spoken english for kids, english speaking course, children english class, pronunciation improvement, public speaking kids, english fluency online" />
        <meta property="og:title" content="Spoken English Course for Kids | Build Fluency & Confidence" />
        <meta property="og:description" content="Help your child speak English confidently. Expert tutors, interactive sessions, proven results." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://yoursite.com/courses/spoken-english" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Spoken English for Kids',
            description: 'Interactive spoken English course for children aged 6-16',
            provider: { '@type': 'Organization', name: 'TutorApp' },
            courseMode: 'online',
            educationalLevel: 'beginner to intermediate',
            audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
          }),
        }} />
      </Head>

      <div className="bg-[#fafaf8] min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <NavBar />

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative overflow-hidden min-h-screen flex items-center" style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        }}>
          {/* Ambient glows */}
          <div className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
          <div className="pointer-events-none absolute bottom-1/4 -right-32 h-80 w-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

          {/* Grid pattern overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 w-full">
            <button
              onClick={() => router.push('/#kids-courses')}
              className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              <span>←</span> Back to Courses
            </button>

            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center">
              {/* LEFT */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Premium English Program</span>
                </div>

                <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Speak English
                  <br />
                  <span style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Fearlessly
                  </span>
                </h1>

                <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/60 lg:text-xl">
                  Transform your child from a hesitant speaker to a confident communicator. Expert-led, interactive, and built for young learners.
                </p>

                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  <button
                    onClick={() => router.push('/find-tutor-flow/create-account')}
                    className="group relative overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-2xl transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                  >
                    <span className="relative z-10">🎯 Find a Tutor</span>
                    <div className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                  </button>
                  <button
                    onClick={() => router.push('/tutors')}
                    className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
                  >
                    🎁 Free Demo Class
                  </button>
                </div>

                {/* Trust row */}
                <div className="mt-10 flex flex-wrap justify-center gap-6 lg:justify-start">
                  {['✅ Live 1-on-1 Sessions', '✅ TEFL-Certified Tutors', '✅ Flexible Scheduling'].map((b) => (
                    <span key={b} className="text-xs font-medium text-white/40">{b}</span>
                  ))}
                </div>
              </div>

              {/* RIGHT — Image card */}
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Card glow */}
                  <div className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl" style={{ background: 'linear-gradient(135deg, #f59e0b40, #f9731640)' }} />

                  {/* Main card */}
                  <div className="relative rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-2xl">
                    <img
                      src="/images/kids-courses/english.png"
                      alt="Child learning spoken English online"
                      className="w-64 rounded-2xl object-contain sm:w-72 lg:w-80"
                    />
                  </div>

                  {/* Floating stat card 1 */}
                  <div className="absolute -bottom-6 -left-8 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl shadow-xl">
                    <p className="text-xs text-white/50 mb-1">Avg. Improvement</p>
                    <p className="text-3xl font-black text-amber-400">+85%</p>
                    <p className="text-xs text-white/40">within 8 weeks</p>
                  </div>

                  {/* Floating stat card 2 */}
                  <div className="absolute -top-6 -right-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-xl">
                    <p className="text-2xl font-black text-white">4.9 ⭐</p>
                    <p className="text-xs text-white/40">500+ Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ STATS ══════════════ */}
        <section className="bg-white py-16 border-b border-gray-100">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="mb-2 text-3xl">{s.icon}</div>
                  <p className="text-4xl font-black text-gray-900">{s.value}</p>
                  <p className="mt-1 text-sm text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ WHY US ══════════════ */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">Why Choose Us</span>
              <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">Built for Young Minds</h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">Every feature designed with your child's growth and confidence in mind.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '🧠', title: 'Brain-Friendly Learning', desc: 'Lessons designed using child psychology for maximum retention and engagement.', accent: '#fef3c7' },
                { icon: '🎮', title: 'Gamified Sessions', desc: 'Interactive games, quizzes, and challenges that keep children motivated.', accent: '#fff7ed' },
                { icon: '👩‍🏫', title: 'TEFL/CELTA Certified', desc: 'Expert tutors with proven experience in teaching English to young learners.', accent: '#fef9c3' },
                { icon: '📊', title: 'Progress Tracking', desc: 'Regular assessments and detailed reports to monitor and celebrate improvement.', accent: '#ffedd5' },
                { icon: '🕐', title: 'Flexible Scheduling', desc: "Classes that adapt to your child's school schedule and extracurriculars.", accent: '#fef3c7' },
                { icon: '🌍', title: 'Global Standards', desc: 'Curriculum aligned with Cambridge English and international benchmarks.', accent: '#fff7ed' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-default"
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: item.accent }}>
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ CURRICULUM ══════════════ */}
        <section className="py-24" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">Course Curriculum</span>
              <h2 className="text-4xl font-black text-white sm:text-5xl">6 Modules to Mastery</h2>
              <p className="mt-4 text-white/40 max-w-xl mx-auto">A comprehensive, structured path from beginner to confident speaker.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-amber-500/30 cursor-default"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                      {topic.icon}
                    </div>
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                      {topic.tag}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-white">{topic.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{topic.desc}</p>

                  {/* Hover glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section className="bg-[#fafaf8] py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">The Process</span>
              <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">How It Works</h2>
              <p className="mt-4 text-gray-400">Four simple steps to transform your child's English</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '01', icon: '📋', title: 'Free Assessment', desc: "We evaluate your child's current English level." },
                { step: '02', icon: '🗺️', title: 'Custom Roadmap', desc: 'A personalized learning plan is created for them.' },
                { step: '03', icon: '📚', title: 'Live Sessions', desc: '1-on-1 or group classes with expert tutors.' },
                { step: '04', icon: '🏆', title: 'Track & Celebrate', desc: 'Regular reports and milestone celebrations.' },
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-amber-200 to-amber-100 lg:block" />
                  )}
                  <div className="relative">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg border border-gray-100">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-xs font-black text-white">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ TESTIMONIALS ══════════════ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">Testimonials</span>
              <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">Parents Love Us</h2>
              <p className="mt-4 text-gray-400">Real transformations from real families across India</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={i} className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {Array(5).fill(0).map((_, s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-gray-500 italic">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-black text-white`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.child}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ FAQ ══════════════ */}
        <section className="bg-[#fafaf8] py-24">
          <div className="mx-auto max-w-2xl px-6">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">FAQ</span>
              <h2 className="text-4xl font-black text-gray-900">Common Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-amber-200">
                  <button
                    className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-bold text-gray-900 transition hover:text-amber-600"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all ${openFaq === i ? 'border-amber-400 bg-amber-400 text-white rotate-45' : 'border-gray-200 text-gray-400'}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-gray-50 px-6 pb-5 pt-4">
                      <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section className="relative overflow-hidden py-28" style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        }}>
          {/* Glows */}
          <div className="pointer-events-none absolute top-0 left-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-60 w-60 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />

          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Limited Seats Available</span>
            </div>

            <h2 className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl">
              Give Your Child the
              <br />
              <span style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Gift of Confidence
              </span>
            </h2>

            <p className="mb-10 text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              Join 500+ students who have already transformed their English speaking skills. Your first demo class is completely free.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push('/find-tutor-flow/create-account')}
                className="group relative overflow-hidden rounded-2xl px-10 py-4 text-sm font-black text-white shadow-2xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
              >
                <span className="relative z-10">🎯 Find a Tutor Now</span>
                <div className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
              </button>
              <button
                onClick={() => router.push('/tutors')}
                className="rounded-2xl border border-white/20 bg-white/5 px-10 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
              >
                📅 Book Free Demo
              </button>
            </div>

            <p className="mt-6 text-xs text-white/30 tracking-wide">
              ✅ No credit card required &nbsp;·&nbsp; ✅ Cancel anytime &nbsp;·&nbsp; ✅ 100% satisfaction guarantee
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SpokenEnglish;
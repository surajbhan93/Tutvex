import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Button from '../../components/find-tutor-flow/Button';
import Calendar from '../../components/find-tutor-flow/Calendar';

const tutorData = {
  id: '1',
  name: 'Dr. Amelie Werper',
  education: 'PhD in Neuroscience, Stanford University',
  bio: `Dr. Werper is a highly experienced neuroscientist with a focus on brain research and educational neuroscience. She specializes in calculus, algebra, and psychology.`,
  rating: 5,
  ratingBreakdown: {
    '5 Stars': 80,
    '4 Stars': 15,
    '3 Stars': 5,
    '2 Stars': 0,
    '1 Star': 0,
  },
  subjects: ['Math', 'Physics', 'Biology', 'Chemistry', 'Social Science'],
  teachingModes: ['Online', 'Offline'],
  experience: 'Type of License',
  availability: ['2024-07-10', '2024-07-28', '2024-08-13'],
  avatarUrl: 'https://randomuser.me/api/portraits/women/50.jpg',
};

const TutorProfile: React.FC = () => {
  const router = useRouter();
  // const { id } = router.query as { id?: string };

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDates([date]); // single select
  };

  const handleBooking = () => {
    router.push('/find-tutor/request-sent');
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '3rem auto',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <img
          src={tutorData.avatarUrl}
          alt={tutorData.name}
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            marginRight: 24,
          }}
        />
        <div>
          <h2>{tutorData.name}</h2>
          <p style={{ color: '#555', fontStyle: 'italic' }}>
            {tutorData.education}
          </p>
        </div>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h3>About</h3>
        <p>{tutorData.bio}</p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Ratings</h3>
        <p style={{ fontWeight: 'bold', fontSize: 16 }}>
          {tutorData.rating} Stars
        </p>
        <div>
          {Object.entries(tutorData.ratingBreakdown).map(([star, percent]) => (
            <div
              key={star}
              style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}
            >
              <div style={{ width: 80 }}>{star}</div>
              <div
                style={{
                  height: 10,
                  background: '#ddd',
                  flexGrow: 1,
                  borderRadius: 4,
                  marginRight: 8,
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    background: '#007bff',
                    height: '100%',
                    borderRadius: 4,
                  }}
                />
              </div>
              <div>{percent}%</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Subjects (Select subject(s))</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tutorData.subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => toggleSubject(subject)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: selectedSubjects.includes(subject)
                  ? '2px solid #007bff'
                  : '1px solid #ccc',
                backgroundColor: selectedSubjects.includes(subject)
                  ? '#cfe2ff'
                  : 'transparent',
                cursor: 'pointer',
              }}
            >
              {subject}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Teaching mode</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {tutorData.teachingModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border:
                  selectedMode === mode
                    ? '2px solid #007bff'
                    : '1px solid #ccc',
                backgroundColor:
                  selectedMode === mode ? '#cfe2ff' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Experience</h3>
        <p>{tutorData.experience}</p>
      </section>

      <section>
        <h3>Availability</h3>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Calendar
            year={2024}
            month={7}
            availableDates={tutorData.availability}
            selectedDates={selectedDates}
            onSelectDate={handleDateSelect}
          />
          <Calendar
            year={2024}
            month={8}
            availableDates={tutorData.availability}
            selectedDates={selectedDates}
            onSelectDate={handleDateSelect}
          />
        </div>
      </section>

      <Button
        onClick={handleBooking}
        variant="primary"
        style={{ marginTop: 30, width: '100%' }}
      >
        Book a Demo
      </Button>
    </div>
  );
};

export default TutorProfile;

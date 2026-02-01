// src/pages/find-tutor-flow/tutor-preferences.tsx
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Button from '../../components/find-tutor-flow/Button';
import Checkbox from '../../components/find-tutor-flow/CheckBox';
import RadioGroup from '../../components/find-tutor-flow/RadioGroup';
import OnboardingStepper from '@/pages/find-tutor-flow/OnboardingStepper';
const subjects = ['Math', 'Science', 'English', 'History', 'Social Science','All Subject'];
const classes = [
  'Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7',
  'Class 8','Class 9','Class 10','Class 11','Class 12'
];
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'];
const timeSlots = ['Morning', 'Afternoon', 'Evening'];

const urgencyOptions = [
  { label: 'Within 24 hours', value: '24h' },
  { label: 'Within 1 week', value: '1w' },
  { label: 'Other & ASAP', value: 'other' },
];

const otherPreferencesOptions = [
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'One-on-One', value: 'one-on-one' },
  { label: 'Group', value: 'group' },
];

const TutorPreferences: React.FC = () => {
  const router = useRouter();

  const [subject, setSubject] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [board, setBoard] = useState('');
  const [language, setLanguage] = useState('');
  const [time, setTime] = useState('');
  const [scheduling, setScheduling] = useState<string[]>([]);
  const [urgency, setUrgency] = useState('');
  const [otherPrefs, setOtherPrefs] = useState<string[]>([]);

  const handleCheckbox = (setter: any, state: string[], e: any) => {
    const { value, checked } = e.target;
    if (checked) setter([...state, value]);
    else setter(state.filter((item) => item !== value));
  };

  // const handleNext = () => {
  //   router.push({
  //     pathname: '/find-tutor-flow/matches',
  //     query: {
  //       subject,
  //       classGrade,
  //       board,
  //       language,
  //       time,
  //       scheduling: scheduling.join(','),
  //       urgency,
  //       otherPreferences: otherPrefs.join(','),
  //     },
  //   });
  // };

  const handleNext = () => {
  router.push({
    pathname: '/find-tutor-flow/tutor-matches',
    query: {
      subject,
      classGrade,
      board,
      language,
      time,
      scheduling: scheduling.join(','),
      urgency,
      otherPreferences: otherPrefs.join(','),
    },
  });
};


  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
<OnboardingStepper currentStep={2} />
      {/* Full width nav */}
      <div style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        
      </div>

      {/* Center Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px 15px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 620,
          backgroundColor: '#fff',
          borderRadius: 18,
          padding: '2.5rem 3rem',
          boxShadow: '0px 8px 28px rgba(0,0,0,0.18)',
        }}>
          <h2 style={{
            marginBottom: 30,
            textAlign: 'center',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
            fontSize: 24,
            fontWeight: 600,
          }}>
            Tell us what you are looking for
          </h2>

          {/* Academic Needs */}
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10 }}>Academic Needs</label>

            {[{
              value: subject,
              onChange: (e: any) => setSubject(e.target.value),
              placeholder: "Select Subject",
              list: subjects
            },
            {
              value: classGrade,
              onChange: (e: any) => setClassGrade(e.target.value),
              placeholder: "Select Class",
              list: classes
            },
            {
              value: board,
              onChange: (e: any) => setBoard(e.target.value),
              placeholder: "Select Board",
              list: boards
            },
            {
              value: language,
              onChange: (e: any) => setLanguage(e.target.value),
              placeholder: "Select Language",
              list: languages
            }].map((item, index) => (
              <select
                key={index}
                style={{
                  width: '100%',
                  padding: 14,
                  marginBottom: 16,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                }}
                value={item.value}
                onChange={item.onChange}
              >
                <option value="">{item.placeholder}</option>
                {item.list.map((v: any) => <option key={v} value={v}>{v}</option>)}
              </select>
            ))}

          </div>

          {/* Scheduling */}
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10 }}>Scheduling & Time</label>

            <Checkbox
              label="Weekends"
              value="weekends"
              checked={scheduling.includes('weekends')}
              onChange={(e) => handleCheckbox(setScheduling, scheduling, e)}
            />
            <Checkbox
              label="Weekdays"
              value="weekdays"
              checked={scheduling.includes('weekdays')}
              onChange={(e) => handleCheckbox(setScheduling, scheduling, e)}
            />

            <select
              style={{
                width: '100%',
                padding: 14,
                marginTop: 12,
                borderRadius: 8,
                border: '1px solid #ccc',
                fontSize: 16,
              }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {timeSlots.map((ts) => <option key={ts} value={ts}>{ts}</option>)}
            </select>
          </div>

          {/* Other Preferences */}
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10 }}>Other Preferences</label>
            {otherPreferencesOptions.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                value={opt.value}
                checked={otherPrefs.includes(opt.value)}
                onChange={(e) => handleCheckbox(setOtherPrefs, otherPrefs, e)}
              />
            ))}
          </div>

          {/* Urgency */}
          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10 }}>Urgency</label>
            <RadioGroup name="urgency" options={urgencyOptions} selectedValue={urgency} onChange={setUrgency} />
          </div>

          {/* CTA */}
          <Button
            onClick={handleNext}
            variant="primary"
            style={{
              width: '100%',
              padding: '14px 0',
              fontSize: 16,
              borderRadius: 8,
              backgroundColor: '#FF4500',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FF6347')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF4500')}
          >
            Find My Tutors
          </Button>
        </div>
      </div>

      {/* Full width footer */}
      <div style={{ width: '100%', marginTop: 'auto' }}>
        
      </div>

    </div>
  );
};

export default TutorPreferences;

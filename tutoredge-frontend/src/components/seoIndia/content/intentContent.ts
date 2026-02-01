export const INTENT_CONTENT: Record<
  string,
  {
    intro: string;
    benefits: string[];
  }
> = {
  // ======================
  // Parents / Students
  // ======================

  "home-tutor": {
    intro:
      "Parents in {location}, {city} prefer home tutors for personalised attention and better academic results.",
    benefits: [
      "One-to-one learning at home",
      "Flexible timings",
      "Better exam performance",
    ],
  },

  "private-tutor": {
    intro:
      "Private tutors in {location}, {city} help students overcome learning gaps with customised teaching.",
    benefits: [
      "Personalised study plan",
      "Focused doubt solving",
      "Improved confidence",
    ],
  },

  "home-tuition": {
    intro:
      "Home tuition in {location}, {city} is ideal for students who need regular guidance and practice.",
    benefits: [
      "Comfort of learning at home",
      "Regular assessments",
      "Consistent progress",
    ],
  },

  "maths-tutor": {
    intro:
      "Mathematics tutors in {location}, {city} focus on concepts, practice and exam-oriented preparation.",
    benefits: [
      "Concept clarity",
      "Board-focused preparation",
      "Regular practice tests",
    ],
  },

  "physics-tutor": {
    intro:
      "Physics tutors in {location}, {city} simplify concepts using numericals and real-life examples.",
    benefits: [
      "Strong numerical practice",
      "Exam-oriented approach",
      "Doubt-focused sessions",
    ],
  },

  "chemistry-tutor": {
    intro:
      "Chemistry tutors in {location}, {city} make reactions and formulas easy to understand.",
    benefits: [
      "Simple explanations",
      "Reaction-based learning",
      "Board & competitive exam focus",
    ],
  },

  "science-tutor": {
    intro:
      "Science tutors in {location}, {city} provide balanced preparation in Physics, Chemistry and Biology.",
    benefits: [
      "Strong fundamentals",
      "Integrated subject learning",
      "Regular revision",
    ],
  },

  "english-tutor": {
    intro:
      "English tutors in {location}, {city} help students improve grammar, writing and communication skills.",
    benefits: [
      "Grammar & vocabulary building",
      "Better reading and writing",
      "Confidence in communication",
    ],
  },

  "class-10-tutor": {
    intro:
      "Class 10 tutors in {location}, {city} focus on board exam preparation and scoring strategies.",
    benefits: [
      "Board pattern practice",
      "Previous year questions",
      "Regular mock tests",
    ],
  },

  "class-12-tutor": {
    intro:
      "Class 12 tutors in {location}, {city} guide students with syllabus completion and exam strategy.",
    benefits: [
      "Board-focused teaching",
      "Numerical & theory balance",
      "Time management skills",
    ],
  },

  "jee-tutor": {
    intro:
      "JEE tutors in {location}, {city} help students build strong foundations for competitive exams.",
    benefits: [
      "Concept-based learning",
      "Advanced problem practice",
      "Exam-oriented strategy",
    ],
  },

  "neet-tutor": {
    intro:
      "NEET tutors in {location}, {city} provide focused preparation in Biology, Physics and Chemistry.",
    benefits: [
      "NCERT-focused study",
      "Concept clarity",
      "Regular test practice",
    ],
  },

  // ======================
  // Tutors / Teachers
  // ======================

  "become-tutor": {
    intro:
      "Tutors in {location}, {city} can earn by teaching students nearby through Tutvex.",
    benefits: [
      "Local students",
      "Flexible schedule",
      "Secure payments",
    ],
  },

  "tutor-job": {
    intro:
      "Tutor jobs in {location}, {city} offer flexible teaching opportunities for skilled educators.",
    benefits: [
      "Work near your location",
      "Part-time or full-time options",
      "Regular income",
    ],
  },

  "home-tutor-job": {
    intro:
      "Home tutor jobs in {location}, {city} connect tutors with students seeking personalised learning.",
    benefits: [
      "One-to-one teaching",
      "Fixed teaching hours",
      "Verified leads",
    ],
  },

  "part-time-tutor": {
    intro:
      "Part-time tutors in {location}, {city} can earn extra income alongside studies or jobs.",
    benefits: [
      "Flexible timings",
      "No long-term commitment",
      "Stable side income",
    ],
  },
};

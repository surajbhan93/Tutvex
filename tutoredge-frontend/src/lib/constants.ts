// // src/lib/constants.ts

// /* =========================
//    BOARDS
// ========================= */
// export const BOARDS = [
//   { id: "cbse", label: "CBSE" },
//   { id: "icse", label: "ICSE" },
//   { id: "state", label: "State Board" },
//   { id: "ib", label: "IB (International Baccalaureate)" },
//   { id: "igcse", label: "IGCSE / Cambridge" },
// ];

// /* =========================
//    MEDIUMS
// ========================= */
// export const MEDIUMS = [
//   { id: "english", label: "English Medium" },
//   { id: "hindi", label: "Hindi Medium" },
//   { id: "bilingual", label: "Bilingual (Hindi + English)" },
// ];

// /* =========================
//    SUBJECTS (CATEGORIZED)
// ========================= */
// export const SUBJECT_CATEGORIES = {
//   school_academic: {
//     label: "School Subjects",
//     subjects: [
//       "Maths",
//       "Physics",
//       "Chemistry",
//       "Biology",
//       "Science",
//       "Social Science",
//       "History",
//       "Geography",
//       "Civics",
//       "Political Science",
//       "Economics",
//       "Business Studies",
//       "Accountancy",
//       "Commerce",
//       "English",
//       "Hindi",
//       "Sanskrit",
//       "Computer Science",
//       "Information Technology",
//       "Environmental Studies (EVS)",
//       "General Knowledge",
//     ],
//   },

//   competitive_exams: {
//     label: "Competitive Exams",
//     subjects: [
//       "JEE (Main & Advanced)",
//       "NEET",
//       "CUET",
//       "Olympiad Preparation",
//       "NTSE",
//       "KVPY",
//       "Foundation Courses",
//     ],
//   },

//   languages: {
//     label: "Languages",
//     subjects: [
//       "English Speaking",
//       "Spoken English",
//       "Hindi Grammar",
//       "French",
//       "German",
//       "Spanish",
//       "Japanese",
//       "Chinese (Mandarin)",
//     ],
//   },

//   skills_career: {
//     label: "Skill & Career Oriented",
//     subjects: [
//       "Coding for Kids",
//       "Python Programming",
//       "Java Programming",
//       "Web Development",
//       "Data Structures & Algorithms",
//       "Artificial Intelligence Basics",
//       "Machine Learning Basics",
//       "Robotics",
//       "App Development",
//     ],
//   },

//   early_learning: {
//     label: "Early Learning",
//     subjects: [
//       "Nursery Basics",
//       "LKG / UKG",
//       "Phonics",
//       "Handwriting",
//       "Basic Maths",
//       "Reading Skills",
//     ],
//   },

//   special_education: {
//     label: "Special Education",
//     subjects: [
//       "Learning Disability Support",
//       "Slow Learners Program",
//       "Special Needs Education",
//       "Remedial Classes",
//     ],
//   },

//   test_prep: {
//     label: "Test Preparation",
//     subjects: [
//       "Board Exam Preparation",
//       "School Term Exams",
//       "Online Test Series",
//       "Mock Tests & Practice",
//     ],
//   },
// };

// /* =========================
//    FLATTENED SUBJECT LIST
//    (FOR SEARCH & FILTER)
// ========================= */
// export const ALL_SUBJECTS: string[] = Object.values(SUBJECT_CATEGORIES)
//   .flatMap((category) => category.subjects);

// src/lib/constants.ts

/* =========================
   BOARDS
========================= */
export const BOARDS = [
  { id: "cbse", label: "CBSE" },
  { id: "icse", label: "ICSE" },
  { id: "state", label: "State Board" },
  { id: "ib", label: "IB (International Baccalaureate)" },
  { id: "igcse", label: "IGCSE / Cambridge" },
];

/* =========================
   MEDIUMS
========================= */
export const MEDIUMS = [
  { id: "english", label: "English Medium" },
  { id: "hindi", label: "Hindi Medium" },
  { id: "bilingual", label: "Bilingual (Hindi + English)" },
];

/* =========================
   CLASS DEFINITIONS
========================= */
const PRIMARY_CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
const MIDDLE_CLASSES = ["Class 6", "Class 7", "Class 8"];
const SECONDARY_CLASSES = ["Class 9", "Class 10"];
const SENIOR_CLASSES = ["Class 11", "Class 12"];

/* =========================
   POPULAR SUBJECTS
========================= */
export const POPULAR_SUBJECTS = [
  "Class 9 Maths",
  "Class 9 Physics",
  "Class 9 Chemistry",
  "Class 9 Biology",

  "Class 10 Maths",
  "Class 10 Physics",
  "Class 10 Chemistry",
  "Class 10 Biology",

  "Class 10 English",
  "Class 10 Social Science",

  "Class 11 Maths",
  "Class 11 Physics",
  "Class 11 Chemistry",
  "Class 11 Biology",

  "Class 12 Maths",
  "Class 12 Physics",
  "Class 12 Chemistry",
  "Class 12 Biology",
  


];


/* =========================
   SUBJECT GROUPS
========================= */
const PRIMARY_SUBJECTS = [
  "Maths",
  "English",
  "Hindi",
  "EVS",
  "General Knowledge",
  "Drawing",
  "Moral Science",
];

const MIDDLE_SUBJECTS = [
  "Maths",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Computer Science",
  "Sanskrit",
];

const SECONDARY_SUBJECTS = [
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Social Science",
  "Computer Science",
];

const SENIOR_SCIENCE_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "Computer Science",
  "Physical Education",
];

const SENIOR_COMMERCE_SUBJECTS = [
  "Accountancy",
  "Business Studies",
  "Economics",
  "Mathematics",
  "Entrepreneurship",
];

const SENIOR_ARTS_SUBJECTS = [
  "History",
  "Political Science",
  "Geography",
  "Sociology",
  "Psychology",
  "Economics",
];

/* =========================
   GENERATORS
========================= */
const generateClassSubjects = (classes: string[], subjects: string[]) =>
  classes.flatMap((cls) =>
    subjects.map((sub) => `${cls} ${sub}`)
  );

/* =========================
   SUBJECT CATEGORIES
========================= */
export const SUBJECT_CATEGORIES = {
  class_primary: {
    label: "Primary Classes (1–5)",
    subjects: generateClassSubjects(PRIMARY_CLASSES, PRIMARY_SUBJECTS),
  },

  class_middle: {
    label: "Middle Classes (6–8)",
    subjects: generateClassSubjects(MIDDLE_CLASSES, MIDDLE_SUBJECTS),
  },

  class_secondary: {
    label: "Secondary Classes (9–10)",
    subjects: generateClassSubjects(SECONDARY_CLASSES, SECONDARY_SUBJECTS),
  },

  class_senior_science: {
    label: "Class 11–12 Science",
    subjects: generateClassSubjects(SENIOR_CLASSES, SENIOR_SCIENCE_SUBJECTS),
  },

  class_senior_commerce: {
    label: "Class 11–12 Commerce",
    subjects: generateClassSubjects(SENIOR_CLASSES, SENIOR_COMMERCE_SUBJECTS),
  },

  class_senior_arts: {
    label: "Class 11–12 Arts",
    subjects: generateClassSubjects(SENIOR_CLASSES, SENIOR_ARTS_SUBJECTS),
  },

  competitive_exams: {
    label: "Competitive Exams",
    subjects: [
      "JEE (Main & Advanced)",
      "NEET",
      "CUET",
      "Olympiad Preparation",
      "NTSE",
      "KVPY",
      "Foundation Courses",
    ],
  },

  languages: {
    label: "Languages",
    subjects: [
      "Spoken English",
      "English Grammar",
      "Hindi Grammar",
      "French",
      "German",
      "Spanish",
      "Japanese",
      "Chinese (Mandarin)",
    ],
  },

  skills_career: {
    label: "Skill & Career Oriented",
    subjects: [
      "Coding for Kids",
      "Python Programming",
      "Java Programming",
      "Web Development",
      "Data Structures & Algorithms",
      "Artificial Intelligence",
      "Machine Learning",
      "Robotics",
      "App Development",
    ],
  },
};

/* =========================
   FLATTENED SUBJECT LIST
   (300+ subjects auto)
========================= */
export const ALL_SUBJECTS: string[] = Object.values(SUBJECT_CATEGORIES)
  .flatMap((category) => category.subjects);

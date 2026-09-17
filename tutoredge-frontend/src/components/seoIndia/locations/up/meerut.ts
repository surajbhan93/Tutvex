// export const city = {
//   name: "Meerut",
//   state: "Uttar Pradesh",

//   // Primary SEO slug
//   slug: "meerut",

//   // Optional SEO aliases
//   aliases: ["meerath"],

//   locations: [
//     // ===== Central / Prime Areas =====
//     "Civil Lines",
//     "Begum Bridge",
//     "Abu Lane",
//     "Delhi Road",
//     "Garh Road",
//     "Hapur Road",

//     // ===== Residential Colonies =====
//     "Shastri Nagar",
//     "Pallavpuram",
//     "Pallavpuram Phase 1",
//     "Pallavpuram Phase 2",
//     "Modipuram",
//     "Jagriti Vihar",
//     "Kanker Khera",
//     "Shradhapuri",
//     "Surajkund",

//     // ===== Old City / Traditional Areas =====
//     "Sadar Bazaar",
//     "Meerut Cantt",
//     "Lisari Gate",
//     "Shahjahanpur",
//     "Khair Nagar",
//     "Zakir Colony",

//     // ===== Education / Student Hubs =====
//     "Meerut College",
//     "Chaudhary Charan Singh University",
//     "CCS University",
//     "Nauchandi Ground Area",
//     "IIMT University",
//     "Subharti University",
//     "Vidya Knowledge Park",

//     // ===== Transport / Connectivity =====
//     "Meerut City Railway Station",
//     "Meerut Cantt Railway Station",
//     "NH 58",
//     "Meerut Bypass",

//     // ===== Developing / Outer Areas =====
//     "Partapur",
//     "Daurala",
//     "Lawar",
//     "Mawana",
//     "Rohta Road",
//     "Sardhana Road",
//   ],
// };
export interface LocationInfo {
  name: string;
  slug: string;
  pincode?: string;
  description: string;
  popularSubjects: string[];
}

export interface CityInfo {
  name: string;
  state: string;
  slug: string;
  tagline: string;
  establishedYear: number;
  activeTutors: number;
  studentsHelped: number;
  averageRating: number;
  totalReviews: number;
  geo: {
    region: string;
    placename: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
  };
  locations: LocationInfo[];
}

export const city: CityInfo = {
  name: "Meerut",
  state: "Uttar Pradesh",
  slug: "meerut",
  tagline: "Meerut's Most Trusted & Verified Home Tutor Network",
  establishedYear: 2014,
  activeTutors: 12450,
  studentsHelped: 48500,
  averageRating: 4.9,
  totalReviews: 3820,
  geo: {
    region: "IN-UP",
    placename: "Meerut",
    latitude: 28.9845,
    longitude: 77.7064,
  },
  contact: {
    phone: "+91 93052 75932",
    email: "tutvexmeerut@tutvex.com",
    // address: "Tutvex Learning Hub, 2nd Floor, Central Market, Shastri Nagar, Meerut, Uttar Pradesh 250004",
    address: "Service Area: Meerut, Uttar Pradesh. Tutvex provides home tuition and personalized learning services across all major localities in Meerut.",
    workingHours: "Monday - Sunday: 8:00 AM - 9:00 PM IST",
  },
  locations: [
    {
      name: "Shastri Nagar",
      slug: "shastri-nagar",
      pincode: "250004",
      description: "Premier residential hub with high demand for CBSE, ICSE, and JEE/NEET home tutors across Class 1 to 12.",
      popularSubjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    },
    {
      name: "Saket",
      slug: "saket",
      pincode: "250001",
      description: "Central Meerut locality known for top-performing students requiring specialized private tutors for boards & competitive exams.",
      popularSubjects: ["Science", "Maths", "English", "Accountancy"],
    },
    {
      name: "Pallavpuram",
      slug: "pallavpuram",
      pincode: "250110",
      description: "Rapidly growing educational destination along NH-58 with dedicated home tutors for primary, secondary, and senior classes.",
      popularSubjects: ["Physics", "Chemistry", "Mathematics", "NEET Biology"],
    },
    {
      name: "Modipuram",
      slug: "modipuram",
      pincode: "250110",
      description: "Hub near premier institutes and schools, ideal for engineering and medical entrance coaching at home.",
      popularSubjects: ["JEE Maths", "NEET Chemistry", "Class 10 Science", "Coding"],
    },
    {
      name: "Rajendra Nagar",
      slug: "rajendra-nagar",
      pincode: "250002",
      description: "Well-connected neighborhood with verified female home tutors and male tutors for all school subjects.",
      popularSubjects: ["Maths", "Science", "Social Studies", "Hindi"],
    },
    {
      name: "Kankerkhera",
      slug: "kankerkhera",
      pincode: "250001",
      description: "Densely populated locality with expert tutors for CBSE Class 9, 10, 11, and 12 board preparations.",
      popularSubjects: ["Physics", "Chemistry", "Mathematics", "Economics"],
    },
    {
      name: "Ganga Nagar",
      slug: "ganga-nagar",
      pincode: "250001",
      description: "Prime residential zone near Mawana Road with certified home tutors for foundation and board courses.",
      popularSubjects: ["Biology", "Chemistry", "English Literature", "Maths"],
    },
    {
      name: "Jagriti Vihar",
      slug: "jagriti-vihar",
      pincode: "250004",
      description: "Established locality in Meerut with high demand for experienced home tutors for Class 6 to 12.",
      popularSubjects: ["Science", "Mathematics", "Commerce", "Accountancy"],
    },
    {
      name: "Central Market",
      slug: "central-market",
      pincode: "250004",
      description: "Bustling core locality in Shastri Nagar with verified home tutors offering flexible evening schedules.",
      popularSubjects: ["Physics", "Mathematics", "Business Studies", "Computer Science"],
    },
    {
      name: "Abu Lane",
      slug: "abu-lane",
      pincode: "250001",
      description: "Central commercial & residential area where parents prefer 1-on-1 personalized home tuition for fast score improvement.",
      popularSubjects: ["English", "Maths", "Science", "French"],
    },
    {
      name: "Suraj Kund",
      slug: "suraj-kund",
      pincode: "250002",
      description: "Historic and active residential neighborhood with dedicated tutors for primary school and board exams.",
      popularSubjects: ["Mathematics", "Science", "Social Studies", "Hindi"],
    },
    {
      name: "Begum Bridge",
      slug: "begum-bridge",
      pincode: "250001",
      description: "Prime city center area with experienced tutors for ICSE, CBSE, and UP Board curricula.",
      popularSubjects: ["Physics", "Chemistry", "Accountancy", "English"],
    },
    {
      name: "Delhi Road",
      slug: "delhi-road",
      pincode: "250002",
      description: "Major arterial location featuring certified tutors for foundation coaching and board exam prep.",
      popularSubjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    },
    {
      name: "Transport Nagar",
      slug: "transport-nagar",
      pincode: "250002",
      description: "Growing locality with affordable and background-verified home tutors for all school subjects.",
      popularSubjects: ["Science", "Maths", "English", "Social Science"],
    },
    {
      name: "Subhash Nagar",
      slug: "subhash-nagar",
      pincode: "250001",
      description: "Family-centric neighborhood requiring qualified female and male private tutors for Class 1 to 10.",
      popularSubjects: ["Mathematics", "Science", "English", "Computers"],
    },
    {
      name: "Shraddhapuri",
      slug: "shraddhapuri",
      pincode: "250001",
      description: "Modern colony with high demand for one-on-one home tuition for Class 11-12 Physics and Chemistry.",
      popularSubjects: ["Physics", "Chemistry", "Maths", "Biology"],
    },
    {
      name: "Brahmpuri",
      slug: "brahmpuri",
      pincode: "250002",
      description: "Vibrant neighborhood with dedicated private teachers for ICSE & CBSE board exam prep.",
      popularSubjects: ["Mathematics", "Science", "History", "Civics"],
    },
    {
      name: "Victoria Park Area",
      slug: "victoria-park",
      pincode: "250001",
      description: "Serene residential zone near Sports Complex with subject-matter specialist home tutors.",
      popularSubjects: ["Biology", "Chemistry", "Physics", "Maths"],
    },
    {
      name: "Malayiana",
      slug: "malayiana",
      pincode: "250002",
      description: "Key residential pocket offering top-tier home tuition for primary and secondary grade students.",
      popularSubjects: ["Maths", "Science", "English", "Hindi"],
    },
    {
      name: "Roorkee Road",
      slug: "roorkee-road",
      pincode: "250001",
      description: "Educational corridor connecting Modipuram with expert home tutors for JEE Advanced & NEET prep.",
      popularSubjects: ["JEE Physics", "JEE Maths", "NEET Biology", "NEET Chemistry"],
    },
    {
      name: "Garh Road",
      slug: "garh-road",
      pincode: "250004",
      description: "Major educational hub with access to senior school faculties and expert private tutors.",
      popularSubjects: ["Accountancy", "Economics", "Business Studies", "Maths"],
    },
    {
      name: "Medical College Area",
      slug: "medical-college-area",
      pincode: "250004",
      description: "Popular residential sector for medical aspirants requiring top NEET Biology & Chemistry tutors.",
      popularSubjects: ["NEET Biology", "Chemistry", "Physics", "Zoology"],
    },
    {
      name: "University Road",
      slug: "university-road",
      pincode: "250004",
      description: "Near CCS University, providing university student mentors and certified school tutors.",
      popularSubjects: ["Physics", "Mathematics", "English", "Computer Application"],
    },
    {
      name: "Lawar Road",
      slug: "lawar-road",
      pincode: "250001",
      description: "Expanding northern locality with skilled home tutors for conceptual clarity and regular testing.",
      popularSubjects: ["Maths", "Science", "Social Science", "English"],
    },
    {
      name: "Defense Colony",
      slug: "defense-colony",
      pincode: "250001",
      description: "Elite residential zone with high preference for experienced, verified home tutors and lady tutors.",
      popularSubjects: ["Mathematics", "Physics", "Chemistry", "English Literature"],
    },
  ],
};

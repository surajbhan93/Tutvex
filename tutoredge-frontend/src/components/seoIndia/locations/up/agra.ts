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
  aliases: string[];
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

const rawLocations = [
  // ===== Central / Prime Areas =====
  { name: "Sadar Bazaar", pincode: "282001", desc: "Premier commercial and residential hub in Agra Cantonment with high demand for CBSE and ICSE home tutors." },
  { name: "Civil Lines", pincode: "282002", desc: "Prime central locality in Agra known for top academic performers requiring specialized 1-on-1 private tuition." },
  { name: "Raja Ki Mandi", pincode: "282002", desc: "Bustling central area near major educational institutions with expert tutors for school boards and entrance prep." },
  { name: "Hing Ki Mandi", pincode: "282003", desc: "Densely populated historic commercial zone requiring background-verified tutors for Class 1 to 10." },
  { name: "Mantola", pincode: "282003", desc: "Central neighborhood with experienced home tutors for primary, middle, and secondary school subjects." },
  { name: "Chhipitola", pincode: "282001", desc: "Key central location offering dedicated home tutors for Math, Science, and English foundational concepts." },

  // ===== Residential Areas =====
  { name: "Kamla Nagar", pincode: "282005", desc: "Agra's largest upscale residential locality with high demand for Class 10/12 board and JEE/NEET tutors." },
  { name: "Dayalbagh", pincode: "282005", desc: "Serene academic hub home to DEI, requiring expert home tutors in Mathematics, Physics, and Chemistry." },
  { name: "Shahganj", pincode: "282010", desc: "Major residential sector with certified home tutors for CBSE, ICSE, and UP Board students." },
  { name: "Bodla", pincode: "282007", desc: "Rapidly growing residential sector with verified female and male tutors for Class 1 to 12." },
  { name: "Lohamandi", pincode: "282002", desc: "Established neighborhood with experienced tutors for Class 9-10 board exams and science subjects." },
  { name: "Khandari", pincode: "282002", desc: "Educational hotspot near University campus with experienced private tutors for competitive exams." },
  { name: "Vijay Nagar", pincode: "282004", desc: "Family-centric residential colony with qualified home tutors for primary and secondary classes." },
  { name: "Azad Nagar", pincode: "282002", desc: "Well-connected locality with verified home tuition teachers for daily homework support and revision." },

  // ===== Taj Side / Tourist Areas =====
  { name: "Taj Ganj", pincode: "282001", desc: "Historic locality surrounding the Taj Mahal with dedicated tutors for English, Science, and Mathematics." },
  { name: "Fatehabad Road", pincode: "282001", desc: "Modern residential & commercial corridor with high demand for experienced 1-on-1 private tutors." },
  { name: "Shilpgram", pincode: "282001", desc: "Cultural and residential zone near Eastern Taj Gate requiring foundation tutors for school students." },
  { name: "Agra Fort Area", pincode: "282003", desc: "Historic core locality with certified home tutors for ICSE, CBSE, and UP Board curricula." },

  // ===== Education / Institutional =====
  { name: "Dayalbagh Educational Institute", pincode: "282005", desc: "Prominent educational hub surrounded by student colonies needing advanced subject mentor tutors." },
  { name: "DEI Campus", pincode: "282005", desc: "Institutional zone with university student mentors and certified school subject specialists." },
  { name: "Dr Bhimrao Ambedkar University", pincode: "282004", desc: "University area providing expert academic tutors for senior secondary and competitive entrance exams." },
  { name: "Agra University", pincode: "282004", desc: "Core educational precinct offering top-tier home tuition for Physics, Chemistry, Maths, and Biology." },
  { name: "St Johns College", pincode: "282002", desc: "Heritage educational sector with demand for specialized Commerce, Accountancy, and Science tutors." },
  { name: "Anand Engineering College Area", pincode: "283101", desc: "Engineering corridor along NH-19 with expert tutors for JEE Physics and Mathematics." },

  // ===== Transport / Cantonment =====
  { name: "Agra Cantt", pincode: "282001", desc: "Defense & cantonment locality with qualified, background-verified home tutors for all school grades." },
  { name: "Agra Cantonment", pincode: "282001", desc: "Secure residential cantonment zone requiring punctual female and male tutors for CBSE & ICSE." },
  { name: "Idgah", pincode: "282001", desc: "Central transport hub locality with easy access to home tutors for Class 6 to 12." },
  { name: "Agra Fort Railway Station", pincode: "282003", desc: "Central city sector with experienced tutors for quick concept building and board revisions." },
  { name: "ISBT Agra", pincode: "282007", desc: "Major transport hub area connecting modern residential colonies with verified home tutors." },

  // ===== Developing / Outer Areas =====
  { name: "Sikandra", pincode: "282007", desc: "Major residential and commercial growth zone along NH-19 with high demand for home tuition." },
  { name: "Runakta", pincode: "282007", desc: "Expanding western suburb with affordable, certified home tutors for primary and secondary school." },
  { name: "Kuberpur", pincode: "283201", desc: "Yamuna Expressway junction locality with emerging residential colonies needing foundation tutors." },
  { name: "Etmadpur", pincode: "283202", desc: "Eastern suburban area of Agra offering dedicated home tutors for school boards and entrance tests." },
  { name: "Rohta", pincode: "282009", desc: "Southern residential suburb with verified home tutors for Class 1 to 10 conceptual teaching." },
  { name: "Trans Yamuna Colony", pincode: "282006", desc: "Dense residential colony across Yamuna River requiring experienced private tutors for all subjects." },
];

export const city: CityInfo = {
  name: "Agra",
  state: "Uttar Pradesh",
  slug: "agra",
  aliases: ["taj city", "taj nagri"],
  tagline: "Agra's Most Trusted & Verified Home Tutor Network",
  establishedYear: 2014,
  activeTutors: 11800,
  studentsHelped: 44200,
  averageRating: 4.9,
  totalReviews: 3540,
  geo: {
    region: "IN-UP",
    placename: "Agra",
    latitude: 27.1767,
    longitude: 78.0081,
  },
  contact: {
    phone: "+91 98765 43210",
    email: "agra@tutvex.com",
    address: "Tutvex Learning Center, 2nd Floor, Block 4, Kamla Nagar, Agra, Uttar Pradesh 282005",
    workingHours: "Monday - Sunday: 8:00 AM - 9:00 PM IST",
  },
  locations: rawLocations.map((item) => ({
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    pincode: item.pincode,
    description: item.desc,
    popularSubjects: ["Mathematics", "Science", "Physics", "Chemistry", "English"],
  })),
};

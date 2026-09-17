export interface LocalAreaDetail {
  name: string;
  pincode: string;
  nearbyLandmarks: string[];
  schools: string[];
  colleges: string[];
  
  coachingHubs: string[];
  transportHubs: string[];
  popularColonies: string[];
  geo: {
    latitude: number;
    longitude: number;
  };
}

export const ALLAHABAD_LOCALITY_DETAILS: Record<string, LocalAreaDetail> = {
  "civil-lines": {
    name: "Civil Lines",
    pincode: "211001",
    nearbyLandmarks: ["Subhash Chauraha", "High Court Allahabad", "Hanuman Mandir", "Elgin Road", "Thornhill Road"],
    schools: ["Boys' High School & College (BHS)", "St. Joseph's College", "Mary Lucas School", "Girls' High School (GHS)"],
    colleges: ["Motilal Nehru Medical College", "ECC Allahabad", "Bishop Johnson College"],
    coachingHubs: ["Civil Lines UPSC & State PCS Hub", "IIT JEE Medical Coaching Center", "Tagore Town Commerce Hub"],
    transportHubs: ["Civil Lines Central Bus Station", "Prayagraj Junction (2.1 km)", "Subedarganj Railway Station"],
    popularColonies: ["Tashkant Marg", "MG Marg", "Nawab Yusuf Road", "Clive Road", "Lal Bahadur Shastri Marg"],
    geo: { latitude: 25.4526, longitude: 81.8349 },
  },
  "katra": {
    name: "Katra",
    pincode: "211002",
    nearbyLandmarks: ["University of Allahabad Arts Campus", "Anand Bhawan", "Swaraj Bhawan", "Lakshmi Talkies Chauraha"],
    schools: ["Colonelganj Inter College", "MPVM Allahabad", "CAV Inter College"],
    colleges: ["University of Allahabad (AU Main Campus)", "Ewing Christian College (ECC)", "Chintamani Commerce Institute"],
    // collegesList: ["University of Allahabad (AU)", "ECC"],
    coachingHubs: ["Katra Student Coaching Market", "Netaji Subhash Library Zone", "Allahabad University Prep Hub"],
    transportHubs: ["Prayagraj Rambagh Station", "University Bus Stop", "Civil Lines Bus Stand (3 km)"],
    popularColonies: ["Old Katra", "New Katra", "Netaji Subhash Chandra Bose Nagar", "Colonelganj"],
    geo: { latitude: 25.4612, longitude: 81.8542 },
  },
  "naini": {
    name: "Naini",
    pincode: "211008",
    nearbyLandmarks: ["New Yamuna Bridge (Naini Setu)", "Triveni Sangam view point", "Saraswati Hi-Tech City", "Mewalal Chauraha"],
    schools: ["Bethany Convent School", "St. John's Co-Ed School", "Delhi Public School (DPS Naini)"],
    colleges: ["SHUATS (Sam Higginbottom University)", "United Group of Institutions", "LDC Institute of Technology"],
    coachingHubs: ["Naini Industrial Education Hub", "Mahewa Academic Classes", "SHUATS Gateway Coaching"],
    transportHubs: ["Naini Junction Railway Station", "Chaka Bus Stand", "Yamuna Bridge Depot"],
    popularColonies: ["ADA Colony", "Mahewa", "Karchana Road", "Chaka", "Trivenipuram Extension"],
    geo: { latitude: 25.4074, longitude: 81.8597 },
  },
  "jhusi": {
    name: "Jhusi",
    pincode: "211019",
    nearbyLandmarks: ["Shastri Bridge", "Kumbh Mela Area Ground", "Ulta Qila", "Andawa Chauraha"],
    schools: ["Kendriya Vidyalaya Jhusi", "Dev Prayag Public School", "St. Peter's School Jhusi"],
    colleges: ["Harish-Chandra Research Institute (HRI)", "Government PG College Jhusi"],
    coachingHubs: ["Andawa Commerce & Science Hub", "Jhusi Station Road Institute"],
    transportHubs: ["Jhusi Railway Station", "Andawa Bus Terminal", "Shastri Bridge Auto Hub"],
    popularColonies: ["Trivenipuram", "Jhusi Kohna", "Jhusi Railway Colony", "Nyaya Nagar"],
    geo: { latitude: 25.4338, longitude: 81.9056 },
  },
  "teliarganj": {
    name: "Teliarganj",
    pincode: "211004",
    nearbyLandmarks: ["MNNIT Main Campus", "Sangam Petrol Pump", "Ganga Barrage Road", "Rasoolabad Ghat"],
    schools: ["MNNIT Campus School", "St. Anthony's Convent", "Government Girls Inter College"],
    colleges: ["Motilal Nehru National Institute of Technology (MNNIT)", "Northern Regional Institute of Printing Technology"],
    coachingHubs: ["MNNIT GATE & Engineering Coaching Hub", "Teliarganj Science Forum"],
    transportHubs: ["Prayagraj Sangam Station", "Phaphamau Junction (4 km)", "Teliyarganj Bus Stop"],
    popularColonies: ["Shivkuti", "Govindpur", "Rasoolabad", "Chandpur Salori"],
    geo: { latitude: 25.4891, longitude: 81.8643 },
  },
  "dhoomanganj": {
    name: "Dhoomanganj",
    pincode: "211011",
    nearbyLandmarks: ["Subedarganj Railway Junction", "Transport Nagar", "Air Force Station Bamrauli Road"],
    schools: ["Kendriya Vidyalaya Manauri", "St. Mary's Convent School Bamrauli"],
    colleges: ["Prayag Institute of Technology", "Bamrauli Aviation & Degree College"],
    coachingHubs: ["Dhoomanganj Railway & Defence Exam Prep", "Transport Nagar Academic Hub"],
    transportHubs: ["Subedarganj Station", "Bamrauli Airport Area", "GT Road Auto Stand"],
    popularColonies: ["Preetam Nagar", "Rajrooppur", "Sulem Sarai", "Jayantipur"],
    geo: { latitude: 25.4519, longitude: 81.7824 },
  },
  "george-town": {
    name: "George Town",
    pincode: "211002",
    nearbyLandmarks: ["Kamla Nehru Hospital", "Lowther Road", "Tagore Town Park", "Medical College Chauraha"],
    schools: ["St. Mary's Convent Inter College (SMC)", "BHS Primary Section"],
    colleges: ["Motilal Nehru Medical College", "Swarup Rani Nehru Hospital Campus"],
    coachingHubs: ["George Town Medical & Commerce Academy", "Lowther Road Tutors"],
    transportHubs: ["Rambagh Station (1.2 km)", "Civil Lines Bus Stand (2 km)"],
    popularColonies: ["Tagore Town", "Lowther Road Colony", "Hashimpur", "SoHBatia Bagh"],
    geo: { latitude: 25.4468, longitude: 81.8541 },
  },
};

export const DEFAULT_LOCALITY_DETAIL: LocalAreaDetail = {
  name: "Allahabad Central",
  pincode: "211001",
  nearbyLandmarks: ["Civil Lines", "University of Allahabad", "High Court", "Subhash Chauraha", "Anand Bhawan"],
  schools: ["Boys' High School", "St. Joseph's College", "St. Mary's Convent", "MPVM Allahabad"],
  colleges: ["University of Allahabad (AU)", "MNNIT Allahabad", "Motilal Nehru Medical College"],
  coachingHubs: ["Civil Lines Educational Zone", "Katra Student Hub", "Tagore Town Academy"],
  transportHubs: ["Prayagraj Junction", "Civil Lines Central Bus Stand", "Subedarganj Railway Station"],
  popularColonies: ["Civil Lines", "Katra", "George Town", "Tagore Town", "Preetam Nagar", "Naini"],
  geo: { latitude: 25.4358, longitude: 81.8463 },
};

export function getLocalityDetail(locationSlug: string): LocalAreaDetail {
  const normalizedKey = locationSlug.toLowerCase().trim().replace(/\s+/g, "-");
  if (ALLAHABAD_LOCALITY_DETAILS[normalizedKey]) {
    return ALLAHABAD_LOCALITY_DETAILS[normalizedKey];
  }
  // Generic fallback with natural locality capitalization
  const cleanName = locationSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    ...DEFAULT_LOCALITY_DETAIL,
    name: cleanName,
  };
}

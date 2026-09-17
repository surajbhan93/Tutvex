export const chatbotIntents = [
  /* ===================== SERVICE ===================== */
  {
    intent: "service_availability",
    keywords: [
      "service",
      "available",
      "india",
      "online",
      "available hai",
      "milti hai",
      "all india",
    ],
    roles: ["guest", "parent", "student"],
    answers: {
      en: "Tutvex provides online tutoring services across India and offline services in selected cities.",
      hi: "Tutvex poore India me online tutoring aur kuch shahron me offline service deta hai.",
    },
  },

  {
    intent: "offline_cities",
    keywords: [
      "offline",
      "office",
      "city",
      "branch",
      "kaha",
      "location",
    ],
    roles: ["guest", "parent", "student"],
    answers: {
      en: "Offline tutoring is available in Meerut, Lucknow, Varanasi, Noida, Prayagraj (Allahabad), Kanpur and Agra.",
      hi: "Offline tutoring Meerut, Lucknow, Varanasi, Noida, Prayagraj (Allahabad), Kanpur aur Agra me uplabdh hai.",
    },
  },

  /* ===================== FEES ===================== */
  {
    intent: "fees",
    keywords: [
      "fees",
      "fee",
      "charges",
      "kitni",
      "paisa",
      "amount",
      "price",
    ],
    roles: ["guest", "parent", "student"],
    answers: {
      en: "Fees range between ₹2000 to ₹8000 depending on subject and location.",
      hi: "Fees ₹2000 se ₹8000 ke beech hoti hai, subject aur location par depend karta hai.",
    },
  },

  /* ===================== ABOUT ===================== */
  {
    intent: "about",
    keywords: [
      "about",
      "about tutvex",
      "company",
      "platform",
      "tutvex kya hai",
      "detail",
    ],
    roles: ["guest", "parent", "student", "tutor"],
    answers: {
      en: "You can learn more about Tutvex here:\nhttps://tutvex.com/about/",
      hi: "Tutvex ke baare me aur jaankari yahan milegi:\nhttps://tutvex.com/about/",
    },
  },

  /* ===================== CONTACT ===================== */
  {
    intent: "contact",
    keywords: [
      "contact",
      "support",
      "help",
      "number",
      "whatsapp",
      "phone",
      "email",
      "sampark",
    ],
    roles: ["guest", "parent", "student", "tutor"],
    answers: {
      en:
        "You can contact Tutvex in the following ways:\n\n" +
        "📞 WhatsApp: 9305275932 (India)\n" +
        "📧 Email: tutvex@gmail.com\n" +
        "📧 Admin: admin@tutvex.com\n\n" +
        "Contact page:\nhttps://tutvex.com/contact/",
      hi:
        "Aap Tutvex se in tareeko se sampark kar sakte hain:\n\n" +
        "📞 WhatsApp: 9305275932 (India)\n" +
        "📧 Email: tutvex@gmail.com\n" +
        "📧 Admin: admin@tutvex.com\n\n" +
        "Contact page:\nhttps://tutvex.com/contact/",
    },
  },

  /* ===================== FIND TUTOR ===================== */
  {
    intent: "find_tutor",
    keywords: [
      "tutor chahiye",
      "find tutor",
      "home tutor",
      "online tutor",
      "teacher chahiye",
      "tutor kaise milega",
    ],
    roles: ["guest", "parent", "student"],
    answers: {
      en:
        "To find a tutor, please register here:\n" +
        "https://tutvex.com/find-tutor-flow/create-account/?source=MOBILE_NAV&campaign=FIND_TUTOR",
      hi:
        "Tutor dhoondhne ke liye yahan registration karein:\n" +
        "https://tutvex.com/find-tutor-flow/create-account/?source=MOBILE_NAV&campaign=FIND_TUTOR",
    },
  },

  /* ===================== TUTOR REGISTRATION ===================== */
  {
    intent: "tutor_registration",
    keywords: [
      "tutor kaise bane",
      "register tutor",
      "tutor registration",
      "teacher kaise bane",
      "tutor join",
      "tutor signup",
    ],
    roles: ["guest", "tutor"],
    answers: {
      en:
        "To become a tutor, please register using this link:\n" +
        "https://tutvex.com/tutor-flow/tutor-registration/?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR",
      hi:
        "Tutor banne ke liye is link se registration karein:\n" +
        "https://tutvex.com/tutor-flow/tutor-registration/?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR",
    },
  },

  /* ===================== TUTOR SELECTION ===================== */
  {
    intent: "tutor_selection",
    keywords: [
      "interview",
      "documents",
      "verification",
      "selection",
      "process",
    ],
    roles: ["tutor"],
    answers: {
      en:
        "Tutor selection process:\n" +
        "1️⃣ Registration\n2️⃣ Interview (within 2 days)\n3️⃣ Document verification\n4️⃣ Final selection",
      hi:
        "Tutor selection process:\n" +
        "1️⃣ Registration\n2️⃣ 2 din ke andar interview\n3️⃣ Documents verification\n4️⃣ Final selection",
    },
  },


/* ===================== COMPANY TRUST ===================== */
{
  intent: "company_trust",
  keywords: [
    "trust",
    "trusted",
    "safe",
    "genuine",
    "real",
    "fake",
    "fraud",
    "scam",
    "bharosa",
  ],
  roles: ["guest", "parent", "student", "tutor"],
  answers: {
    en:
      "Tutvex is a trusted and genuine tutoring platform. All tutors go through verification and interview processes. Thousands of parents and students use our services across India.",
    hi:
      "Tutvex ek trusted aur genuine tutoring platform hai. Yahan sabhi tutors ka interview aur verification hota hai. Hazaron parents aur students poore India me humari service use kar rahe hain.",
  },
},

/* ===================== COMPANY RATING ===================== */
{
  intent: "company_rating",
  keywords: [
    "rating",
    "5 star",
    "reviews",
    "feedback",
    "best",
    "top",
    "popular",
  ],
  roles: ["guest", "parent", "student", "tutor"],
  answers: {
    en:
      "Tutvex has received excellent feedback and 5-star ratings from parents, students, and tutors due to quality service, verified tutors, and responsive support.",
    hi:
      "Tutvex ko parents, students aur tutors se 5-star rating aur positive feedback mila hai, kyunki hum quality service, verified tutors aur fast support dete hain.",
  },
},

/* ===================== COMPANY GROWTH ===================== */
{
  intent: "company_growth",
  keywords: [
    "growth",
    "1 year",
    "one year",
    "fast growth",
    "7 cities",
    "kaise grow",
    "itni jaldi",
  ],
  roles: ["guest", "parent", "student", "tutor"],
  answers: {
    en:
      "Tutvex has grown rapidly within just one year and is now active in 7 major cities. This growth reflects strong trust from parents, students, and tutors.",
    hi:
      "Tutvex ne sirf 1 saal me tez growth ki hai aur ab 7 major cities me active hai. Ye growth parents, students aur tutors ke trust ko dikhati hai.",
  },
},

/* ===================== DOUBT CLEARING (STRONG ANSWER) ===================== */
{
  intent: "company_doubt",
  keywords: [
    "doubt",
    "confusion",
    "sure",
    "reliable",
    "sahi hai",
    "chal rahi hai",
    "kaam kar rahi",
  ],
  roles: ["guest", "parent", "student", "tutor"],
  answers: {
    en:
      "If Tutvex were not reliable or genuine, it would not have grown to top positions in 7 cities within a year. Our success comes from transparent processes, verified tutors, and satisfied parents.",
    hi:
      "Agar Tutvex reliable ya genuine nahi hoti, to sirf 1 saal me 7 cities me top par nahi hoti. Humari growth transparent process, verified tutors aur satisfied parents ki wajah se hai.",
  },
},

/* ===================== WHY TUTVEX IS BEST ===================== */
{
  intent: "why_best",
  keywords: [
    "why tutvex",
    "why best",
    "kyu best",
    "kyu choose kare",
    "better than others",
  ],
  roles: ["guest", "parent", "student", "tutor"],
  answers: {
    en:
      "Tutvex stands out due to verified tutors, wide city coverage, affordable fees, quick support, and trusted service across India.",
    hi:
      "Tutvex isliye best hai kyunki yahan verified tutors, multiple cities coverage, affordable fees aur fast support milta hai.",
  },
},

/* ===================== LEGITIMACY CONFIRMATION ===================== */
{
  intent: "company_legit",
  keywords: [
    "legal",
    "registered",
    "company registered",
    "official",
    "authentic",
  ],
  roles: ["guest", "parent", "student", "tutor"],
  answers: {
    en:
      "Tutvex operates as a legitimate and professionally managed tutoring platform with proper verification, support systems, and transparent policies.",
    hi:
      "Tutvex ek legitimate aur professionally managed tutoring platform hai jisme proper verification, support system aur transparent policies hain.",
  },
},


  /* ===================== TUTOR EARNING ===================== */
  {
    intent: "tutor_earning",
    keywords: [
      "earning",
      "salary",
      "income",
      "payment",
      "kitna kama",
    ],
    roles: ["tutor"],
    answers: {
      en: "Tutors can earn between ₹2000 to ₹8000 per student.",
      hi: "Tutor har student se ₹2000 se ₹8000 tak kama sakte hain.",
    },
  },

  /* ===================== FUN / LOVE GUIDANCE ===================== */
{
  intent: "love_guidance",
  keywords: [
    "pyar",
    "pyaar",
    "love",
    "crush",
    "girlfriend",
    "boyfriend",
    "relationship",
    "breakup",
    "mohabbat",
    "ishq",
    "propose",
    "heartbreak",
    "dil tut gaya",
    "single",
    "date",
    "romance"
  ],
  roles: ["guest", "student"],
  answers: {
    en:
      "Pyar aur mohabbat life ka ek part ho sakta hai, lekin abhi padhai aur career par focus karna zyada important hai 😊. " +
      "Strong future banega to right person apne aap life me aa jayega. Keep learning, keep growing! 🚀",
    hi:
      "Pyar-mohabbat life ka hissa ho sakti hai, lekin is waqt padhai aur career par focus karna zyada zaroori hai 😊. " +
      "Jab future strong hoga, sahi insaan khud-ba-khud life me aa jayega. Padhai par dhyaan do aur aage badho! 🚀",
  },
},

 /* ===================== FUN / CRUSH (GEN-Z) ===================== */
{
  intent: "love_crush_fun",
  keywords: [
    "crush",
    "pasand hai",
    "like someone",
    "proposal",
    "propose",
    "one sided",
    "attraction",
    "feelings aa rahi",
    "school crush",
    "college crush"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "Having a crush is normal 😄💘. But remember — marks, skills, and career come first 📚🔥. " +
      "Build yourself first, crush baad me bhi impress ho jayega 😉✨",
    hi:
      "Crush aana bilkul normal hai 😄💘. Lekin yaad rakho — padhai, skills aur career pehle aata hai 📚🔥. " +
      "Khud ko strong banao, crush baad me khud impress ho jayega 😉✨",
  },
},

 /* ===================== FUN / BREAKUP SUPPORT ===================== */
{
  intent: "love_breakup_support",
  keywords: [
    "breakup",
    "heartbreak",
    "dil tut gaya",
    "sad",
    "depressed",
    "move on",
    "ex",
    "akela lag raha",
    "emotional",
    "cry aa raha"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "Breakups hurt 💔, but they also make you stronger 💪. " +
      "Right now, focus on yourself — padhai, health, growth 🚀. " +
      "This phase will pass, and you’ll come back even stronger ✨",
    hi:
      "Breakup dard deta hai 💔, lekin ye aapko strong bhi banata hai 💪. " +
      "Abhi apne upar focus karo — padhai, health aur growth 🚀. " +
      "Ye phase bhi nikal jayega, aur aap aur zyada strong ban kar nikloge ✨",
  },
},

 /* ===================== PARENT CONCERN / DISTRACTION ===================== */
{
  intent: "parent_distraction_concern",
  keywords: [
    "distracted",
    "mobile",
    "love affair",
    "focus nahi",
    "attention",
    "padhai me man nahi",
    "child distracted",
    "galat sangat",
    "time waste"
  ],
  roles: ["parent"],
  answers: {
    en:
      "We understand parents’ concerns 🙏. Distractions are common at this age. " +
      "With proper guidance, routine, and academic support, students regain focus quickly 📘✨. " +
      "Tutvex ensures disciplined learning and positive mentoring.",
    hi:
      "Parents ki chinta bilkul sahi hoti hai 🙏. Is age me thoda distraction common hota hai. " +
      "Sahi guidance, routine aur academic support se bachche jaldi focus regain kar lete hain 📘✨. " +
      "Tutvex disciplined learning aur positive mentoring par focus karta hai.",
  },
},

/* ===================== FUN / SARCASTIC ROAST ===================== */
{
  intent: "fun_roast",
  keywords: [
    "roast",
    "funny",
    "majak",
    "joke",
    "taunt",
    "sarcastic",
    "roast me",
    "hasao",
    "entertain"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "You want a roast? 😏🔥\n" +
      "Career: waiting ⏳ | Padhai: pending 📚 | Crush: online 💔😄\n" +
      "Chalo pehle future bana lete hain, phir swag ke saath entry maarenge 😎🚀",
    hi:
      "Roast chahiye? 😏🔥\n" +
      "Career: wait kar raha ⏳ | Padhai: pending 📚 | Crush: online 💔😄\n" +
      "Pehle future set karte hain, phir full swag ke saath entry maarenge 😎🚀",
  },
},

/* ===================== MOOD / SAD ===================== */
{
  intent: "mood_sad",
  keywords: [
    "sad",
    "low",
    "down",
    "boring",
    "akela",
    "mann nahi lag raha",
    "tired",
    "frustrated",
    "stress"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "It’s okay to feel low sometimes 😌. Take a deep breath 🌬️. " +
      "Small steps, daily effort, and consistency will fix everything 💪✨",
    hi:
      "Kabhi-kabhi low feel karna normal hai 😌. Ek deep breath lo 🌬️. " +
      "Chhote steps aur daily effort se sab theek ho jata hai 💪✨",
  },
},

/* ===================== MOOD / HAPPY ===================== */
{
  intent: "mood_happy",
  keywords: [
    "happy",
    "excited",
    "mast",
    "maja aa raha",
    "good mood",
    "energetic",
    "motivated"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "That’s the spirit 😄🔥! Use this energy wisely — study smart, grow fast, and win big 🏆🚀",
    hi:
      "Wah! Ye hui na baat 😄🔥! Is energy ko sahi jagah lagao — smart padhai, fast growth aur big win 🏆🚀",
  },
},


/* ===================== MOOD / ANGRY ===================== */
{
  intent: "mood_angry",
  keywords: [
    "angry",
    "gussa",
    "irritated",
    "annoyed",
    "chidh",
    "frustration"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "Gussa aa raha hai? 😤 Chill bro. Gussa waste hai, growth valuable hai 💡. " +
      "Calm mind = better decisions 💪",
    hi:
      "Gussa aa raha hai? 😤 Chill bro. Gussa waste hai, growth valuable hai 💡. " +
      "Shaant dimag = better decisions 💪",
  },
},

/* ===================== MOOD / LAZY ===================== */
{
  intent: "mood_lazy",
  keywords: [
    "lazy",
    "alas",
    "neend",
    "kal karenge",
    "baad me",
    "man nahi"
  ],
  roles: ["student", "guest"],
  answers: {
    en:
      "Lazy mode detected 😴⚠️. Future version of you is already disappointed 😄. " +
      "5 minutes start karo, flow aa jayega 🚀",
    hi:
      "Lazy mode detected 😴⚠️. Future wala tum already disappointed hai 😄. " +
      "Bas 5 minute start karo, flow aa jayega 🚀",
  },
},

/* ===================== SUBJECTS ===================== */
{
  intent: "subjects",
  keywords: [
    "subjects",
    "course",
    "padhate",
    "maths",
    "physics",
    "chemistry",
    "science",
    "english"
  ],
  roles: ["guest", "parent", "student"],
  answers: {
    en:
      "Tutvex offers tutoring for Maths, Science, Physics, Chemistry, Biology, English and more.",
    hi:
      "Tutvex Maths, Science, Physics, Chemistry, Biology, English jaise subjects ke liye tutoring deta hai.",
  },
},

/* ===================== CLASSES & BOARDS ===================== */
{
  intent: "classes_boards",
  keywords: [
    "class",
    "board",
    "cbse",
    "icse",
    "state board",
    "10th",
    "12th"
  ],
  roles: ["guest", "parent", "student"],
  answers: {
    en:
      "Tutvex provides tutoring from Class 6 to 12 for CBSE, ICSE, and State Boards.",
    hi:
      "Tutvex Class 6 se 12 tak CBSE, ICSE aur State Boards ke liye tutoring deta hai.",
  },
},

/* ===================== ONLINE VS OFFLINE ===================== */
{
  intent: "online_offline",
  keywords: [
    "online or offline",
    "home tuition",
    "online better",
    "offline better",
    "ghar pe"
  ],
  roles: ["guest", "parent", "student"],
  answers: {
    en:
      "Tutvex offers both online tutoring and offline home tuition. You can choose based on your convenience.",
    hi:
      "Tutvex online tutoring aur offline home tuition dono options deta hai. Aap apni convenience ke hisaab se choose kar sakte hain.",
  },
},

/* ===================== DEMO CLASS ===================== */
{
  intent: "demo_class",
  keywords: [
    "demo",
    "trial",
    "free class",
    "demo class",
    "pehle class"
  ],
  roles: ["parent", "student"],
  answers: {
    en:
      "Yes, demo classes are available so you can evaluate the tutor before continuing.",
    hi:
      "Haan, demo class available hoti hai jisse aap tutor ko pehle evaluate kar sakte hain.",
  },
},


/* ===================== CLASS TIMING ===================== */
{
  intent: "class_timing",
  keywords: [
    "timing",
    "schedule",
    "time",
    "kab class",
    "kitne baje"
  ],
  roles: ["parent", "student"],
  answers: {
    en:
      "Class timings are flexible and decided based on student and tutor availability.",
    hi:
      "Class timing student aur tutor ki availability ke according flexible hoti hai.",
  },
},

/* ===================== PAYMENT MODES ===================== */
{
  intent: "payment_modes",
  keywords: [
    "payment",
    "pay",
    "upi",
    "cash",
    "online payment"
  ],
  roles: ["parent", "student", "tutor"],
  answers: {
    en:
      "Payments can be made via UPI, bank transfer, or other online payment methods.",
    hi:
      "Payment UPI, bank transfer aur other online modes ke through ki ja sakti hai.",
  },
},


/* ===================== REFUND POLICY ===================== */
{
  intent: "refund_policy",
  keywords: [
    "refund",
    "cancel",
    "cancellation",
    "return",
    "money back"
  ],
  roles: ["parent", "student"],
  answers: {
    en:
      "Refund or cancellation requests are handled as per Tutvex policies. Please contact support for details.",
    hi:
      "Refund ya cancellation Tutvex policies ke according hota hai. Details ke liye support se contact karein.",
  },
},



  /* ===================== CASHBACK ===================== */
  {
    intent: "cashback",
    keywords: [
      "cashback",
      "100",
      "offer",
      "benefit",
      "discount",
    ],
    roles: ["parent", "student"],
    answers: {
      en: "You will get ₹100 cashback on successful enrollment.",
      hi: "Successful enrollment par aapko ₹100 cashback milega.",
    },
  },
];

import { useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";
import { 
  User, BookOpen, MapPin, DollarSign, 
  Clock, Save, ArrowLeft, Loader, Zap, Phone, Mail
} from "lucide-react";
import { getAllStates, getCitiesForState } from "@/data/indianLocations";

export default function CreateLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [suggestedPincodes, setSuggestedPincodes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    studentClass: "",
    board: "",
    schoolName: "",
    subject: "",
    teachingMode: "online",
    city: "",
    area: "",
    state: "",
    pincode: "",
    budget: "",
    budgetType: "per_month",
    preferredTime: "",
    additionalRequirements: "",
    urgency: "flexible",
    availability: "active", // "active" or "already_filled"
    creditsRequired: "3",
    maxUnlocks: "10",
  });

  // Fetch pincodes when city is selected
  const fetchPincodesForCity = async (cityName: string) => {
    if (!cityName) {
      setSuggestedPincodes([]);
      return;
    }

    try {
      setLoadingPincode(true);
      
      // Map of alternate city names for API (old names, spelling variations)
      const cityNameMap: { [key: string]: string[] } = {
        "Prayagraj": ["Allahabad", "Prayagraj"],
        "Varanasi": ["Banaras", "Varanasi", "Benares"],
        "Mumbai": ["Bombay", "Mumbai"],
        "Kolkata": ["Calcutta", "Kolkata"],
        "Chennai": ["Madras", "Chennai"],
        "Bengaluru": ["Bangalore", "Bengaluru"],
        "Pune": ["Poona", "Pune"],
        "Thiruvananthapuram": ["Trivandrum", "Thiruvananthapuram"]
      };

      // Get alternate names or use original
      const searchNames = cityNameMap[cityName] || [cityName];
      
      let allPincodes: string[] = [];
      
      // Try all alternate names
      for (const searchName of searchNames) {
        try {
          const response = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(searchName)}`);
          const data = await response.json();
          
          if (data && data[0]?.Status === "Success" && data[0]?.PostOffice) {
            // Extract unique pincodes
            const pincodes = data[0].PostOffice.map((po: any) => po.Pincode).filter(Boolean);
            allPincodes = [...allPincodes, ...pincodes];
          }
        } catch (err) {
          console.log(`Failed to fetch for ${searchName}:`, err);
        }
        
        // If we found pincodes, no need to try more names
        if (allPincodes.length > 0) break;
      }
      
      // Remove duplicates and sort
      const uniquePincodes = Array.from(new Set(allPincodes)).sort();
      
      if (uniquePincodes.length > 0) {
        setSuggestedPincodes(uniquePincodes);
        
        // Auto-fill first pincode if available
        if (!formData.pincode && uniquePincodes[0]) {
          setFormData(prev => ({ ...prev, pincode: uniquePincodes[0] as string }));
        }
      } else {
        setSuggestedPincodes([]);
      }
    } catch (error) {
      console.error("Failed to fetch pincodes:", error);
      setSuggestedPincodes([]);
    } finally {
      setLoadingPincode(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If state changes, update cities and reset city/area
    if (name === "state") {
      const cities = getCitiesForState(value);
      setAvailableCities(cities);
      setSuggestedPincodes([]);
      setFormData(prev => ({
        ...prev,
        state: value,
        city: "",
        area: "",
        pincode: ""
      }));
    } else if (name === "city") {
      // Reset area and fetch pincodes when city changes
      setFormData(prev => ({
        ...prev,
        city: value,
        area: "",
        pincode: ""
      }));
      fetchPincodesForCity(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentClass || !formData.subject || !formData.budget) {
      toast.error("Please fill in Class, Subject, and Budget");
      return;
    }

    if (!formData.parentName || !formData.parentPhone) {
      toast.error("Parent name and phone number are required");
      return;
    }

    if (!formData.state || !formData.city) {
      toast.error("Please select State and City");
      return;
    }

    try {
      setLoading(true);

      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Prepare payload for StudentLead
      const payload = {
        studentName: formData.studentName || undefined,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail || undefined,
        studentClass: formData.studentClass,
        subject: formData.subject,
        teachingMode: formData.teachingMode,
        location: {
          city: formData.city,
          area: formData.area || undefined,
          state: formData.state,
          pincode: formData.pincode || undefined,
        },
        budget: parseInt(formData.budget),
        budgetType: formData.budgetType,
        preferredTime: formData.preferredTime || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
        urgency: formData.urgency,
        creditsRequired: parseInt(formData.creditsRequired),
        maxUnlocks: parseInt(formData.maxUnlocks),
        expiryDate: expiryDate.toISOString(),
      };

      console.log("Sending payload:", payload); // Debug log

      // Create StudentLead via admin API
      const response = await apiClient.post("/leads/admin/student-leads", payload);
      
      console.log("Response:", response); // Debug log

      toast.success("Student Lead created successfully! 🎉");
      
      // Reset form for next lead
      setFormData({
        studentName: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        studentClass: "",
        board: "",
        schoolName: "",
        subject: "",
        teachingMode: "online",
        city: "",
        area: "",
        state: "",
        pincode: "",
        budget: "",
        budgetType: "per_month",
        preferredTime: "",
        additionalRequirements: "",
        urgency: "flexible",
        availability: "active",
        creditsRequired: "3",
        maxUnlocks: "10",
      });
      
      // Reset dropdowns
      setAvailableCities([]);
      setSuggestedPincodes([]);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Optional: Show notification to create another lead
      setTimeout(() => {
        toast.success("Form reset! Ready to create another lead ✨", {
          duration: 3000,
        });
      }, 1000);
      
    } catch (error: any) {
      console.error("Failed to create lead:", error);
      console.error("Error response:", error.response?.data); // Debug log
      toast.error(error.response?.data?.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Student Lead
            </h1>
            <p className="text-gray-600 mt-1">Add a tutoring requirement to the marketplace</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parent/Student Contact Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-sm text-gray-600">Parent/Guardian details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent/Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="parent@example.com"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
              <p className="text-sm text-amber-800 font-medium">
                🔒 Contact details will be hidden from tutors until they unlock this lead
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-md">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student & Academic Details</h2>
                <p className="text-sm text-gray-600">Class, subject, and teaching preferences</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name (Optional)
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class/Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select Class/Grade</option>
                  <optgroup label="School Classes">
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </optgroup>
                  <optgroup label="Competitive Exams">
                    <option value="JEE Preparation">JEE Preparation</option>
                    <option value="NEET Preparation">NEET Preparation</option>
                    <option value="UPSC Preparation">UPSC Preparation</option>
                    <option value="SSC Preparation">SSC Preparation</option>
                    <option value="Banking Exams">Banking Exams</option>
                    <option value="Railway Exams">Railway Exams</option>
                    <option value="State PSC">State PSC</option>
                    <option value="NDA Preparation">NDA Preparation</option>
                    <option value="CLAT Preparation">CLAT Preparation</option>
                    <option value="CAT Preparation">CAT Preparation</option>
                  </optgroup>
                  <optgroup label="Higher Education">
                    <option value="Graduation">Graduation/College</option>
                    <option value="Post Graduation">Post Graduation</option>
                    <option value="MBA">MBA</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                  </optgroup>
                  <optgroup label="Professional & Language">
                    <option value="IELTS">IELTS Preparation</option>
                    <option value="TOEFL">TOEFL Preparation</option>
                    <option value="Spoken English">Spoken English</option>
                    <option value="Programming">Programming/Coding</option>
                    <option value="Music">Music</option>
                    <option value="Dance">Dance</option>
                    <option value="Art & Craft">Art & Craft</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="Other">Other (Specify in requirements)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Board (Optional)
                </label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="ISC">ISC</option>
                  <option value="State Board">State Board</option>
                  <option value="IB (International Baccalaureate)">IB (International Baccalaureate)</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="NIOS">NIOS (National Institute of Open Schooling)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School Name (Optional)
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teaching Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="teachingMode"
                  value={formData.teachingMode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="online">🖥️ Online</option>
                  <option value="home">🏠 Home Tuition</option>
                  <option value="hybrid">🔄 Hybrid (Online + Home)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
                <p className="text-sm text-gray-600">Where the tutoring will take place</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="">Select State</option>
                  {getAllStates().map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!formData.state}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.state ? "Select City" : "Select State First"}
                  </option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area/Locality
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder={formData.city ? "e.g., Civil Lines, Sector 18" : "Select city first"}
                  disabled={!formData.city}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Enter specific area or locality</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Pincode
                  {loadingPincode && (
                    <Loader className="h-4 w-4 animate-spin text-purple-600" />
                  )}
                </label>
                {suggestedPincodes.length > 0 ? (
                  <select
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                  >
                    <option value="">Select Pincode</option>
                    {suggestedPincodes.map((pincode) => (
                      <option key={pincode} value={pincode}>
                        {pincode}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder={formData.city ? "Enter pincode" : "Select city first"}
                    maxLength={6}
                    pattern="[0-9]{6}"
                    disabled={!formData.city}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {suggestedPincodes.length > 0 
                    ? `${suggestedPincodes.length} pincodes found for ${formData.city}` 
                    : "Pincode will be auto-fetched based on city"}
                </p>
              </div>
            </div>
            
            {formData.state && formData.city && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  📍 Location: {formData.area && `${formData.area}, `}{formData.city}, {formData.state}
                  {formData.pincode && ` - ${formData.pincode}`}
                </p>
              </div>
            )}
          </div>

          {/* Budget & Requirements */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Budget & Requirements</h2>
                <p className="text-sm text-gray-600">Fees and additional needs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 3500"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Type</label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  <option value="per_hour">💰 Per Hour</option>
                  <option value="per_month">📅 Per Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Time</label>
                <input
                  type="text"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  placeholder="e.g., Weekdays 6-8 PM"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  <option value="immediate">🔴 Immediate</option>
                  <option value="within_week">🟠 Within a Week</option>
                  <option value="within_month">🟡 Within a Month</option>
                  <option value="flexible">🟢 Flexible</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Requirements</label>
                <textarea
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder="e.g., Experienced tutor needed for exam preparation..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Lead Settings */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lead Settings</h2>
                <p className="text-sm text-gray-600">Credits and visibility</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lead Availability <span className="text-red-500">*</span>
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="active">✅ Active (Tutors can unlock)</option>
                  <option value="already_filled">✓ Already Filled (Display only)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.availability === "active" 
                    ? "Tutors can spend credits to unlock this lead" 
                    : "Display only - tutors cannot unlock (for old leads)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Credits Required</label>
                <input
                  type="number"
                  name="creditsRequired"
                  value={formData.creditsRequired}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Credits tutors need to unlock this lead</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Unlocks</label>
                <input
                  type="number"
                  name="maxUnlocks"
                  value={formData.maxUnlocks}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum tutors who can unlock</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Lead will automatically expire after 30 days
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-2xl">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}

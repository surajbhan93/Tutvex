import React, { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";
import TutorRequestStatusCard from "./TutorRequestStatusCard";
import toast from "react-hot-toast";
/* ---------------- TYPES ---------------- */
interface StudentRequest {
  _id: string; // ✅ FIX
  academicNeeds: string[];
  scheduling: string[];
  urgency: string;
  status: "pending" | "contacted" | "assigned" | "completed" | "cancelled";
  location: string;
  createdAt: string;

  student: {
    name: string;
    class_grade: string;
  } | null;

  parent: {
    name: string;
    phone: string;
  };
}

/* ---------------- CARD ---------------- */
const RequestCard = ({
  request,
  onRequestToTeach,
}: {
  request: StudentRequest;
  onRequestToTeach: (id: string) => void;
}) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
      <div>
      <h3 className="text-lg font-bold text-gray-800">
  {request.student
    ? `${request.student.name} (Class ${request.student.class_grade})`
    : "Student details not available"}
</h3>

<p className="mt-1 text-sm text-gray-600">
  <b>Subjects:</b> {request.academicNeeds.join(", ")}
</p>

<p className="mt-1 text-sm text-gray-600">
  <b>Parent:</b> {request.parent.name} | <b>Urgency:</b> {request.urgency}
</p>

      </div>

      <div className="flex flex-wrap gap-2">
        {request.academicNeeds.map((sub, i) => (
          <span
            key={i}
            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
          >
            {sub}
          </span>
        ))}

        {request.student?.class_grade && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            {request.student.class_grade}
          </span>
        )}

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
          {request.location}
        </span>
      </div>

      {/* 🔥 STATUS / ACTION */}
      <TutorRequestStatusCard
        request={request}
        onRequestToTeach={onRequestToTeach}
      />
    </div>
  );
};

/* ---------------- PAGE ---------------- */
const FindStudentPage = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  /* -------- FETCH REQUESTS -------- */
 const fetchRequests = async () => {
  try {
    setLoading(true);
    const res = await apiClient.get("/tutor/dashboard/parent-requests");

    const normalized = (res.data.data || []).map((r: any) => ({
      ...r,
      _id: r._id || r.id, // 🔥 MAIN FIX
    }));

    setRequests(normalized);
  } catch (err) {
    console.error("Failed to fetch student requests", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchRequests();
  }, []);

  /* -------- REQUEST TO TEACH -------- */
  const handleRequestToTeach = async (requestId: string) => {
    const toastId = toast.loading("Sending request to admin...");
    try {
      await apiClient.post(
        `/tutor/parent-requests/${requestId}/request-to-teach`,
        {
          note: "I am available for demo this week in the evening",
        }
      );
        
      toast.success(
      "Request sent to admin successfully. If the assigned tutor rejects, you will be contacted for demo.",
      { id: toastId }
    );


      fetchRequests(); // 🔄 Refresh list so status becomes "contacted"
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  /* -------- FILTER LOGIC -------- */
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const subjectMatch =
        subjectFilter === "All" ||
        req.academicNeeds.includes(subjectFilter);

      const gradeMatch =
        gradeFilter === "All" ||
        req.student?.class_grade === gradeFilter;

      const locationMatch =
        locationFilter === "All" || req.location === locationFilter;

      return subjectMatch && gradeMatch && locationMatch;
    });
  }, [requests, subjectFilter, gradeFilter, locationFilter]);

  return (
    <div className="flex flex-col gap-6">
 
{/* ================= FIND STUDENT HEADER ================= */}
<div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow">
  <h1 className="text-xl font-bold">
    Find a Student
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    Browse and connect with students looking for guidance.
    Choose the right student and start teaching.
  </p>
</div>

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Find New Students
        </h1>
        <p className="mt-1 text-gray-500">
          Browse parent requests waiting for admin approval.
        </p>
      </div>

      {/* ---------------- FILTERS ---------------- */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Subject
          </label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300"
          >
            <option value="">All</option>

            {/* <!-- Core Subjects --> */}
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>

{/* <!-- Languages --> */}
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>

{/* <!-- Social Sciences --> */}
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Political Science">Political Science</option>
          <option value="Economics">Economics</option>
          <option value="Civics">Civics</option>

          {/* <!-- Computer & Technology --> */}
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>

          {/* <!-- Commerce --> */}
          <option value="Accountancy">Accountancy</option>
          <option value="Business Studies">Business Studies</option>

{/* <!-- Optional / Others --> */}
          <option value="Environmental Science">Environmental Science</option>
          <option value="General Science">General Science</option>
          <option value="Statistics">Statistics</option>
          <option value="Physical Education">Physical Education</option>

          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Grade
          </label>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300"
          >
           <option value="">All</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>

          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300"
          >
            <option>All</option>
*
{/* <!-- Uttar Pradesh --> */}
                <option>Lucknow</option>
                <option>Kanpur</option>
                <option>Prayagraj</option>
                <option>Varanasi</option>
                <option>Ayodhya</option>
                <option>Gorakhpur</option>
                <option>Jhansi</option>
                <option>Agra</option>
                <option>Aligarh</option>
                <option>Bareilly</option>
                <option>Meerut</option>
                <option>Noida</option>
                <option>Greater Noida</option>
                <option>Ghaziabad</option>
                <option>Moradabad</option>
                <option>Farrukhabad</option>

              {/* <!-- Delhi NCR --> */}
              <option>Delhi</option>
              <option>Gurugram</option>
              <option>Faridabad</option>

                {/* <!-- Rajasthan --> */}
                <option>Jaipur</option>
                <option>Kota</option>
                <option>Ajmer</option>
                <option>Udaipur</option>

                {/* <!-- Madhya Pradesh (Nearby) --> */}
                <option>Gwalior</option>
                <option>Indore</option>
                <option>Bhopal</option>

                {/* <!-- Bihar (Nearby) --> */}
                <option>Patna</option>
                <option>Gaya</option>

          </select>
        </div>
      </div>

      {/* ---------------- LIST ---------------- */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">
            Loading student requests...
          </p>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onRequestToTeach={handleRequestToTeach}
            />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>No student requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindStudentPage;

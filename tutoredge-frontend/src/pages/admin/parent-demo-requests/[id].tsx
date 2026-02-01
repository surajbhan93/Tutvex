import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";

/* ======================
   TYPES
====================== */
interface Tutor {
  _id: string;
  fullName: string;
}

interface DemoRequest {
  _id: string;

  academicNeeds: string[];
  scheduling: string[];        // ✅ ADD
  location: string;            // ✅ ADD
  urgency: string;

  board: string;               // ✅ ADD
  classGrade: string;          // ✅ ADD

  status: string;
  adminNote?: string;          // ✅ ADD
  createdAt: string;

  parent: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };

  requestedTutor: {
    _id: string;
    fullName: string;
    subjects?: string[];
  };

  tutor?: {
    _id: string;
    fullName: string;
    subjects?: string[];
  } | null;

  student?: {
  _id: string;
  full_name: string;
  class_grade: string;
  

};
// 🔥 ADD THIS LINE
  studentDisplayName?: string | null;

}


/* ======================
   PAGE
====================== */
export default function ParentDemoRequestViewPage() {
  const router = useRouter();
  const { id } = router.query;

  const [request, setRequest] = useState<DemoRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [tutors, setTutors] = useState<Tutor[]>([]);
const [selectedTutor, setSelectedTutor] = useState("");
  /* ======================
     FETCH
  ====================== */
  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      try {
        const res = await adminApi.get(
          `/admin/parent-requests/${id}`
        );
        setRequest(res.data.data);
        setStatus(res.data.data.status);
      } catch (err) {
        alert("Failed to load demo request");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);
 

  // get tutors list 

  useEffect(() => {
  const fetchTutors = async () => {
    try {
      // /admin/tutors
      const res = await adminApi.get("/tutors");
      setTutors(res.data.data);
    } catch (err) {
      console.error("Failed to load tutors");
    }
  };

  fetchTutors();
}, []);


const assignTutor = async () => {
  try {
    const res = await adminApi.patch(
      `/admin/parent-requests/${id}`,
      {
        status: "assigned",
        tutorId: selectedTutor,
        adminNote: "Tutor assigned by admin",
      }
    );

    setRequest(res.data.data);
    setStatus("assigned");

    alert("Tutor assigned successfully");
  } catch (err: any) {
    console.error(err?.response?.data || err);
    alert(
      err?.response?.data?.error ||
      "Failed to assign tutor"
    );
  }
};



  /* ======================
     UPDATE STATUS
  ====================== */
 const updateStatus = async () => {
  try {
    const res = await adminApi.patch(
      `/admin/parent-requests/${id}`,
      {
        status,
        adminNote: "Updated from admin panel",
      }
    );

    // 🔥 IMPORTANT: local state update
    setRequest(res.data.data);

    alert("Status updated successfully");
  } catch (err: any) {
    console.error(err?.response?.data || err);
    alert("Failed to update status");
  }
};



  if (loading) {
    return (
      <AdminDashboardLayout>
        <p>Loading...</p>
      </AdminDashboardLayout>
    );
  }

  if (!request) {
    return (
      <AdminDashboardLayout>
        <p>Request not found</p>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              Demo Request Details
            </h1>
            <p className="text-sm text-gray-500">
              Request ID: {request._id}
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Parent */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="font-semibold mb-2">
            Parent Information
          </h2>

          <p
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() =>
              router.push(`/admin/parent/${request.parent._id}`)
            }
          >
            {request.parent.fullName}
          </p>

          <p className="text-sm text-gray-600">
            {request.parent.email}
          </p>
          {request.parent.phone && (
            <p className="text-sm text-gray-600">
              {request.parent.phone}
            </p>
          )}
        </div>

        {/* Tutor */}
        {/* Tutor */}
<div className="rounded-xl border bg-white p-4 shadow">
  <h2 className="font-semibold mb-2">
    Tutor Information
  </h2>

  {request.tutor ? (
  <>
    <p className="text-xs text-gray-500">Assigned Tutor</p>
    <p
      className="text-blue-600 font-medium cursor-pointer hover:underline"
      onClick={() =>
        router.push(`/admin/tutor/${request.tutor!._id}`)
      }
    >
      {request.tutor.fullName}
    </p>
  </>
) : request.requestedTutor ? (
  <>
    <p className="text-xs text-gray-500">
      Requested Tutor (Parent Preference)
    </p>
    <p
      className="text-blue-600 font-medium cursor-pointer hover:underline"
      onClick={() =>
        router.push(
          `/admin/tutor/${request.requestedTutor._id}`
        )
      }
    >
      {request.requestedTutor.fullName}
    </p>
  </>
) : (
  <p className="text-gray-500">
    Tutor information not available
  </p>
)}


 {!request.tutor && (
  <div className="mt-3 space-y-2">
    <select
      value={selectedTutor}
      onChange={(e) => setSelectedTutor(e.target.value)}
      className="w-full rounded-lg border px-3 py-2"
    >
      <option value="">Select Tutor</option>
      {tutors.map((t) => (
        <option key={t._id} value={t._id}>
          {t.fullName}
        </option>
      ))}
    </select>

    <button
      disabled={!selectedTutor}
      onClick={assignTutor}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
    >
      Assign Tutor
    </button>
  </div>
)}

</div>

 {/* Student Information */}
{/* {request.student && (
  <div className="rounded-xl border bg-white p-4 shadow">
    <h2 className="font-semibold mb-2">
      Student Information
    </h2>

    <p>
      <b>Name:</b> {request.student.full_name}
    </p>

    <p>
      <b>Class:</b> {request.student.class_grade}
    </p>
  </div>
)} */}
{(request.student || request.studentDisplayName) && (
  <div className="rounded-xl border bg-white p-4 shadow">
    <h2 className="font-semibold mb-2">
      Student Information
    </h2>

    <p>
      <b>Name:</b>{" "}
      {request.student
        ? request.student.full_name
        : request.studentDisplayName}
    </p>

    {request.student && (
      <p>
        <b>Class:</b> {request.student.class_grade}
      </p>
    )}
  </div>
)}



        {/* Academic */}
       {/* Academic Details */}
<div className="rounded-xl border bg-white p-4 shadow">
  <h2 className="font-semibold mb-2">
    Academic Details
  </h2>

  <p>
    <b>Subjects:</b>{" "}
    {request.academicNeeds.join(", ")}
  </p>

  <p>
    <b>Board:</b> {request.board}
  </p>

  <p>
    <b>Class:</b> {request.classGrade}
  </p>

  <p>
    <b>Preferred Schedule:</b>{" "}
    {request.scheduling.length
      ? request.scheduling.join(", ")
      : "Not specified"}
  </p>

  <p>
    <b>Location:</b> {request.location}
  </p>

  <p>
    <b>Urgency:</b> {request.urgency}
  </p>

  <p>
    <b>Requested On:</b>{" "}
    {new Date(request.createdAt).toLocaleString()}
  </p>
</div>


        {/* Actions */}
        <div className="rounded-xl border bg-white p-4 shadow space-y-3">
          <h2 className="font-semibold">
            Admin Actions
          </h2>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
        <option
  value="assigned"
  disabled={!request.tutor}
>
  Assigned
</option>

          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>

          </select>
          {request.adminNote && (
  <div className="rounded-xl border bg-yellow-50 p-4 text-sm">
    <b>Admin Note:</b> {request.adminNote}
  </div>
)}


          <div>
            <button
              onClick={updateStatus}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

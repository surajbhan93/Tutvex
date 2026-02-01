// "use client";

// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
// import StudentDetailPage from "@/components/tutor-dashboard/StudentDetailPage";
// import apiClient from "@/lib/apiClient";

// const StudentDetail = () => {
//   const router = useRouter();
//   const { studentId } = router.query;

//   const [data, setData] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!studentId) return;

//     const fetchStudent = async () => {
//       try {
//         const res = await apiClient.get(
//           `/auth/student/${studentId}`
//         );
//         setData(res.data.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load student details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudent();
//   }, [studentId]);

//   return (
//     <TutorDashboardLayout>
//       {loading && <p>Loading student details...</p>}

//       {!loading && error && (
//         <p className="text-red-500">{error}</p>
//       )}

//       {!loading && !error && data && (
//         <StudentDetailPage data={data} />
//       )}

//       {!loading && !error && !data && (
//         <p>Student not found.</p>
//       )}
//     </TutorDashboardLayout>
//   );
// };

// export default StudentDetail;
export default function BookDemoPage() {
  return null; // ya <div />
}

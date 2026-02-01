import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

const ReviewTutorPage = () => {
  const router = useRouter();
  const { applicationId } = router.query;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // router.isReady check karna zaroori hai Next.js mein
    if (!router.isReady) return; 

    // Agar ID bilkul nahi hai ya 'undefined' string hai
    if (!applicationId || applicationId === "undefined") {
      setError("Invalid Application ID provided.");
      setLoading(false);
      return;
    }

    const fetchTutor = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/auth/admin/tutor/${applicationId}`);
        setApplication(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch tutor details");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [applicationId, router.isReady]);

  if (loading) return <div className="p-10 text-center">Loading details for ID: {applicationId}...</div>;
  if (error) return <div className="p-10 text-red-600 font-bold">{error}</div>;
  
  // Baaki ka return UI...
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        Tutor Application Review
      </h1>

      <p><b>Name:</b> {application.fullName}</p>
      <p><b>Email:</b> {application.email}</p>
      <p><b>Status:</b> {application.status}</p>

      {/* <div className="flex gap-4 mt-6">
        <button
          onClick={() => updateStatus("approved")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Approve
        </button> */}

        {/* <button
          onClick={() => updateStatus("rejected")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reject
        </button> */}
      {/* </div> */}
    </div>
  );
};

export default ReviewTutorPage;

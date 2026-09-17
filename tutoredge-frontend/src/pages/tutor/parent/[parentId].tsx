"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import ParentDetailPage from "@/components/tutor-dashboard/StudentDetailPage";
import apiClient from "@/lib/apiClient";

const ParentDetail = () => {
  const router = useRouter();
  const { parentId } = router.query;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!parentId) return;

    const fetchParentDetail = async () => {
      try {
        const res = await apiClient.get(
          `/auth/tutor/parent/${parentId}`
        );
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load parent details");
      } finally {
        setLoading(false);
      }
    };

    fetchParentDetail();
  }, [parentId]);

  return (
    <TutorDashboardLayout>
      {loading && <p>Loading parent details...</p>}

      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && data && (
        // <ParentDetailPage data={data} />
        <ParentDetailPage />

      )}

      {!loading && !error && !data && (
        <p>Parent not found.</p>
      )}
    </TutorDashboardLayout>
  );
};

export default ParentDetail;

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

/* ======================
   TYPES
====================== */
interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  status: "approved" | "pending" | "rejected";
}

interface Parent {
  _id: string;
  fullName: string;
  email: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
}

/* ======================
   STATUS BADGE
====================== */
const StatusBadge = ({ status }: { status: string }) => {
  const map: any = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
};

/* ======================
   PAGE
====================== */
export default function AdminDashboardPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [tutorRes, parentRes, teamRes] = await Promise.all([
          apiClient.get("/admin_dashboard/tutors"),
          apiClient.get("/admin/parents"),
          apiClient.get("/team"),
        ]);

        setTutors(tutorRes.data.data || []);
        setParents(parentRes.data.data || []);
        setTeam(teamRes.data.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  /* ======================
     COUNTS
  ====================== */
  const approvedTutors = tutors.filter(t => t.status === "approved").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* KPI BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Tutors" value={tutors.length} />
        <KpiCard title="Approved Tutors" value={approvedTutors} />
        <KpiCard title="Total Parents" value={parents.length} />
        <KpiCard title="Team Members" value={team.length} />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT TUTORS */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Recent Tutors
          </h2>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {tutors.slice(0, 5).map(t => (
                  <tr key={t._id} className="border-t">
                    <td className="p-4">
                      <p className="font-medium">{t.fullName}</p>
                      <p className="text-gray-500">{t.email}</p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
                {tutors.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-gray-500">
                      No tutors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT PARENTS */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Recent Parents
          </h2>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {parents.slice(0, 5).map(p => (
                  <tr key={p._id} className="border-t">
                    <td className="p-4">
                      <p className="font-medium">{p.fullName}</p>
                      <p className="text-gray-500">{p.email}</p>
                    </td>
                  </tr>
                ))}
                {parents.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-gray-500">
                      No parents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================
   KPI CARD
====================== */
function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}

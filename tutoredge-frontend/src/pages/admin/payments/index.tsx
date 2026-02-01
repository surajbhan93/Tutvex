"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import { getAllAdminPayments } from "@/lib/adminPayments.api";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";

const StatusPill = ({ status }: { status: string }) => {
  const map: any = {
    pending: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAdminPayments()
      .then(res => setPayments(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading payments...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <AdminDashboardLayout>
        <main className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">
            Admin – Payment Logs
          </h1>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Parent</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Tutor</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Month</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Settlement</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map(p => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {p.parent?.fullName || "-"}
                    </td>
                    <td className="p-3">
                      {p.student?.full_name || "-"}
                    </td>
                    <td className="p-3">
                      {p.tutor?.fullName || "-"}
                    </td>
                    <td className="p-3 font-semibold">
                      ₹{p.amount}
                    </td>
                    <td className="p-3">
                      {p.month}/{p.year}
                    </td>
                    <td className="p-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="p-3">
                      {p.settlementStatus === "pending" ? (
                        <span className="text-yellow-600 font-medium">
                          ⏳ Pending
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          ✅ Settled
                        </span>
                      )}
                    </td>

                    {/* 🔥 ACTION BUTTON */}
                    <td className="p-3">
                      <button
                        onClick={() =>
                          alert(
                            `Payment ID: ${p._id}\nAmount: ₹${p.amount}`
                          )
                        }
                        className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </AdminDashboardLayout>
    </div>
  );
}

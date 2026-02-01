import { useEffect, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import {
  getPendingSettlements,
  settlePayment,
} from "@/lib/adminPayments.api";

export default function PendingSettlementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    getPendingSettlements()
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <p className="p-6">Loading pending settlements...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Pending Tutor Settlements
        </h1>

        {data.length === 0 && (
          <p className="text-green-600 font-medium">
            ✅ No pending settlements
          </p>
        )}

        {data.map(tutor => (
          <div
            key={tutor.tutorId}
            className="bg-white p-5 mb-6 rounded shadow"
          >
            <h2 className="font-semibold text-lg">
              {tutor.tutorName} — ₹{tutor.totalPending}
            </h2>

            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Month</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tutor.payments.map((p: any) => (
                  <tr key={p._id} className="border-t">
                    <td className="py-2">
                      {p.student?.full_name}
                    </td>
                    <td>₹{p.amount}</td>
                    <td>
                      {p.month}/{p.year}
                    </td>
                    <td>
                      <button
                        disabled={settlingId === p._id}
                        className={`px-3 py-1 rounded text-white ${
                          settlingId === p._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={async () => {
                          setSettlingId(p._id);
                          try {
                            await settlePayment(p._id);
                            fetchData(); // 🔁 refresh pending list
                          } finally {
                            setSettlingId(null);
                          }
                        }}
                      >
                        {settlingId === p._id
                          ? "Settling..."
                          : "Settle"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    </div>
  );
}

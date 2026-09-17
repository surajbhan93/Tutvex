"use client";

type Lead = {
  _id: string;
  name?: string;
  phone?: string;
  role: string;
  sessionId: string;
  createdAt: string;
};

export default function LeadsTable({
  leads,
  onSelect,
}: {
  leads: Lead[];
  onSelect: (sessionId: string) => void;
}) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-t">
              <td className="p-2">{lead.name || "-"}</td>
              <td className="p-2 capitalize">{lead.role}</td>
              <td className="p-2">{lead.phone || "-"}</td>
              <td className="p-2">
                <button
                  onClick={() => onSelect(lead.sessionId)}
                  className="text-green-600 hover:underline"
                >
                  View Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface Student {
  id: string;
  fullName: string;
  classGrade: string;
}

interface Props {
  students: Student[];
  selectedStudents: string[];
  onToggle: (id: string) => void;
}

export default function AssignTable({
  students = [],
  selectedStudents = [],
  onToggle,
}: Props) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              Select
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              Student Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              Class
            </th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-sm text-gray-500"
              >
                No students found
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={() => onToggle(s.id)}
                  />
                </td>
                <td className="px-6 py-4">{s.fullName}</td>
                <td className="px-6 py-4">
                  Class {s.classGrade}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

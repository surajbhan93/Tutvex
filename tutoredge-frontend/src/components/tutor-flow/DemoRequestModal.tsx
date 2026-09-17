
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import authApi from "@/lib/authApi";

interface Props {
  tutorId: string;
  subjects: string[];
  onClose: () => void;
}

export default function DemoRequestModal({
  tutorId,
  subjects,
  onClose,
}: Props) {
  const [academicNeeds, setAcademicNeeds] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("within_3_days");
  const [board, setBoard] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [notes, setNotes] = useState("");

  // 🔥 student selection OR manual name
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH PARENT STUDENTS
  useEffect(() => {
    authApi
      .get("/auth/parent/students")
      .then((res) => {
        setStudents(res.data.students || []);
      })
      .catch(() => {
        setStudents([]);
      });
  }, []);

  const toggleSubject = (sub: string) => {
    setAcademicNeeds((prev) =>
      prev.includes(sub)
        ? prev.filter((s) => s !== sub)
        : [...prev, sub]
    );
  };

  const submitRequest = async () => {
    if (
      academicNeeds.length === 0 ||
      !location ||
      !board ||
      !classGrade ||
      (!studentId && !studentName)
    ) {
      alert("Please fill all required fields (select student or enter name)");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        tutorId,
        academicNeeds,
        scheduling: ["Evening"],
        location,
        urgency,
        board,
        classGrade,
        notes,
      };

      // 🔥 conditional payload
      if (studentId) payload.studentId = studentId;
      if (studentName) payload.studentName = studentName;

      await authApi.post("/auth/parent/request-demo", payload);

      alert("✅ Demo request sent successfully!");
      onClose();
    } catch (err: any) {
      console.error("Demo Request Error:", err?.response?.data);

      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong while sending demo request";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
      >
        <h2 className="text-xl font-semibold text-center">
          Request Demo Class
        </h2>

        {/* SUBJECTS */}
        <div>
          <p className="text-sm font-medium mb-2">Select Subjects</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => toggleSubject(sub)}
                className={`px-3 py-1 rounded-full text-sm border transition
                  ${
                    academicNeeds.includes(sub)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* BOARD + CLASS */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium mb-1">Board</p>
            <input
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              placeholder="CBSE / ICSE / State"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Class</p>
            <input
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              placeholder="Class 8 / 9 / 10"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <p className="text-sm font-medium mb-1">Location</p>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Area"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* URGENCY */}
        <div>
          <p className="text-sm font-medium mb-1">Urgency</p>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="within_24_hours">Within 24 hours</option>
            <option value="within_3_days">Within 3 days</option>
            <option value="within_a_week">Within a week</option>
          </select>
        </div>

        {/* STUDENT SELECT */}
        <div>
          <p className="text-sm font-medium mb-1">Select Student (optional)</p>
          <select
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setStudentName(""); // 🔥 clear manual name
            }}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Student</option>
            {students.map((s: any) => (
              <option key={s._id} value={s._id}>
                {s.full_name} (Class {s.class})
              </option>
            ))}
          </select>
        </div>

        {/* OR MANUAL STUDENT NAME */}
        <div>
          <p className="text-sm font-medium mb-1">
            Or Enter Student Name (if not added)
          </p>
          <input
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
              if (e.target.value) setStudentId(""); // 🔥 clear select
            }}
            placeholder="Student full name"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* NOTES */}
        <div>
          <p className="text-sm font-medium mb-1">Additional Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific requirement or message..."
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={submitRequest}
            disabled={loading}
            className="w-1/2 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}



"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import ParentTopBar from "@/components/parent-dashboard/ParentTopBar";

export default function ParentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
   const [isProfileComplete, setIsProfileComplete] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    notificationWhatsapp: true,
  });

  const [newStudent, setNewStudent] = useState({
    full_name: "",
    class: "",
    board: "",
    institution_name: "",
    subjects_required: "",
    additional_notes: "",
  });

  // 🔹 Load profile & students
  useEffect(() => {
    Promise.all([
      apiClient.get("/auth/parent/profile"),
      apiClient.get("/auth/parent/students"),
    ])
      .then(([profileRes, studentsRes]) => {
        const p = profileRes.data.parent;
        setForm({
          fullName: p.fullName || "",
          phone: p.phone || "",
          email: p.email || "",
          notificationWhatsapp: p.notificationWhatsapp ?? true,
        });
        
  setIsProfileComplete(profileRes.data.isProfileComplete);
        setStudents(studentsRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Save parent profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await apiClient.put("/auth/parent/profile", {
        fullName: form.fullName,
        phone: form.phone,
        notificationWhatsapp: form.notificationWhatsapp,
      });
      alert("Profile updated");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Add student
 const handleAddStudent = async () => {
  if (
    !newStudent.full_name ||
    !newStudent.class ||
    !newStudent.board ||
    !newStudent.institution_name ||
    !newStudent.subjects_required
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const res = await apiClient.post("/auth/parent/student", {
      full_name: newStudent.full_name,
      class_grade: newStudent.class, // ✅ FIX
      board: newStudent.board,
      institution_name: newStudent.institution_name,
      subjects_required: newStudent.subjects_required
        .split(",")
        .map((s) => s.trim()),
      additional_notes: newStudent.additional_notes,
    });

    setStudents((prev) => [...prev, res.data.data]);
    setShowAddModal(false);

    setNewStudent({
      full_name: "",
      class: "",
      board: "",
      institution_name: "",
      subjects_required: "",
      additional_notes: "",
    });
  } catch (err: any) {
    console.error("Add student error:", err);
    alert(
      err?.response?.data?.message ||
      "Failed to add student"
    );
  }
};

  if (loading) {
    return (
      <ParentDashboardLayout>
        {/* <ParentTopBar /> */}
        <div className="p-6">Loading profile...</div>
      </ParentDashboardLayout>
    );
  }

  return (
    <ParentDashboardLayout>
     <ParentTopBar
  parentName="Parent"
  studentName="Student"
  notificationsCount={0}
/>


      {!isProfileComplete && (
  <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
    ⚠️ Your profile is not complete yet.  
    You can continue using the platform, but completing your profile
    helps tutors understand your requirements better.
  </div>
)}


      <div className="max-w-3xl mx-auto space-y-6 mt-4">

        <h1 className="text-2xl font-bold">Profile</h1>

        {/* ================= Parent Info ================= */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Parent Information</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="border px-3 py-2 rounded"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
            <input
              className="border px-3 py-2 rounded"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <input
              disabled
              className="border bg-gray-100 px-3 py-2 rounded"
              value={form.email}
            />
          </div>
        </section>

        {/* ================= Students ================= */}
        <section className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Students</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded"
            >
              + Add Student
            </button>
          </div>

          {students.length === 0 && (
            <p className="text-sm text-gray-500">No students added yet</p>
          )}

          {students.map((student) => (
            <div
              key={student._id}
              className="border rounded-lg p-4 space-y-1"
            >
              <p className="font-medium">{student.full_name}</p>
              <p className="text-sm text-gray-600">
                Class {student.class} | {student.board}
              </p>
              <p className="text-sm">{student.institution_name}</p>
              <p className="text-sm text-gray-500">
                Subjects: {student.subjects_required.join(", ")}
              </p>
            </div>
          ))}
        </section>

        {/* ================= Preferences ================= */}
        <section className="rounded-xl border bg-white p-6">
          <label className="flex justify-between items-center">
            <span className="font-medium">WhatsApp Notifications</span>
            <input
              type="checkbox"
              checked={form.notificationWhatsapp}
              onChange={(e) =>
                setForm({
                  ...form,
                  notificationWhatsapp: e.target.checked,
                })
              }
            />
          </label>
        </section>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* ================= Add Student Modal ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-3">
            <h3 className="text-lg font-semibold">Add Student</h3>

            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="Student Name"
              value={newStudent.full_name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, full_name: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                className="border px-3 py-2 rounded"
                placeholder="Class"
                value={newStudent.class}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, class: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Board"
                value={newStudent.board}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, board: e.target.value })
                }
              />
            </div>

            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="School / College"
              value={newStudent.institution_name}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  institution_name: e.target.value,
                })
              }
            />

            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="Subjects (comma separated)"
              value={newStudent.subjects_required}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  subjects_required: e.target.value,
                })
              }
            />

            <textarea
              className="border px-3 py-2 rounded w-full"
              placeholder="Additional notes (optional)"
              rows={2}
              value={newStudent.additional_notes}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  additional_notes: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="border px-4 py-1.5 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-blue-600 text-white px-4 py-1.5 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </ParentDashboardLayout>
  );
}

"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import ParentTopBar from "@/components/parent-dashboard/ParentTopBar";

export default function AddStudentPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    class: "",
    board: "",
    institution_name: "",
    subjects_required: "",
    additional_notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.full_name ||
      !form.class ||
      !form.board ||
      !form.institution_name ||
      !form.subjects_required
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post("/auth/parent/student", {
        full_name: form.full_name,
        class: form.class,
        board: form.board,
        institution_name: form.institution_name,
        subjects_required: form.subjects_required
          .split(",")
          .map((s) => s.trim()),
        additional_notes: form.additional_notes,
      });

      alert("Student added successfully");

      setForm({
        full_name: "",
        class: "",
        board: "",
        institution_name: "",
        subjects_required: "",
        additional_notes: "",
      });
    } catch (err) {
      alert("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentDashboardLayout>
       
       <ParentTopBar
  parentName="Parent"
  studentName="Student"
  notificationsCount={0}
/>

      <div className="max-w-2xl mx-auto mt-6">
        <h1 className="mb-4 text-2xl font-bold">Add New Student</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-white p-6"
        >
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Student Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2"
              placeholder="Class (e.g. 8)"
              value={form.class}
              onChange={(e) =>
                setForm({ ...form, class: e.target.value })
              }
            />

            <input
              className="rounded-md border px-3 py-2"
              placeholder="Board (CBSE / ICSE / State)"
              value={form.board}
              onChange={(e) =>
                setForm({ ...form, board: e.target.value })
              }
            />
          </div>

          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="School / College Name"
            value={form.institution_name}
            onChange={(e) =>
              setForm({
                ...form,
                institution_name: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Subjects Required (comma separated)"
            value={form.subjects_required}
            onChange={(e) =>
              setForm({
                ...form,
                subjects_required: e.target.value,
              })
            }
          />

          <textarea
            className="w-full rounded-md border px-3 py-2"
            placeholder="Additional notes (optional)"
            rows={3}
            value={form.additional_notes}
            onChange={(e) =>
              setForm({
                ...form,
                additional_notes: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </ParentDashboardLayout>
  );
}

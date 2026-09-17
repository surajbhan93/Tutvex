import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import NavBar from "@/components/navbar/NavBar";
import toast from "react-hot-toast";

// ─── Field Config ────────────────────────────────────────────────
const fields = [
  {
    name: "studentName",
    label: "Student Name",
    placeholder: "e.g. Arjun Sharma",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21c0-4.418 4.03-8 9-8s9 3.582 9 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "parentName",
    label: "Parent / Guardian Name",
    placeholder: "e.g. Rajesh Sharma",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "e.g. +91 98765 43210",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3 1.25h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 21 16z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "classGrade",
    label: "Class / Grade",
    placeholder: "e.g. 10, 12, JEE",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "board",
    label: "Board",
    placeholder: "e.g. CBSE, ICSE, State",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9h18M9 21V9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "e.g. Maths, Physics, English",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "location",
    label: "Location",
    placeholder: "e.g. Prayagraj, Lucknow",
    type: "text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

type Status = "pending" | "active" | "closed" | "assigned";

type Urgency = "within_24_hours" | "within_3_days" | "within_a_week";

const urgencyOptions = [
  { value: "within_24_hours", label: "🔴 Within 24 Hours", color: "text-red-600" },
  { value: "within_3_days", label: "🟠 Within 3 Days", color: "text-orange-500" },
  { value: "within_a_week", label: "🟢 Within a Week", color: "text-green-600" },
];

const defaultForm = {
  studentName: "",
  classGrade: "",
  board: "",
  subject: "",
  location: "",
  phone: "",
  parentName: "",
  urgency: "within_3_days",
};

// ─── Status config ───────────────────────────────────────────────
const statusConfig: Record<Status, { bg: string; color: string; dot: string; label: string }> = {
  pending:   { bg: "#fff7ed", color: "#ea580c", dot: "#f97316", label: "Pending" },
  active:    { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e", label: "Active" },
  closed:    { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8", label: "Closed" },
  assigned:  { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6", label: "Assigned" },
};

const urgencyBadge: Record<Urgency, { emoji: string; color: string }> = {
  within_24_hours: { emoji: "🔴", color: "#ef4444" },
  within_3_days:   { emoji: "🟠", color: "#f97316" },
  within_a_week:   { emoji: "🟢", color: "#22c55e" },
};

// ─── Component ───────────────────────────────────────────────────
export default function CreateLeadPage() {
  // const router = useRouter();

  // ── Tab state
  const [activeTab, setActiveTab] = useState<"create" | "all">("create");

  // ── Create Lead state
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // ── All Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await apiClient.get("/admin/all-leads");
      setLeads(res.data.data || []);
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "all") fetchLeads();
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating lead...");
    try {
      await apiClient.post("/admin/create-lead", form);
      toast.success("Lead created successfully 🚀", { id: toastId });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm(defaultForm);
        // Refresh leads list if it was loaded
        if (leads.length > 0) fetchLeads();
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create lead", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchSearch =
      l.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.parent?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.location?.toLowerCase().includes(search.toLowerCase()) ||
      l.academicNeeds?.join(" ").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .cl-root * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        .cl-root { background: #f4f6fb; min-height: 100vh; display: flex; }

        /* ── Tabs ── */
        .cl-tabs { display: flex; gap: 4px; background: #edf0f9; border-radius: 14px; padding: 4px; }
        .cl-tab {
          flex: 1; padding: 10px 20px; border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s;
          background: transparent; color: #7c8db5; display: flex; align-items: center; justify-content: center; gap: 7px;
          font-family: 'Sora', sans-serif;
        }
        .cl-tab.active {
          background: #fff; color: #1a2340;
          box-shadow: 0 2px 10px rgba(79,110,247,.12);
        }
        .cl-tab-count {
          background: #4f6ef7; color: #fff;
          font-size: 10px; font-weight: 700;
          padding: 1px 7px; border-radius: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
        .cl-tab.active .cl-tab-count { background: #4f6ef7; }

        /* ── Field ── */
        .cl-field-wrap { position: relative; }
        .cl-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; color: #7c8db5; margin-bottom: 6px;
        }
        .cl-label svg { color: #a0aec0; }
        .cl-input {
          width: 100%; height: 46px; padding: 0 14px;
          border: 1.5px solid #e2e8f3; border-radius: 10px;
          background: #fff; font-size: 14px; color: #1a2340;
          outline: none; transition: all .2s; font-family: 'Sora', sans-serif;
        }
        .cl-input::placeholder { color: #b0bcd4; }
        .cl-input:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,.1); }
        .cl-input.filled { border-color: #c7d3f7; background: #f8f9ff; }

        /* ── Submit Button ── */
        .cl-btn {
          width: 100%; height: 50px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #4f6ef7 0%, #7c3af9 100%);
          color: #fff; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all .25s; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 20px rgba(79,110,247,.35);
        }
        .cl-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(79,110,247,.45); }
        .cl-btn:active:not(:disabled) { transform: translateY(0); }
        .cl-btn:disabled { opacity: .65; cursor: not-allowed; }
        .cl-btn-shine {
          position: absolute; top: 0; left: -75%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
          transform: skewX(-20deg); animation: cl-shine 2.5s infinite;
        }
        @keyframes cl-shine { 0%,100% { left: -75% } 40%,60% { left: 125% } }

        /* ── Success overlay ── */
        .cl-success-overlay {
          position: absolute; inset: 0; border-radius: 20px;
          background: linear-gradient(135deg,#f0fdf4,#dcfce7);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          z-index: 10; animation: cl-fadeIn .3s ease;
        }
        @keyframes cl-fadeIn { from { opacity:0; transform:scale(.97) } to { opacity:1; transform:scale(1) } }

        /* ── Progress dots ── */
        .cl-dot { width:8px; height:8px; border-radius:50%; background:#d1d9ef; transition: all .3s; }
        .cl-dot.active { background:#4f6ef7; transform:scale(1.3); }
        .cl-dot.done { background:#22c55e; }

        /* ── Card ── */
        .cl-card {
          background: #fff; border-radius: 20px; border: 1px solid #eaeffa;
          box-shadow: 0 2px 30px rgba(79,110,247,.07); padding: 32px; position: relative;
        }

        /* ── Badge ── */
        .cl-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 600; letter-spacing: .05em;
          background: #eff2ff; color: #4f6ef7;
        }

        /* ── Spinner ── */
        .cl-spinner {
          width:18px; height:18px; border:2px solid rgba(255,255,255,.3);
          border-top-color:#fff; border-radius:50%;
          animation: cl-spin .6s linear infinite;
        }
        .cl-spinner-dark {
          width:28px; height:28px; border:2.5px solid #e2e8f3;
          border-top-color:#4f6ef7; border-radius:50%;
          animation: cl-spin .7s linear infinite;
        }
        @keyframes cl-spin { to { transform:rotate(360deg) } }

        /* ── Grid ── */
        .cl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .cl-grid-2 { grid-template-columns: 1fr; } }

        /* ── Lead Card ── */
        .cl-lead-card {
          background: #fff; border: 1px solid #eaeffa; border-radius: 16px;
          padding: 20px 22px; transition: all .2s;
          box-shadow: 0 1px 8px rgba(79,110,247,.05);
        }
        .cl-lead-card:hover {
          border-color: #c7d3f7;
          box-shadow: 0 4px 20px rgba(79,110,247,.1);
          transform: translateY(-1px);
        }
        .cl-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
        }
        .cl-status-dot { width:6px; height:6px; border-radius:50%; }
        .cl-chip {
          display: inline-flex; align-items: center;
          padding: 2px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 500;
          background: #f1f5f9; color: #475569;
        }
        .cl-search {
          width: 100%; height: 42px; padding: 0 14px 0 40px;
          border: 1.5px solid #e2e8f3; border-radius: 10px;
          background: #fff; font-size: 13px; color: #1a2340;
          outline: none; transition: all .2s; font-family: 'Sora', sans-serif;
        }
        .cl-search:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,.1); }
        .cl-filter-btn {
          padding: 0 16px; height: 42px; border-radius: 10px;
          border: 1.5px solid #e2e8f3; background: #fff;
          font-size: 12px; font-weight: 600; color: #7c8db5;
          cursor: pointer; transition: all .2s; white-space: nowrap;
          font-family: 'Sora', sans-serif;
        }
        .cl-filter-btn.active { border-color: #4f6ef7; background: #f0f3ff; color: #4f6ef7; }
        .cl-filter-btn:hover { border-color: #c7d3f7; }
        .cl-empty {
          text-align: center; padding: 60px 20px; color: #b0bcd4;
        }
        .cl-refresh-btn {
          padding: 8px 16px; border-radius: 8px;
          border: 1.5px solid #e2e8f3; background: #fff;
          font-size: 12px; font-weight: 600; color: #4f6ef7;
          cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 6px;
          font-family: 'Sora', sans-serif;
        }
        .cl-refresh-btn:hover { background: #f0f3ff; border-color: #c7d3f7; }
      `}</style>

      <div className="cl-root">
        <AdminSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <NavBar />

          {/* ── Page Body ── */}
          <div style={{ flex: 1, padding: "32px 28px", overflowY: "auto" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>

              {/* ── Page Header ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg,#4f6ef7,#7c3af9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(79,110,247,.3)", flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2340", margin: 0 }}>
                    Leads Management
                  </h1>
                  <p style={{ fontSize: 13, color: "#7c8db5", margin: "2px 0 0" }}>
                    Create and manage student leads from admin panel
                  </p>
                </div>
              </div>

              {/* ── Tabs ── */}
              <div className="cl-tabs" style={{ marginBottom: 24 }}>
                <button
                  className={`cl-tab ${activeTab === "create" ? "active" : ""}`}
                  onClick={() => setActiveTab("create")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Create Lead
                </button>
                <button
                  className={`cl-tab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  All Leads
                  {leads.length > 0 && (
                    <span className="cl-tab-count">{leads.length}</span>
                  )}
                </button>
              </div>

              {/* ══════════════════════════════════════════
                  TAB: CREATE LEAD
              ══════════════════════════════════════════ */}
              {activeTab === "create" && (
                <>
                  {/* Progress Indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    {fields.map((f) => (
                      <div
                        key={f.name}
                        className={`cl-dot ${form[f.name as keyof typeof form] ? "done" : focused === f.name ? "active" : ""}`}
                      />
                    ))}
                    <div className={`cl-dot ${focused === "urgency" ? "active" : ""}`} />
                    <span style={{ fontSize: 11, color: "#b0bcd4", marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                      {Object.values(form).filter(v => v && v !== "within_3_days").length + (form.urgency ? 1 : 0)}/{fields.length + 1} filled
                    </span>
                  </div>

                  <div className="cl-card">
                    {submitted && (
                      <div className="cl-success-overlay">
                        <div style={{
                          width: 64, height: 64, borderRadius: "50%",
                          background: "linear-gradient(135deg,#22c55e,#16a34a)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 20px rgba(34,197,94,.35)",
                        }}>
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#166534" }}>Lead Created!</p>
                        <p style={{ fontSize: 13, color: "#4ade80" }}>Resetting form...</p>
                      </div>
                    )}

                    {/* Student Details */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <span className="cl-badge">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" strokeLinecap="round" />
                          </svg>
                          Student Details
                        </span>
                      </div>
                      <div className="cl-grid-2">
                        {fields.slice(0, 3).map((f) => (
                          <div key={f.name} className="cl-field-wrap" style={f.name === "phone" ? { gridColumn: "1/-1" } : {}}>
                            <label className="cl-label">{f.icon} {f.label}</label>
                            <input
                              type={f.type} name={f.name} placeholder={f.placeholder}
                              value={form[f.name as keyof typeof form]}
                              onChange={handleChange}
                              onFocus={() => setFocused(f.name)}
                              onBlur={() => setFocused(null)}
                              className={`cl-input ${form[f.name as keyof typeof form] ? "filled" : ""}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ height: 1, background: "#f0f3fb", margin: "4px 0 20px" }} />

                    {/* Academic Info */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <span className="cl-badge" style={{ background: "#fdf4ff", color: "#9333ea" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Academic Info
                        </span>
                      </div>
                      <div className="cl-grid-2">
                        {fields.slice(3, 7).map((f) => (
                          <div key={f.name} className="cl-field-wrap">
                            <label className="cl-label">{f.icon} {f.label}</label>
                            <input
                              type={f.type} name={f.name} placeholder={f.placeholder}
                              value={form[f.name as keyof typeof form]}
                              onChange={handleChange}
                              onFocus={() => setFocused(f.name)}
                              onBlur={() => setFocused(null)}
                              className={`cl-input ${form[f.name as keyof typeof form] ? "filled" : ""}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ height: 1, background: "#f0f3fb", margin: "4px 0 20px" }} />

                    {/* Urgency */}
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <span className="cl-badge" style={{ background: "#fff7ed", color: "#ea580c" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Priority / Urgency
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        {urgencyOptions.map((opt) => (
                          <label key={opt.value} style={{
                            flex: 1, display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 6, padding: "14px 10px",
                            borderRadius: 12, cursor: "pointer",
                            border: form.urgency === opt.value ? "2px solid #4f6ef7" : "2px solid #e2e8f3",
                            background: form.urgency === opt.value ? "#f5f7ff" : "#fff",
                            transition: "all .2s",
                          }}>
                            <input type="radio" name="urgency" value={opt.value}
                              checked={form.urgency === opt.value}
                              onChange={handleChange} style={{ display: "none" }} />
                            <span style={{ fontSize: 20 }}>{opt.label.split(" ")[0]}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, textAlign: "center",
                              color: form.urgency === opt.value ? "#4f6ef7" : "#7c8db5" }}>
                              {opt.label.split(" ").slice(1).join(" ")}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading} className="cl-btn">
                      {!loading && <span className="cl-btn-shine" />}
                      {loading ? (
                        <><span className="cl-spinner" /> Creating Lead...</>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Create Lead
                        </>
                      )}
                    </button>
                    <p style={{ textAlign: "center", fontSize: 12, color: "#b0bcd4", marginTop: 14 }}>
                      Lead will be visible instantly in the Leads dashboard
                    </p>
                  </div>
                </>
              )}

              {/* ══════════════════════════════════════════
                  TAB: ALL LEADS
              ══════════════════════════════════════════ */}
              {activeTab === "all" && (
                <div>
                  {/* ── Toolbar ── */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                    {/* Search */}
                    <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0bcd4" strokeWidth={2}
                        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                      </svg>
                      <input
                        className="cl-search"
                        placeholder="Search by name, subject, location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    {/* Status filters */}
                    {["all", "pending", "active", "assigned", "closed"].map((s) => (
                      <button
                        key={s}
                        className={`cl-filter-btn ${statusFilter === s ? "active" : ""}`}
                        onClick={() => setStatusFilter(s)}
                      >
                        {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}

                    {/* Refresh */}
                    <button className="cl-refresh-btn" onClick={fetchLeads} disabled={leadsLoading}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                        style={{ animation: leadsLoading ? "cl-spin .7s linear infinite" : "none" }}>
                        <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Refresh
                    </button>
                  </div>

                  {/* ── Stats strip ── */}
                  {leads.length > 0 && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                      {[
                        { label: "Total", count: leads.length, color: "#4f6ef7", bg: "#eff2ff" },
                        { label: "Pending", count: leads.filter(l => l.status === "pending").length, color: "#ea580c", bg: "#fff7ed" },
                        { label: "Active", count: leads.filter(l => l.status === "active").length, color: "#16a34a", bg: "#f0fdf4" },
                        { label: "Assigned", count: leads.filter(l => l.status === "assigned").length, color: "#2563eb", bg: "#eff6ff" },
                      ].map((s) => (
                        <div key={s.label} style={{
                          padding: "8px 16px", borderRadius: 10,
                          background: s.bg, display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>
                            {s.count}
                          </span>
                          <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Lead List ── */}
                  {leadsLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                      <span className="cl-spinner-dark" />
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="cl-empty">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d9ef" strokeWidth={1.5} style={{ margin: "0 auto 12px", display: "block" }}>
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                      </svg>
                      <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>No leads found</p>
                      <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {filteredLeads.map((l: any, idx) => {
             const st = statusConfig[l.status as keyof typeof statusConfig] ?? statusConfig.pending;

const urg = urgencyBadge[l.urgency as keyof typeof urgencyBadge] ?? urgencyBadge.within_3_days;
                        return (
                          <div key={l._id} className="cl-lead-card">
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>

                              {/* ── Left: Name + chips ── */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                                  {/* Index */}
                                  <span style={{
                                    width: 26, height: 26, borderRadius: 8,
                                    background: "linear-gradient(135deg,#4f6ef7,#7c3af9)",
                                    color: "#fff", fontSize: 11, fontWeight: 700,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0, fontFamily: "'JetBrains Mono', monospace",
                                  }}>
                                    {idx + 1}
                                  </span>
                                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1a2340" }}>
                                    {l.student?.name || "—"}
                                  </span>
                                  <span className="cl-chip">Class {l.student?.class_grade || "—"}</span>
                                  {l.type && <span className="cl-chip">{l.type}</span>}
                                </div>

                                {/* Info grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "4px 20px" }}>
                                  {[
                                    { icon: "👤", label: "Parent", val: `${l.parent?.name || "—"} · ${l.parent?.phone || ""}` },
                                    { icon: "📚", label: "Subject", val: Array.isArray(l.academicNeeds) ? l.academicNeeds.join(", ") : l.academicNeeds || "—" },
                                    { icon: "📍", label: "Location", val: l.location || "—" },
                                    { icon: "🏫", label: "Board", val: l.board || "—" },
                                  ].map((item) => (
                                    <div key={item.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                                      <span style={{ fontSize: 12 }}>{item.icon}</span>
                                      <span style={{ fontSize: 12, color: "#7c8db5", fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}:</span>
                                      <span style={{ fontSize: 12, color: "#1a2340", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item.val}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* ── Right: Status + Urgency ── */}
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                                <span className="cl-status-pill" style={{ background: st.bg, color: st.color }}>
                                  <span className="cl-status-dot" style={{ background: st.dot }} />
                                  {st?.label}
                                </span>
                                {l.urgency && (
                                  <span style={{ fontSize: 11, color: urg.color, fontWeight: 600 }}>
                                    {urg?.emoji} {l.urgency.replace(/_/g, " ")}
                                  </span>
                                )}
                                {l.createdAt && (
                                  <span style={{ fontSize: 10, color: "#b0bcd4", fontFamily: "'JetBrains Mono', monospace" }}>
                                    {new Date(l.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
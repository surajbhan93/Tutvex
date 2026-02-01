import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import SectionHeader from "@/components/common/SectionHeader";
import TeamCard from "@/components/common/TeamCard";

/* ======================
   TYPES
====================== */
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  isFounder?: boolean;
}

/* ======================
   COMPONENT
====================== */
export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     FETCH TEAM
  ====================== */
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await apiClient.get("/team");
        setTeam(res.data.data || []);
      } catch {
        setError("Failed to load team");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  /* ======================
     SPLIT FOUNDER / MEMBERS
  ====================== */
  const founder = team.find((m) => m.isFounder === true);
  const members = team.filter((m) => !m.isFounder);

  return (
    <section id="team" className="relative py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Meet Our Team"
          subtitle="A passionate group of educators, technologists, and mentors building the future of learning."
        />

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur animate-pulse"
              >
                <div className="h-24 w-24 rounded-full bg-gray-300 mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Founder */}
        {!loading && founder && (
          <div className="flex justify-center mb-20">
            <div className="max-w-md">
              {/* 👇 ALWAYS pass member */}
              <TeamCard member={founder} />
            </div>
          </div>
        )}

        {/* Members */}
        {!loading && !error && members.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {members.map((m) => (
              <TeamCard key={m._id} member={m} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && team.length === 0 && (
          <p className="text-center text-gray-500">
            No team members found
          </p>
        )}
      </div>
    </section>
  );
}

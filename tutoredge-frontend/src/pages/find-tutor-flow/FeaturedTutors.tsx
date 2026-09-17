import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<any[]>([]);

  useEffect(() => {
    apiClient
      .get("/api/v1/tutors/featured")
      .then((res) => setTutors(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold mb-4">
        Featured Tutors
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {tutors.map((t) => (
          <div
            key={t._id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h3 className="font-semibold">{t.fullName}</h3>
            <p className="text-sm text-gray-600">
              Rating ⭐ {t.rating} • Views {t.profileViews}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

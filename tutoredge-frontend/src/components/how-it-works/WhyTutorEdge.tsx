import {
  ShieldCheck,
  Users,
  BookOpen,
  Wallet,
  BarChart3,
  Star,
} from "lucide-react";

export default function WhyTutvex() {
  return (
    <section
      className="
        relative mt-24
        bg-gradient-to-br from-indigo-50 via-white to-white
        rounded-3xl
        px-6 py-16
      "
    >
      {/* ======================
          HEADER
      ====================== */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Why Choose <span className="text-indigo-600">Tutvex</span>?
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Tutvex is a trusted school tutoring platform designed for
          parents seeking reliable teachers and tutors looking to grow
          their teaching career — all in one secure ecosystem.
        </p>
      </div>

      {/* ======================
          CONTENT GRID
      ====================== */}
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
        
        {/* ======================
            FOR PARENTS
        ====================== */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="text-indigo-600" />
            For Parents & Students
          </h3>

          <ul className="space-y-5 text-gray-700">
            <li className="flex gap-3">
              <ShieldCheck className="text-green-600 mt-1" />
              <span>
                <strong>Verified Tutors:</strong> Every tutor is phone-verified,
                interviewed, and approved by Tutvex experts.
              </span>
            </li>

            <li className="flex gap-3">
              <BookOpen className="text-indigo-600 mt-1" />
              <span>
                <strong>All Subjects & Boards:</strong> Maths, Science,
                Commerce, Languages for CBSE, ICSE & State Boards.
              </span>
            </li>

            <li className="flex gap-3">
              <Star className="text-yellow-500 mt-1" />
              <span>
                <strong>Replacement Guarantee:</strong> Not satisfied?
                We assign another verified tutor — no stress.
              </span>
            </li>

            <li className="flex gap-3">
              <BarChart3 className="text-indigo-600 mt-1" />
              <span>
                <strong>Parent Dashboard:</strong> Track attendance,
                performance reports, test scores, and payments.
              </span>
            </li>
          </ul>
        </div>

        {/* ======================
            FOR TUTORS
        ====================== */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="text-indigo-600" />
            For Tutors
          </h3>

          <ul className="space-y-5 text-gray-700">
            <li className="flex gap-3">
              <Users className="text-indigo-600 mt-1" />
              <span>
                <strong>Real Student Leads:</strong> Get matched with
                students based on subject, class, and location.
              </span>
            </li>

            <li className="flex gap-3">
              <Wallet className="text-green-600 mt-1" />
              <span>
                <strong>Transparent Payments:</strong> Track earnings,
                payouts, and payment history from your dashboard.
              </span>
            </li>

            <li className="flex gap-3">
              <ShieldCheck className="text-indigo-600 mt-1" />
              <span>
                <strong>Professional Growth:</strong> Build credibility
                with verified profiles and long-term students.
              </span>
            </li>

            <li className="flex gap-3">
              <BarChart3 className="text-indigo-600 mt-1" />
              <span>
                <strong>Tutor Dashboard:</strong> Manage assignments,
                students taught, availability, and income easily.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ======================
          TRUST FOOTER
      ====================== */}
      <div className="max-w-4xl mx-auto mt-16 text-center text-gray-600">
        Tutvex bridges the gap between parents and quality teachers by
        ensuring trust, transparency, and results — making learning
        stress-free and effective for everyone.
      </div>
    </section>
  );
}

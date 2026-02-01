import { motion,Variants } from "framer-motion";
import {
  UserPlus,
  ClipboardCheck,
  ShieldCheck,
  Video,
  CheckCircle,
  LayoutDashboard,
  Wallet,
  Users,
  ArrowRight,
} from "lucide-react";
import { Card, Button, Badge } from "flowbite-react";

/* ======================
   ANIMATION VARIANTS
====================== */
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

/* ======================
   STEP DATA
====================== */
const STEPS = [
  {
    step: "1",
    title: "Register as a Tutor",
    desc:
      "Click on “Become a Tutor” and complete the registration form with your subjects, qualifications, and teaching experience.",
    icon: UserPlus,
  },
  {
    step: "2",
    title: "OTP & Profile Verification",
    desc:
      "Verify your phone number via OTP and submit your details for background and profile verification.",
    icon: ShieldCheck,
  },
  {
    step: "3",
    title: "Internal Review (2–3 Days)",
    desc:
      "Our team reviews your profile, documents, and subject expertise to ensure quality standards.",
    icon: ClipboardCheck,
  },
  {
    step: "4",
    title: "Interview & Demo Session",
    desc:
      "Attend a short interview or demo session to evaluate teaching skills and subject clarity.",
    icon: Video,
  },
  {
    step: "5",
    title: "Final Selection",
    desc:
      "Once you pass all rounds, you are officially onboarded as a Tutvex tutor.",
    icon: CheckCircle,
  },
  {
    step: "6",
    title: "Get Tutor Dashboard",
    desc:
      "Access your personal dashboard to manage students, assignments, payments, and teaching schedule.",
    icon: LayoutDashboard,
  },
];

/* ======================
   DASHBOARD FEATURES
====================== */
const DASHBOARD_FEATURES = [
  {
    label: "Assignments & Classes",
    icon: ClipboardCheck,
  },
  {
    label: "Payments & Earnings",
    icon: Wallet,
  },
  {
    label: "Students You Teach",
    icon: Users,
  },
  {
    label: "Online / Offline Teaching",
    icon: Video,
  },
];

/* ======================
   COMPONENT
====================== */
export default function TutorFlow() {
  return (
    <section className="relative mt-24 space-y-24">

      {/* ======================
          BACKGROUND
      ====================== */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white" />

      {/* ======================
          HEADER
      ====================== */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center space-y-6"
      >
        <Badge color="indigo" size="lg">
          Become a Tutor at Tutvex
        </Badge>

        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          How It Works for Tutors
        </h2>

        <p className="text-lg text-gray-600">
          Join Tutvex as a subject expert and start teaching students
          across CBSE, ICSE, and State Boards through a structured,
          transparent onboarding process.
        </p>

        <Button
          size="xl"
          className="
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            text-white font-semibold
            px-8 py-3 rounded-xl
            shadow-lg hover:shadow-xl
            transition-all
          "
          href="/tutor-flow/tutor-registration/"
        >
          Become a Tutor
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </motion.header>

      {/* ======================
          STEP FLOW
      ====================== */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {STEPS.map((step) => (
          <motion.div key={step.step} variants={fadeUp}>
            <Card className="h-full rounded-2xl shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <step.icon size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-indigo-600">
                    Step {step.step}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {step.desc}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* ======================
          VIDEO SECTION
      ====================== */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid lg:grid-cols-2 gap-10 items-center"
      >
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-gray-900">
            Watch How Tutvex Works for Tutors
          </h3>
          <p className="text-gray-600">
            Get a quick overview of the tutor onboarding process,
            interview flow, dashboard features, and earning structure.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Simple registration & verification</li>
            <li>• Transparent interview process</li>
            <li>• Dedicated tutor dashboard</li>
            <li>• Regular payments & student tracking</li>
          </ul>
        </div>

        {/* Video */}
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Tutvex Tutor Onboarding"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </motion.section>

      {/* ======================
          DASHBOARD FEATURES
      ====================== */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-indigo-600 text-white rounded-3xl p-10"
      >
        <h3 className="text-3xl font-bold mb-8 text-center">
          Your Tutor Dashboard Includes
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600">
                <f.icon size={22} />
              </div>
              <p className="font-medium">{f.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ======================
          FINAL CTA
      ====================== */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-6"
      >
        <h3 className="text-3xl font-extrabold text-gray-900">
          Ready to Start Teaching?
        </h3>

        <p className="max-w-2xl mx-auto text-gray-600">
          Join Tutvex today and become part of a growing community
          of professional tutors making real academic impact.
        </p>

        <Button
          size="xl"
          className="
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            text-white font-semibold
            px-8 py-3 rounded-xl
            shadow-lg hover:shadow-xl
          "
          href="/tutor-flow/tutor-registration/"
        >
          Register as a Tutor
        </Button>
      </motion.footer>
    </section>
  );
}

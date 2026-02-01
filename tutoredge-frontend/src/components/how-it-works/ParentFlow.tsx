import { motion,Variants } from "framer-motion";
import {
  Search,
  UserPlus,
  ClipboardList,
  Users,
  ShieldCheck,
  Home,
  RefreshCcw,
  LayoutDashboard,
  BarChart3,
  Wallet,
  CalendarCheck,
  Video,
  ArrowRight,
} from "lucide-react";
import { Card, Button, Badge } from "flowbite-react";

/* ======================
   ANIMATIONS
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
   PARENT STEPS
====================== */
const PARENT_STEPS = [
  {
    step: "1",
    title: "Create Parent Account",
    desc:
      "Click on “Find a Tutor” and register on Tutvex by creating your parent account.",
    icon: UserPlus,
  },
  {
    step: "2",
    title: "Add Student Details",
    desc:
      "Enter student class, subject, board, medium, and learning preferences.",
    icon: ClipboardList,
  },
  {
    step: "3",
    title: "Get Matching Tutors",
    desc:
      "Based on your requirements, we show you the most suitable verified tutors.",
    icon: Search,
  },
  {
    step: "4",
    title: "Send Tutor Request",
    desc:
      "Review tutor profiles and send a request to the tutor you prefer.",
    icon: Users,
  },
  {
    step: "5",
    title: "Parent Verification",
    desc:
      "Our team verifies parent details to ensure a safe and trusted learning environment.",
    icon: ShieldCheck,
  },
  {
    step: "6",
    title: "Tutor Assigned to Home",
    desc:
      "A verified Tutvex tutor is sent to your home for teaching.",
    icon: Home,
  },
  {
    step: "7",
    title: "Tutor Replacement if Needed",
    desc:
      "If you are not satisfied, we provide another verified tutor at no extra hassle.",
    icon: RefreshCcw,
  },
  {
    step: "8",
    title: "Access Parent Dashboard",
    desc:
      "Manage students, track performance, attendance, payments, and more.",
    icon: LayoutDashboard,
  },
];

/* ======================
   DASHBOARD FEATURES
====================== */
const DASHBOARD_FEATURES = [
  {
    label: "Multiple Students",
    icon: Users,
  },
  {
    label: "Monthly Performance Reports",
    icon: BarChart3,
  },
  {
    label: "Attendance Tracking",
    icon: CalendarCheck,
  },
  {
    label: "Test Series & Assessments",
    icon: ClipboardList,
  },
  {
    label: "Payments & Invoices",
    icon: Wallet,
  },
  {
    label: "Tutor Communication",
    icon: Video,
  },
];

/* ======================
   COMPONENT
====================== */
export default function ParentFlow() {
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
          For Parents & Students
        </Badge>

        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          How Tutvex Works for Parents
        </h2>

        <p className="text-lg text-gray-600">
          Tutvex simplifies the entire process of finding,
          verifying, and managing tutors for your child —
          ensuring quality, safety, and measurable academic progress.
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
          href="/find-tutor-flow/create-account/"
        >
          Find a Tutor
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
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {PARENT_STEPS.map((step) => (
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
            Watch How Parents Use Tutvex
          </h3>
          <p className="text-gray-600">
            Understand how Tutvex verifies tutors, assigns the
            right teacher, and helps parents track academic progress
            through a powerful dashboard.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Safe & verified tutors</li>
            <li>• Home tutor replacement support</li>
            <li>• Monthly performance reports</li>
            <li>• Transparent payments</li>
          </ul>
        </div>

        {/* Video */}
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Tutvex Parent Flow"
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
          Parent Dashboard Features
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          Ready to Find the Right Tutor for Your Child?
        </h3>

        <p className="max-w-2xl mx-auto text-gray-600">
          Join thousands of parents who trust Tutvex for
          safe, reliable, and result-oriented home tutoring.
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
          href="/find-tutor-flow/create-account/"
        >
          Get Started Now
        </Button>
      </motion.footer>
    </section>
  );
}

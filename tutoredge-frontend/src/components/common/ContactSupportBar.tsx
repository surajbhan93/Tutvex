import { Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  hidden?: boolean;
}

export default function ContactSupportBar({ hidden }: Props) {
  if (hidden) return null; // 👈 form submit ke baad hide

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        sticky top-0 z-50
        w-full bg-gradient-to-r from-indigo-600 to-purple-600
        text-white shadow-md
      "
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-center md:text-left">
          <span className="font-semibold">Have questions?</span>{" "}
          Fill out the form below or connect with our support team —
          we’ll reach out as soon as possible.
        </p>

        <div className="flex items-center gap-3">
          <a
            href="#contact-form"
            className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
          >
            <MessageSquare size={16} /> Contact Support
          </a>

          <a
            href="tel:+91XXXXXXXXXX"
            className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-medium"
          >
            <Phone size={16} /> Call Now
          </a>
        </div>
      </div>
    </motion.div>
  );
}

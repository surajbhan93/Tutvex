import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import apiClient from "@/lib/apiClient";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import ContactSupportBar from "@/components/common/ContactSupportBar";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
const [formSubmitted, setFormSubmitted] = useState(false);

 useEffect(() => {
  if (!formSubmitted) return;

  const timer = setTimeout(() => {
    setFormSubmitted(false);
  }, 15000); // 15 seconds

  return () => clearTimeout(timer);
}, [formSubmitted]);

  /* ======================
     FIXED handleChange
  ====================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ======================
     SUBMIT FORM
  ====================== */
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await apiClient.post("/contact", form);
     setFormSubmitted(true);

      toast.custom(
        (t) => (
          <div
            className={`
              ${t.visible ? "animate-enter" : "animate-leave"}
              max-w-md w-full bg-white/80 backdrop-blur-xl
              shadow-2xl rounded-2xl pointer-events-auto
              ring-1 ring-black/5
            `}
          >
            <div className="flex items-start gap-4 p-4">
              <CheckCircle2 className="h-6 w-6 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Message delivered
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Our team will contact you shortly.
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-2xl" />
          </div>
        ),
        { duration: 4000 }
      );

      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.custom(
        (t) => (
          <div
            className={`
              ${t.visible ? "animate-enter" : "animate-leave"}
              max-w-md w-full bg-white/90 backdrop-blur-xl
              shadow-2xl rounded-2xl pointer-events-auto
              ring-1 ring-black/5
            `}
          >
            <div className="flex items-start gap-4 p-4">
              <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Message not sent
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Please try again in a moment.
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-b-2xl" />
          </div>
        ),
        { duration: 4000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
 <ContactSupportBar hidden={formSubmitted} />  {/* 👈 YAHAN ADD KARO */}
      <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT: FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h1 className="text-3xl font-bold mb-2">Contact Tutvex</h1>
            <p className="text-gray-500 mb-6">
              Let us know how we can help you
            </p>
       {formSubmitted && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800"
  >
    <p className="font-semibold">
      ✅ Your form has been submitted successfully
    </p>
    <p className="text-sm mt-1">
      Our support team will contact you as soon as possible.
    </p>
  </motion.div>
)}

            <form onSubmit={submitForm} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Your Message"
                required
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />

              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* RIGHT: DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Tutvex</h2>

            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-indigo-600" />
                <span>Tutvex@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-indigo-600" />
                <span>+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-600" />
                <span>India</span>
              </div>
            </div>

            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
            >
              <MessageCircle />
              Chat on WhatsApp
            </a>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                title="Tutvex Location"
                src="https://www.google.com/maps?q=India&output=embed"
                width="100%"
                height="250"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

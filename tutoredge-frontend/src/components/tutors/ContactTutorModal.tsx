import React, { useState } from "react";
import { X, Send, Phone, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveImage } from "@/lib/resolveImage";

interface Props {
  tutor: any | null;
  onClose: () => void;
}

export const ContactTutorModal: React.FC<Props> = ({ tutor, onClose }) => {
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [classReq, setClassReq] = useState("");
  const [sent, setSent] = useState(false);

  if (!tutor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);

    // Also route to Tutvex official WhatsApp helpline with pre-filled message
    const tutorName = tutor.fullName || tutor.name || "Tutor";
    const msg = encodeURIComponent(
      `Hello Tutvex, I would like to connect with Tutor ${tutorName} for Class ${classReq || "Student"}.\nParent Name: ${parentName}\nPhone: ${phone}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919305275932?text=${msg}`, "_blank");
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden p-6 text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header info */}
          <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 ring-2 ring-indigo-500/40 flex-shrink-0">
              <img
                src={resolveImage(tutor.profileImage)}
                alt={tutor.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg text-white">{tutor.fullName}</h3>
                <CheckCircle2 size={16} className="text-blue-400" />
              </div>
              <p className="text-xs text-indigo-300 font-medium">{tutor.headline || "Subject Specialist"}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                📍 {tutor.location?.area || "Local Area"}, {tutor.location?.city || tutor.city || "India"}
              </p>
            </div>
          </div>

          {sent ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-lg font-bold text-white">Contact Request Received!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Connecting you directly via Tutvex Support on WhatsApp...
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
                  Parent / Student Name
                </label>
                <input
                  required
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
                  Class / Subject Requirement
                </label>
                <input
                  type="text"
                  value={classReq}
                  onChange={(e) => setClassReq(e.target.value)}
                  placeholder="e.g. Class 10 Maths Home Tuition"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                <ShieldCheck size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  🔒 Your contact information is protected under Tutvex Privacy Policy and shared only with approved educators.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>Request Free Tutor Demo</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactTutorModal;

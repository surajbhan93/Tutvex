import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface LeadActionsProps {
  tutorName: string;
  onBookDemo: () => void;
  onRequestTutor?: () => void;
  onWhatsApp?: () => void;
  onRequestCallback?: () => void;
  showAllActions?: boolean;
}

export default function LeadActions({
  tutorName,
  onBookDemo,
  onRequestTutor,
  onWhatsApp,
  onRequestCallback,
  showAllActions = true,
}: LeadActionsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Start Learning with {tutorName}?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Take the first step towards academic excellence. Choose how you'd like to connect.
          </p>
        </motion.div>

        {/* Primary CTA - Book Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBookDemo}
            className="w-full sm:w-auto mx-auto flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group"
          >
            <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Book Free Demo Class Now</span>
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
          
          {/* Trust indicators below primary CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-white/90">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={16} className="text-emerald-300" />
              <span>No payment required</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={16} className="text-emerald-300" />
              <span>Instant confirmation</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={16} className="text-emerald-300" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>

        {showAllActions && (
          <>
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-purple-600 text-white/80 font-medium rounded-full">
                  Or choose another option
                </span>
              </div>
            </div>

            {/* Secondary Actions Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* WhatsApp */}
              {onWhatsApp && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onWhatsApp}
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 hover:border-white/30 rounded-2xl p-6 text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <MessageCircle size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    WhatsApp Tutor
                  </h3>
                  <p className="text-sm text-white/80">
                    Chat directly and get instant responses
                  </p>
                </motion.button>
              )}

              {/* Request Tutor */}
              {onRequestTutor && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRequestTutor}
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 hover:border-white/30 rounded-2xl p-6 text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Send size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Request This Tutor
                  </h3>
                  <p className="text-sm text-white/80">
                    Submit your requirements formally
                  </p>
                </motion.button>
              )}

              {/* Request Callback */}
              {onRequestCallback && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRequestCallback}
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 hover:border-white/30 rounded-2xl p-6 text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Phone size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Get a Callback
                  </h3>
                  <p className="text-sm text-white/80">
                    We'll call you within 1 hour
                  </p>
                </motion.button>
              )}
            </motion.div>
          </>
        )}

        {/* Bottom reassurance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-white/90 text-sm font-medium">
              Join 500+ happy students learning with verified tutors
            </p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

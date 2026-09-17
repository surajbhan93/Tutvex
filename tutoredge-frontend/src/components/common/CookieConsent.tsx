import { useState, useEffect } from "react";
import { X, Cookie, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCookieConsentStore, CookiePreferences } from "@/stores/useCookieConsentStore";

const CookieConsent = () => {
  const { preferences, showBanner, hasResponded, setPreferences, acceptAll, rejectAll, hideBanner } =
    useCookieConsentStore();

  const [showCustomize, setShowCustomize] = useState(false);
  const [customPrefs, setCustomPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
    advertising: false,
    timestamp: new Date().toISOString(),
  });

  // Only show banner if user hasn't responded yet
  const shouldShowBanner = showBanner && !hasResponded && !preferences;

  useEffect(() => {
    if (preferences) {
      setCustomPrefs(preferences);
    }
  }, [preferences]);

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const handleSaveCustom = () => {
    setPreferences(customPrefs);
    setShowCustomize(false);
  };

  const handleClose = () => {
    // Close without saving - don't enable non-essential cookies
    hideBanner();
  };

  if (!shouldShowBanner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Cookie className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {!showCustomize ? (
            <>
              {/* Main Content */}
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
                Cookie & Privacy Settings
              </h2>

              <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
                We and our vendors use cookies and similar technologies to enhance your experience,
                analyze site traffic, personalize content, and deliver targeted advertising. We need
                your consent to use non-essential cookies. You can choose which categories to allow
                below.
              </p>

              <div className="mb-6 text-center">
                <Link
                  href="/cookie-policy"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View Cookie Policy →
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowCustomize(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <Settings size={18} />
                  Customize My Choices
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRejectAll}
                    className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Reject All
                  </button>

                  <button
                    onClick={handleAcceptAll}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Accept All
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <p className="mt-4 text-center text-xs text-gray-500">
                By clicking "Accept All", you consent to all cookie categories. Necessary cookies
                are always active.
              </p>
            </>
          ) : (
            <>
              {/* Customize Panel */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Customize Cookie Preferences</h2>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back
                </button>
              </div>

              <p className="mb-6 text-sm text-gray-600">
                Choose which types of cookies you want to allow. Necessary cookies cannot be
                disabled as they are required for the website to function.
              </p>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {/* Necessary Cookies */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield size={18} className="text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Necessary Cookies</h3>
                        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          Always Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        These cookies are required for the website to function properly and cannot
                        be disabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="h-6 w-11 rounded-full bg-blue-600 opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies help us understand how visitors use Tutvex so we can improve
                        the website.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setCustomPrefs((prev) => ({ ...prev, analytics: !prev.analytics }))
                      }
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        customPrefs.analytics ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          customPrefs.analytics ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies enable enhanced functionality and personalization.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setCustomPrefs((prev) => ({ ...prev, functional: !prev.functional }))
                      }
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        customPrefs.functional ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          customPrefs.functional ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Advertising Cookies</h3>
                      <p className="text-sm text-gray-600">
                        These cookies may be used to personalize advertising and measure advertising
                        performance.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setCustomPrefs((prev) => ({ ...prev, advertising: !prev.advertising }))
                      }
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        customPrefs.advertising ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          customPrefs.advertising ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6">
                <button
                  onClick={handleSaveCustom}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Save My Choices
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CookieConsent;

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  advertising: boolean;
  timestamp: string;
}

interface CookieConsentState {
  preferences: CookiePreferences | null;
  showBanner: boolean;
  hasResponded: boolean;
  setPreferences: (prefs: CookiePreferences) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  hideBanner: () => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false,
  timestamp: new Date().toISOString(),
};

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      preferences: null,
      showBanner: true,
      hasResponded: false,

      setPreferences: (prefs: CookiePreferences) => {
        set({
          preferences: { ...prefs, timestamp: new Date().toISOString() },
          showBanner: false,
          hasResponded: true,
        });
        
        // Apply consent to tracking scripts
        if (typeof window !== "undefined") {
          applyConsentToTracking(prefs);
        }
      },

      acceptAll: () => {
        const allAccepted: CookiePreferences = {
          necessary: true,
          analytics: true,
          functional: true,
          advertising: true,
          timestamp: new Date().toISOString(),
        };
        get().setPreferences(allAccepted);
      },

      rejectAll: () => {
        get().setPreferences(defaultPreferences);
      },

      hideBanner: () => {
        // Just hide banner without saving consent
        set({ showBanner: false });
      },

      resetConsent: () => {
        set({
          preferences: null,
          showBanner: true,
          hasResponded: false,
        });
      },
    }),
    {
      name: "tutvex_cookie_consent",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        hasResponded: state.hasResponded,
      }),
    }
  )
);

/**
 * Apply consent preferences to tracking scripts
 */
function applyConsentToTracking(prefs: CookiePreferences) {
  // Google Analytics
  if (prefs.analytics) {
    enableGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
  }

  // Meta Pixel / Facebook Pixel
  if (prefs.advertising) {
    enableMetaPixel();
  } else {
    disableMetaPixel();
  }

  // Microsoft Clarity
  if (prefs.analytics) {
    enableClarity();
  } else {
    disableClarity();
  }

  // Google Tag Manager
  if (prefs.analytics || prefs.advertising) {
    enableGoogleTagManager();
  } else {
    disableGoogleTagManager();
  }
}

function enableGoogleAnalytics() {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }
}

function disableGoogleAnalytics() {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

function enableMetaPixel() {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("consent", "grant");
  }
}

function disableMetaPixel() {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("consent", "revoke");
  }
}

function enableClarity() {
  if (typeof window !== "undefined" && (window as any).clarity) {
    (window as any).clarity("consent");
  }
}

function disableClarity() {
  // Clarity doesn't have a built-in disable, we prevent initialization
  console.log("Clarity tracking disabled");
}

function enableGoogleTagManager() {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "consent_update",
      consent: "granted",
    });
  }
}

function disableGoogleTagManager() {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "consent_update",
      consent: "denied",
    });
  }
}

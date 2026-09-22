// src/pages/_app.tsx
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import GlobalSEO from "@/components/seo/GlobalSEO";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useCookieConsentStore } from "@/stores/useCookieConsentStore";

// Lazy load heavy components
const StartupLoader = dynamic(() => import("@/components/StartupLoader"), {
  ssr: false,
});

const CookieConsent = dynamic(() => import("@/components/common/CookieConsent"), {
  ssr: false,
});

const NotificationPermissionPopup = dynamic(() => import("@/components/NotificationPermissionPopup"), {
  ssr: false,
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { preferences } = useCookieConsentStore();

  // Check if analytics is enabled
  const analyticsEnabled = preferences?.analytics || false;

  // Check if current page needs Razorpay
  const needsRazorpay = router.pathname.includes('/payment') || 
                        router.pathname.includes('/subscription') ||
                        router.pathname.includes('/parent/payments');

  /* ======================
     STARTUP LOADER TIMER
  ====================== */
useEffect(() => {
  const handleLoad = () => setLoading(false);

  if (document.readyState === "complete") {
    handleLoad();
  } else {
    window.addEventListener("load", handleLoad);
  }

  return () => window.removeEventListener("load", handleLoad);
}, []);

  /* ======================
     CTA CLICK TRACKING (only if analytics enabled)
  ====================== */
  useEffect(() => {
    if (!analyticsEnabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const action = target.closest("[data-gtag]") as HTMLElement;

      if (action && window.gtag) {
        window.gtag("event", action.dataset.gtag!, {
          event_category: "CTA",
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [analyticsEnabled]);

  /* ======================
     ROUTE CHANGE TRACKING (only if analytics enabled)
  ====================== */
  useEffect(() => {
    if (!GA_ID || !analyticsEnabled) return;

    const handleRouteChange = (url: string) => {
      if (typeof window.gtag === "function") {
        window.gtag("config", GA_ID, {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, analyticsEnabled]);

  /* ======================
     RENDER
  ====================== */
  return (
    <>
      {/* 🔥 STARTUP LOADER - Lazy loaded */}
      {loading && <StartupLoader isLoading={loading} />}

      {/* 🔥 MAIN APP (hide while loading) */}
      {!loading && (
        <>
          {/* Google Analytics - Only load if analytics is enabled */}
          {GA_ID && analyticsEnabled && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}

          {/* Razorpay - Only load on payment pages */}
          {needsRazorpay && (
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyOnload"
            />
          )}

          <GlobalSEO />
          <Component {...pageProps} />
          <Toaster position="top-right" reverseOrder={false} />
          
          {/* Cookie Consent Modal - Lazy loaded */}
          <CookieConsent />
          
          {/* Notification Permission Popup - Lazy loaded */}
          <NotificationPermissionPopup />
        </>
      )}
    </>
  );
}

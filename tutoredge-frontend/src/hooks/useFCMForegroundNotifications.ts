import React, { useEffect } from "react";
import { setupForegroundMessageListener } from "@/lib/firebase-messaging";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

/**
 * Hook to handle foreground FCM notifications
 * Shows a toast when a notification is received while the app is open
 */
export function useFCMForegroundNotifications() {
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function setupListener() {
      try {
        const unsub = await setupForegroundMessageListener((payload) => {
          console.log("Foreground notification received:", payload);

          const notification = payload.notification;
          const data = payload.data;

          if (!notification) return;

          // Show toast notification with custom action
          toast(
            (t) =>
              React.createElement(
                "div",
                {
                  className: "flex items-start gap-3 cursor-pointer",
                  onClick: () => {
                    toast.dismiss(t.id);
                    if (data?.url) {
                      router.push(data.url);
                    }
                  },
                },
                React.createElement(
                  "span",
                  { className: "text-2xl" },
                  getNotificationIcon(data?.type)
                ),
                React.createElement(
                  "div",
                  { className: "flex-1 min-w-0" },
                  React.createElement(
                    "p",
                    { className: "text-sm font-semibold text-slate-900" },
                    notification.title
                  ),
                  React.createElement(
                    "p",
                    { className: "text-xs text-slate-600 mt-0.5" },
                    notification.body
                  ),
                  React.createElement(
                    "p",
                    { className: "text-xs text-blue-600 font-medium mt-1.5" },
                    "Click to view →"
                  )
                )
              ),
            {
              duration: 6000,
              position: "top-right",
              style: {
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                maxWidth: "400px",
              },
            }
          );
        });

        unsubscribe = unsub;
      } catch (error) {
        console.error("Error setting up foreground message listener:", error);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);
}

function getNotificationIcon(type?: string): string {
  switch (type) {
    case "NEW_LEAD":
      return "🎯";
    case "LEAD_UNLOCKED":
      return "🔓";
    case "SUBSCRIPTION_ACTIVATED":
      return "✅";
    case "SUBSCRIPTION_EXPIRING":
      return "⏰";
    case "CREDITS_LOW":
      return "⚠️";
    case "CREDIT_PURCHASED":
      return "💳";
    case "PAYMENT_RECEIVED":
      return "💰";
    default:
      return "🔔";
  }
}

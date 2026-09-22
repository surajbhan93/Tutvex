"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  setupFCMNotifications,
  getNotificationPermissionStatus,
  isFCMSupported,
} from "@/lib/firebase-messaging";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function NotificationPermissionCard() {
  const [notificationStatus, setNotificationStatus] = useState<
    "checking" | "unsupported" | "denied" | "default" | "granted"
  >("checking");
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveTokens, setHasActiveTokens] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  async function checkNotificationStatus() {
    try {
      // Check if FCM is supported
      const supported = await isFCMSupported();
      if (!supported) {
        setNotificationStatus("unsupported");
        return;
      }

      // Check browser permission
      const permission = getNotificationPermissionStatus();
      setNotificationStatus(permission);

      // Check if user has active tokens registered
      if (permission === "granted") {
        try {
          const response = await apiClient.get("/notifications/token-status");
          if (response.data.success) {
            setHasActiveTokens(response.data.data.hasActiveTokens);
          }
        } catch (error) {
          console.error("Error checking token status:", error);
        }
      }
    } catch (error) {
      console.error("Error checking notification status:", error);
      setNotificationStatus("default");
    }
  }

  async function handleEnableNotifications() {
    setIsLoading(true);

    try {
      const result = await setupFCMNotifications();

      if (result.success) {
        toast.success("🔔 Notifications enabled successfully!");
        setNotificationStatus("granted");
        setHasActiveTokens(true);
      } else {
        toast.error(result.error || "Failed to enable notifications");
        
        // Update status based on error
        const permission = getNotificationPermissionStatus();
        setNotificationStatus(permission);
      }
    } catch (error: any) {
      console.error("Error enabling notifications:", error);
      toast.error("Failed to enable notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Don't show card if unsupported
  if (notificationStatus === "unsupported") {
    return (
      <div className="rounded-2xl bg-slate-100 border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-slate-200">
            <BellOff className="h-6 w-6 text-slate-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Browser Not Supported
            </h3>
            <p className="text-sm text-slate-600">
              Push notifications are not supported in this browser. Please use Chrome, Edge, or Firefox
              for the best experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't show card if permission denied
  if (notificationStatus === "denied") {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-100">
            <BellOff className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Notifications Blocked
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Notifications are currently disabled. To enable them, please update your browser settings:
            </p>
            <ol className="text-xs text-slate-600 space-y-1 ml-4 list-decimal">
              <li>Click the lock icon (🔒) in the address bar</li>
              <li>Find "Notifications" and change to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Show checking state
  if (notificationStatus === "checking") {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-6">
        <div className="flex items-center justify-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Checking notification status...</span>
        </div>
      </div>
    );
  }

  // Show enabled state
  if (notificationStatus === "granted" && hasActiveTokens) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-green-500 text-white shadow-md">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              🔔 Notifications Enabled
            </h3>
            <p className="text-sm text-slate-700 mb-3">
              You'll receive instant alerts when new student leads match your profile.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full inline-flex">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active and ready
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show enable prompt
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <Bell className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            📢 Enable Student Lead Alerts
          </h3>
          <p className="text-sm text-slate-700 mb-4">
            Get notified instantly when new tutoring opportunities match your profile. Never miss a
            lead again!
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Real-time alerts for matching student requirements</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Works even when Tutvex is closed</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Filter notifications based on your preferences</span>
            </div>
          </div>

          <button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enabling...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Enable Notifications
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 mt-3">
            <AlertCircle className="h-3 w-3 inline mr-1" />
            Your browser will ask for permission. Click "Allow" to continue.
          </p>
        </div>
      </div>
    </div>
  );
}

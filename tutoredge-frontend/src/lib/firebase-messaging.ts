// Firebase Cloud Messaging Configuration
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";
import { getFirebaseApp } from "./firebase";
import apiClient from "./apiClient";
import toast from "react-hot-toast";

let messaging: Messaging | null = null;

/**
 * Check if FCM is supported in the current browser
 */
export async function isFCMSupported(): Promise<boolean> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false;

    // Check if Notification API is supported
    if (!("Notification" in window)) return false;

    // Check if Service Worker is supported
    if (!("serviceWorker" in navigator)) return false;

    // Check if Firebase Messaging is supported
    const supported = await isSupported();
    return supported;
  } catch (error) {
    console.error("FCM support check failed:", error);
    return false;
  }
}

/**
 * Get Firebase Messaging instance (singleton)
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  try {
    if (!messaging) {
      const supported = await isFCMSupported();
      if (!supported) {
        console.warn("FCM is not supported in this browser");
        return null;
      }

      const app = getFirebaseApp();
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (error) {
    console.error("Failed to get Firebase Messaging:", error);
    return null;
  }
}

/**
 * Request notification permission from the browser
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  try {
    if (!("Notification" in window)) {
      throw new Error("Notifications not supported");
    }

    // If already granted, return immediately
    if (Notification.permission === "granted") {
      return "granted";
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Failed to request notification permission:", error);
    return "denied";
  }
}

/**
 * Get FCM registration token
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn("Messaging not available");
      return null;
    }

    // Check permission
    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    // Get VAPID key from environment
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("VAPID key not configured");
      return null;
    }

    // Register service worker first
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    await navigator.serviceWorker.ready;

    // Get token
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token obtained:", token.substring(0, 20) + "...");
      return token;
    } else {
      console.warn("No FCM token available");
      return null;
    }
  } catch (error: any) {
    console.error("Failed to get FCM token:", error);
    
    // Handle specific errors
    if (error.code === "messaging/permission-blocked") {
      console.error("Notification permission is blocked. Please enable it in browser settings.");
    } else if (error.code === "messaging/registration-token-not-subscribed-in-fcm-send") {
      console.error("Token not registered with FCM");
    }
    
    return null;
  }
}

/**
 * Register FCM token with backend
 */
export async function registerFCMToken(token: string): Promise<boolean> {
  try {
    // Get browser and platform info
    const userAgent = navigator.userAgent;
    let browser = "Unknown";
    
    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
      browser = "Chrome";
    } else if (userAgent.indexOf("Edg") > -1) {
      browser = "Edge";
    } else if (userAgent.indexOf("Firefox") > -1) {
      browser = "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
      browser = "Safari";
    }

    const response = await apiClient.post("/notifications/register-token", {
      token,
      platform: "web",
      browser,
      deviceId: generateDeviceId(),
    });

    if (response.data.success) {
      console.log("FCM token registered successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to register FCM token:", error);
    return false;
  }
}

/**
 * Unregister FCM token from backend
 */
export async function unregisterFCMToken(token: string): Promise<boolean> {
  try {
    const response = await apiClient.delete("/notifications/unregister-token", {
      data: { token },
    });

    if (response.data.success) {
      console.log("FCM token unregistered successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to unregister FCM token:", error);
    return false;
  }
}

/**
 * Setup foreground message listener
 */
export async function setupForegroundMessageListener(
  onNotification: (payload: any) => void
): Promise<(() => void) | null> {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      onNotification(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Failed to setup foreground message listener:", error);
    return null;
  }
}

/**
 * Generate a unique device ID (stored in localStorage)
 */
function generateDeviceId(): string {
  const storageKey = "tutvex_device_id";
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}

/**
 * Check current notification permission status
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

/**
 * Complete FCM setup flow
 * Returns: { success: boolean, token?: string, error?: string }
 */
export async function setupFCMNotifications(): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  try {
    // Check support
    const supported = await isFCMSupported();
    if (!supported) {
      return {
        success: false,
        error: "Push notifications are not supported in this browser.",
      };
    }

    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      return {
        success: false,
        error: "Notification permission was denied. Please enable it in browser settings.",
      };
    }

    // Get FCM token
    const token = await getFCMToken();
    if (!token) {
      return {
        success: false,
        error: "Failed to get notification token. Please try again.",
      };
    }

    // Register token with backend
    const registered = await registerFCMToken(token);
    if (!registered) {
      return {
        success: false,
        error: "Failed to register notification token with server.",
      };
    }

    return {
      success: true,
      token,
    };
  } catch (error: any) {
    console.error("FCM setup failed:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    };
  }
}

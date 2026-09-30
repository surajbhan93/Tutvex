import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
let app: FirebaseApp | undefined;
let messaging: Messaging | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0]!;
};

if (typeof window !== 'undefined') {
  app = getFirebaseApp();
  
  // Initialize messaging only in browser
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase messaging initialization error:', error);
  }
}

/**
 * Request notification permission and get FCM token (with fast fallback timeout)
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    console.log('🔔 Starting notification permission request...');

    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('❌ Browser does not support notifications');
      return `web_local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Request permission if not already granted
    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.warn('⚠️ Notification permission not granted:', permission);
      throw new Error(`Notification permission ${permission}`);
    }

    console.log('✅ Notification permission granted!');

    // Try FCM token with a strict 3.5s timeout so UI never hangs
    if ('serviceWorker' in navigator && messaging) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => null);
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        if (registration && vapidKey) {
          const tokenPromise = getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
          });

          const timeoutPromise = new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), 3500)
          );

          const fcmToken = await Promise.race([tokenPromise, timeoutPromise]);
          if (fcmToken) {
            console.log('✅ FCM Token received:', fcmToken.substring(0, 20) + '...');
            return fcmToken;
          }
        }
      } catch (swErr) {
        console.warn('FCM registration skipped, using local token:', swErr);
      }
    }

    // Fallback token for local/instant response
    const fallbackToken = `web_local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return fallbackToken;
  } catch (error: any) {
    console.error('Error in requestNotificationPermission:', error);
    throw error;
  }
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = (): Promise<any> => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.error('Messaging not initialized');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });
};

/**
 * Check if notification permission is already granted
 */
export const isNotificationPermissionGranted = (): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
};

/**
 * Check if notification permission was denied
 */
export const isNotificationPermissionDenied = (): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'denied';
};

export { messaging };

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
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    console.log('🔔 Starting notification permission request...');

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.error('❌ Browser does not support notifications');
      throw new Error('This browser does not support notifications');
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.error('❌ Service Worker is not supported');
      throw new Error('Service Worker is not supported in this browser');
    }

    // Check current permission state
    console.log('📋 Current notification permission:', Notification.permission);

    // Request permission
    console.log('🙋 Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('✅ Permission result:', permission);
    
    if (permission !== 'granted') {
      console.warn('⚠️ Notification permission not granted:', permission);
      throw new Error(`Notification permission ${permission}. Please enable notifications in your browser settings.`);
    }

    console.log('✅ Notification permission granted!');

    // Register service worker
    console.log('📝 Registering service worker...');
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered:', registration.scope);

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('✅ Service Worker is ready');

    // Get FCM token
    if (!messaging) {
      console.error('❌ Firebase Messaging not initialized');
      throw new Error('Firebase Messaging could not be initialized. Check your Firebase configuration.');
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('❌ VAPID key is missing');
      throw new Error('Firebase VAPID key is not configured');
    }

    console.log('🔑 Getting FCM token with VAPID key...');
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('✅ FCM Token received:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.error('❌ No FCM token received');
      throw new Error('Failed to get FCM token. Please try again.');
    }
  } catch (error: any) {
    console.error('❌ Error in requestNotificationPermission:', error);
    
    // Provide more specific error messages
    if (error.code === 'messaging/permission-blocked') {
      throw new Error('Notifications are blocked. Please enable them in your browser settings.');
    } else if (error.code === 'messaging/unsupported-browser') {
      throw new Error('Your browser does not support notifications.');
    } else if (error.code === 'messaging/token-subscribe-failed') {
      throw new Error('Failed to subscribe to notifications. Please check your internet connection.');
    }
    
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

// Use require for Firebase Admin to avoid TypeScript module issues
const admin = require("firebase-admin");

let firebaseApp: any = null;

/**
 * Initialize Firebase Admin SDK (Singleton)
 */
export function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "tutvex-15db4";

    // Check if Firebase Admin is already initialized
    if (admin && admin.apps && admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
      console.log("✓ Firebase Admin SDK already initialized");
      return firebaseApp;
    }

    // Option 1: Use environment variables
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (clientEmail && privateKey) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
      console.log("✓ Firebase Admin SDK initialized with service account credentials");
      return firebaseApp;
    }

    // Option 2: Skip initialization if no credentials (notifications will be disabled)
    console.warn("⚠️  Firebase Admin SDK credentials not found in environment variables");
    console.warn("⚠️  Push notifications will not work. Add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env");
    return null;

  } catch (error) {
    console.error("✗ Failed to initialize Firebase Admin SDK:", error);
    return null;
  }
}

/**
 * Get Firebase Admin App instance
 */
export function getFirebaseAdmin() {
  if (!firebaseApp) {
    return initializeFirebaseAdmin();
  }
  return firebaseApp;
}

/**
 * Get Firebase Cloud Messaging instance
 */
export function getFirebaseMessaging() {
  const app = getFirebaseAdmin();
  if (!app) {
    console.warn("⚠️  Firebase Admin not initialized - FCM unavailable");
    return null;
  }
  return admin.messaging(app);
}

export default {
  initializeFirebaseAdmin,
  getFirebaseAdmin,
  getFirebaseMessaging,
};

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User,
} from "firebase/auth";
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const messaging = getMessaging(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.addScope("email");
googleProvider.addScope("profile");

// Google Sign-In Function
export const signInWithGoogle = async () => {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  localStorage.setItem("firebase_token", idToken);
  return { user: result.user, idToken };
};

// Sign Out Function
export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("firebase_token");
};

// Get Stored Firebase Token
export const getStoredToken = (): string | null => {
  return localStorage.getItem("firebase_token");
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Push Notification Functions
export const requestNotificationPermission = async (): Promise<boolean> => {
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const getFCMToken = async (): Promise<string | null> => {
  const permission = await requestNotificationPermission();
  if (!permission) return null;

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn('VAPID key not found in environment variables');
    return null;
  }

  try {
    return await getToken(messaging, { vapidKey });
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const initializeNotifications = async (
  onNotificationReceived?: (payload: MessagePayload) => void
): Promise<void> => {
  // Register service worker for background messages
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  const token = await getFCMToken();
  if (token) {
    console.log('FCM Token:', token);
  }

  // Listen for foreground messages
  onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload);
    showBrowserNotification(payload);
    onNotificationReceived?.(payload);
  });
};

const showBrowserNotification = (payload: MessagePayload) => {
  const { title, body } = payload.notification || {};

  if (Notification.permission === 'granted') {
    new Notification(title || 'Notification', {
      body: body || '',
      icon: '/favicon.ico',
      tag: 'app-notification',
    });
  }
};

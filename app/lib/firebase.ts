"use client";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDgNCey7SY8Ww6cuqnQqEfXpEwrrJ1Ea7k",
  authDomain: "alertify-90d58.firebaseapp.com",
  projectId: "alertify-90d58",
  storageBucket: "alertify-90d58.firebasestorage.app",
  messagingSenderId: "570722711376",
  appId: "1:570722711376:web:c6dd9ace96a6d682481e55",
  measurementId: "G-0M2BZFXBHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

// Check if Messaging is Supported (Prevents Server Error)
export const messaging = (async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getMessaging(app);
  }
  return null;
})();
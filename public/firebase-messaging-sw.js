importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDgNCey7SY8Ww6cuqnQqEfXpEwrrJ1Ea7k",
  authDomain: "alertify-90d58.firebaseapp.com",
  projectId: "alertify-90d58",
  storageBucket: "alertify-90d58.firebasestorage.app",
  messagingSenderId: "570722711376",
  appId: "1:570722711376:web:c6dd9ace96a6d682481e55",
  measurementId: "G-0M2BZFXBHJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});

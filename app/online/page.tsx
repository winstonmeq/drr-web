"use client";

import { useEffect, useState } from "react";
import { messaging } from "../lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

export default function NotificationPage() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    async function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("Service Worker registered:", registration);
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    }

    async function requestPermission() {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("Permission not granted for notifications");
        return;
      }

      console.log("Notification permission granted.");

      try {
        const msg = await messaging;
        if (!msg) return;

        const token = await getToken(msg, {
          vapidKey: process.env.NEXT_PUBLIC_vapidKey,
        });

        if (token) {
          setFcmToken(token);
          console.log("FCM Token:", token);
          await subscribeToTopic(token, "presroxastoken2025") // Subscribe to "alerts" topic
        } else {
          console.log("No registration token available.");
        }
      } catch (error) {
        console.error("Token retrieval failed:", error);
      }
    }

    async function subscribeToTopic(token: string, topic: string) {
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, topic }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(`Successfully subscribed to topic: ${topic}`);
        } else {
          console.error("Failed to subscribe to topic", data);
        }
      } catch (error) {
        console.error("Error subscribing to topic:", error);
      }
    }

    async function listenForMessages() {
      const msg = await messaging;
      if (!msg) return;

      onMessage(msg, (payload) => {
        console.log("Received foreground message:", payload);
        if (payload.notification) {
          setNotification({
            title: payload.notification.title || "No Title",
            body: payload.notification.body || "No Body",
          });
        }
      });
    }

    registerServiceWorker().then(() => {
      requestPermission();
      listenForMessages();
    });
  }, []);

  return (
    <div>
      <h1>Firebase Push Notifications</h1>
      {fcmToken ? <p>FCM Token: {fcmToken}</p> : <p>Requesting Permission...</p>}
      {notification && (
        <div>
          <h2>New Notification:</h2>
          <p><strong>Title:</strong> {notification.title}</p>
          <p><strong>Body:</strong> {notification.body}</p>
        </div>
      )}
    </div>
  );
}

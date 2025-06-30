"use client";

import { useEffect, useState } from "react";
import { messaging } from "../lib/firebase";
import { getToken} from "firebase/messaging";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  wname: string;
  mobile: string;
  mapCenter:string;
  createdAt: string;
  updatedAt: string;
  munId: string;
  provId: string;
}

interface AuthData {
  token: string;
  user: UserData;
}

export default function NotificationPage() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  // const [, setNotification] = useState<{ title: string; body: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to play a simple notification sound
 // Function to play a simple notification sound
const playNotificationSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine'; // Sine wave for a soft tone
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Fade out

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // Play for 0.5 seconds
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

  useEffect(() => {
    
    const token = localStorage.getItem("authData");
    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      router.push("/weblogin");
      return;
    }

    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user); // Set user data from authData
    // console.log("User Data:", authData.user);


    
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
          vapidKey:
            "BJJNXKRFuphmpQMcXlswRKrT4EeTx6Z1K9WVRbgNuF4CVMK7TRwyP59bq3nWE1vjGafqJIH4-3g2oadA9dAPol0",
        });

        if (token) {
          setFcmToken(token);

       } else {
          console.log("No registration token available.");
        }
      } catch (error) {
        console.error("Token retrieval failed:", error);
      }
    }

    // async function listenForMessages() {
    //   const msg = await messaging;
    //   if (!msg) return;

    //   onMessage(msg, (payload) => {
    //     console.log("Received foreground message:", payload);
    //     if (payload.notification) {
    //       setNotification({
    //         title: payload.notification.title || "No Title",
    //         body: payload.notification.body || "No Body",
    //       });
    //     }
    //   });
    // }

    registerServiceWorker().then(() => {
      requestPermission();
      // listenForMessages();
    });

  }, []); // Empty dependency array for initial setup

  // New useEffect to handle topic subscription after userData and fcmToken are set
  useEffect(() => {
    async function subscribeToTopic(fcmToken: string, webUserId: string, munId: string) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/fcmweb`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fcmToken, webUserId, munId }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(`Successfully subscribed to topic: ${fcmToken} for user: ${webUserId} in municipality: ${munId}`);
        } else {
          console.error("Failed to subscribe to topic", data);
        }
      } catch (error) {
        console.error("Error subscribing to topic:", error);
      }
    }
      //dre nga part mag subscribe na sa FCM notification using token 
    if (fcmToken && userData?.munId) {
      subscribeToTopic(fcmToken, userData?.id, userData?.munId);
    } else if (userData && !userData.munId) {
      console.error("munId is undefined, cannot subscribe to topic.");
    }
  }, [fcmToken, userData]); // Runs when fcmToken or userData changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {userData?.wname || 'User'}!</h1>
          <p className="text-lg text-gray-600 mb-6">Access your Command Center to get started.</p>
          <Link href={`/maps?munId=${userData?.munId}&provId=${userData?.provId}`}>
            <Button
              onClick={playNotificationSound}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:shadow-md"
            >
              Enter Command Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
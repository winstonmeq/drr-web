'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AlertModal from './alertModal';
import ReportsSection from './reportModal';
import PostOnline from './postOnline';
import EmergencyList from './emergencyData';

// 🔥 Firebase
import { messaging } from "../lib/firebase";
import { onMessage } from 'firebase/messaging';

// 🔔 Sound File (put mp3 inside /public)
const soundUrl = "/notify.mp3";

interface UserData {
  id: string;
  email: string;
  wname: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
  munId: string;
  provId: string;
}

interface AuthData {
  token: string;
  user: UserData;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'posts' | 'reports'>('emergency');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Notification Popup UI
  const [notificationPopup, setNotificationPopup] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const router = useRouter();

  // Load user
  useEffect(() => {
    const token = localStorage.getItem("authData");
    if (!token) {
      setError("No token found. Please log in.");
      router.push("/weblogin");
      return;
    }

    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user);
    setIsLoading(false);
  }, []);

// 🔥 Firebase foreground listener
useEffect(() => {
  if (!messaging) return;

  messaging
    .then((msg) => {
      if (msg) {
        const unsubscribe = onMessage(msg, (payload) => {
          console.log("FCM Received:", payload);

          // Save data BEFORE refresh
          const title = payload.notification?.title || "New Alert";
          const body = payload.notification?.body || "You have a new alert.";
          localStorage.setItem("pendingNotification", JSON.stringify({ title, body }));

          // Refresh page immediately
          window.location.reload();
        });

        return () => unsubscribe();
      }
    })
    .catch((err) => console.error("Messaging init error:", err));
}, []);

// Show popup AFTER refresh
useEffect(() => {
  const pending = localStorage.getItem("pendingNotification");

  if (pending) {
    try {
      const data = JSON.parse(pending);
      setNotificationPopup(data);

      // Play sound
      const audio = new Audio(soundUrl);
      audio.play().catch(() => console.log("Autoplay blocked"));

      // Clear pending notification so it only shows once
      localStorage.removeItem("pendingNotification");
    } catch (e) {
      console.error("Failed to load pending notification", e);
    }
  }
}, []);



  const Logout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('authData');
      router.push('/weblogin');
    }
  };

  const tabTitles: Record<string, string> = {
    emergency: 'Control Room',
    reports: 'Report Dashboard',
    posts: 'Posts Manager',
  };

  return (
    <>
      {/* 🔥 Notification Popup */}
      {notificationPopup && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-xl border-l-4 border-green-600 p-4 rounded-md animate-in fade-in zoom-in">
          <h2 className="font-bold text-lg">{notificationPopup.title}</h2>
          <p className="text-sm text-gray-600">{notificationPopup.body}</p>

          <button
            className="mt-2 text-sm text-green-700 underline"
            onClick={() => setNotificationPopup(null)}
          >
            Close
          </button>
        </div>
      )}

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
          <Link href={userData ? `/maps?munId=${userData.munId}&provId=${userData.provId}` : '/weblogin'}>
            <h2 className="text-xl font-bold mb-6 text-gray-800">Back</h2>
          </Link>
          <h2 className="text-xl font-bold mb-6 text-gray-800">{userData?.wname}</h2>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('emergency')}
              className={`block p-2 rounded-lg w-full text-left ${
                activeTab === 'emergency' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Emergency
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`block p-2 rounded-lg w-full text-left ${
                activeTab === 'posts' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Online Posts
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`block p-2 rounded-lg w-full text-left ${
                activeTab === 'reports' ? 'bg-green-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              Reports
            </button>

            <button onClick={() => Logout()} className="p-2 rounded-lg w-full text-left hover:bg-gray-100">
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {tabTitles[activeTab] || 'Dashboard'}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button onClick={() => setShowAlertModal(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> New Alert
              </Button>
            </div>
          </header>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6 flex items-center justify-center text-red-600">
                <AlertCircle className="h-6 w-6 mr-2" />
                <p>{error}</p>
              </CardContent>
            </Card>
          ) : activeTab === 'emergency' ? (
            <EmergencyList />
          ) : activeTab === 'reports' ? (
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Print Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportsSection />
              </CardContent>
            </Card>
          ) : activeTab === 'posts' ? (
            <PostOnline />
          ) : null}
        </div>

        {/* Modals */}
        {showAlertModal && userData && (
          <AlertModal
            onClose={() => setShowAlertModal(false)}
            lat="0.0"
            lng="0.0"
            mobile={userData.mobile}
            webUserId={userData.id}
            munId={userData.munId}
            provId={userData.provId}
            munName={userData.wname}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;

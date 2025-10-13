'use client';

import React, { useEffect, useState } from 'react';
import MapComponent from './mapsComponent';
import DataList from './datalist';
import { messaging } from "../lib/firebase";
import { onMessage } from "firebase/messaging";
import { useRouter } from 'next/navigation';

interface EmergencyData {
    id: string;
    emergency: string;
    lat: string;
    long: string;
    mobile: string;
    barangay: string;
    nearby200: string;
    name: string;
    photoURL: string;
    munName: string;
    status: string;
    verified: string;
    createdAt: string;
    munId: string;
    provId: string;
    mobUserId: string;
}

interface UserData {
    id: string;
    email: string;
    wname: string;
    lat: string;
    long: string;
    zoom: string;
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

const Notification: React.FC<{
    message: string;
    onClose: () => void;
}> = ({ message, onClose }) => {
    return (
        <div className="fixed top-4 right-10 z-50 max-w-md w-full bg-red-600 text-white rounded-lg shadow-2xl p-6 animate-slide-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Emergency Alert</h2>
                <button 
                    onClick={onClose}
                    className="text-white hover:text-gray-200 focus:outline-none"
                >
                    ✕
                </button>
            </div>
            <div className="mt-2">
                <p className="text-sm">{message}</p>
            </div>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={onClose}
                    className="bg-white text-red-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};

const TestAudioPopup: React.FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 p-4 flex items-start justify-end z-50 bg-opacity-10">
            <div className="bg-white rounded-lg shadow-2xl p-4">
                <h2 className="text-xl font-bold mb-4 text-center">Sound Notification!</h2>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const Page: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
    const [selectedLocation2, setSelectedLocation2] = useState<EmergencyData | null>(null);

    const [data, setData] = useState<EmergencyData[]>([]);
    const [notification, setNotification] = useState<{ message: string; } | null>(null);
    const [showTestAudioPopup, setShowTestAudioPopup] = useState(true); // Default to true
    const [lastPlayed, setLastPlayed] = useState<number>(0);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

   
    const playNotificationSound = () => {
        const now = Date.now();
        if (now - lastPlayed < 1000) return;
        const audio = new Audio('/sound/alarm2.wav');
        audio.volume = 0.5;
        audio.play().catch((error) => {
            console.error('Error playing notification sound:', error);
        });
        setLastPlayed(now);
    };

    const fetchData = async (munId: string, provId: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${munId}&provId=${provId}`,
                { cache: "no-store" }
            );
            const result = await res.json();
            setData(result.emergency_data);
            return result.emergency_data;
        } catch (error) {
            console.error("Error fetching emergency data:", error);
            setError("Failed to load emergency data. Please try again.");
            setData([]);
            return [];
        }
    };

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("authData") : null;
        if (!token) {
            setError("No token found. Please log in.");
            router.push("/weblogin");
            return;
        }

        const authData: AuthData = JSON.parse(token);
        setUserData(authData.user);

        fetchData(authData.user.munId, authData.user.provId);

        messaging.then((msg) => {
            if (msg) {
                const subscribe = onMessage(msg, async (payload) => {
                    console.log("FCM Message Received:", payload);
                    setNotification({
                        message: payload.notification?.body || "No notification body available.",
                    });

                    const newData = await fetchData(authData.user.munId, authData.user.provId);
                    if (newData.length > 0) {
                        setSelectedLocation2(newData[0]);
                    } else {
                        setSelectedLocation2(null);
                    }

                    playNotificationSound();
                });
                return () => subscribe();
            }
        }).catch((error) => {
            console.error("Error initializing messaging:", error);
        });
    }, []);

    const closeNotification = () => {
        setNotification(null);
    };

    const closeTestAudioPopup = () => {
        setShowTestAudioPopup(false);
        // Save to localStorage only in the browser
        if (typeof window !== 'undefined') {
            localStorage.setItem('soundNotificationDismissed', 'true');
        }
    };

    const handleUpdate = () => {
        if (userData?.munId && userData?.provId) {
            fetchData(userData.munId, userData.provId);
        } else {
            setError("User location data is missing.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[25%_75%] h-screen">
            <div className="w-full h-full overflow-y-auto">
                <DataList 
                    onSelectLocation={setSelectedLocation} 
                    locations={data}
                    webUserId={userData?.id || ""}
                    onUpdate={handleUpdate} 
                />
            </div>
            <div className="w-full h-full">
                <MapComponent 
                    locations={data}
                    selectedLocation={selectedLocation} 
                    selectedLocation2={selectedLocation2} 
                    munId={userData?.munId ?? ''} 
                    provId={userData?.provId ?? ''} 
                    lat={userData?.lat ?? ''} 
                    long={userData?.long ?? ''} 
                    zoom={userData?.zoom ?? ''}
                />
            </div>
            {notification && (
                <Notification 
                    message={notification.message} 
                    onClose={closeNotification} 
                />
            )}
            {showTestAudioPopup && (
                <TestAudioPopup 
                    onClose={closeTestAudioPopup} 
                />
            )}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Page;
"use client";

import React, { useEffect, useState } from "react";
import MapComponent from "./mapsComponent";
import DataList from "./datalist";
import { messaging } from "../lib/firebase";
import { onMessage } from "firebase/messaging";
import { useRouter } from "next/navigation";

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
                    className="text-white hover:text-gray-200"
                >
                    ✕
                </button>
            </div>
            <div className="mt-2">
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};

// ----------------------------
// SOUND ENABLE POPUP (FIXED)
// ----------------------------
const TestAudioPopup: React.FC<{
    onEnableSound: () => void;
}> = ({ onEnableSound }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
                <h2 className="text-xl font-bold text-center mb-4">
                    Enable Sound
                </h2>
                <p className="text-center text-sm mb-4">
                    Click below to allow sound for emergency alerts.
                </p>

                <button
                    onClick={onEnableSound}
                    className="bg-red-600 text-white w-full py-2 rounded-md font-semibold hover:bg-red-700"
                >
                    Enable Sound
                </button>
            </div>
        </div>
    );
};

const Page: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
    const [selectedLocation2, setSelectedLocation2] = useState<EmergencyData | null>(null);
    const [data, setData] = useState<EmergencyData[]>([]);
    const [notification, setNotification] = useState<{ message: string } | null>(null);
    const [showSoundPopup, setShowSoundPopup] = useState(false);
    const [lastPlayed, setLastPlayed] = useState<number>(0);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // ----------------------------
    // 1. ENABLE SOUND HANDLER
    // ----------------------------
    const enableSound = async () => {
        try {
            const audio = new Audio("/sound/alarm2.wav");

            // MUST be directly triggered from button CLICK
            await audio.play(); 
            audio.pause();
            audio.currentTime = 0;

            // Save user choice
            localStorage.setItem("soundAllowed", "yes");

            setShowSoundPopup(false);
            console.log("Sound enabled!");
        } catch (err) {
            console.log("Sound not allowed yet", err);
        }
    };

    // ----------------------------
    // 2. LOAD & CHECK SOUND SETTING
    // ----------------------------
    useEffect(() => {
        const allowed = localStorage.getItem("soundAllowed");
        if (!allowed) {
            setShowSoundPopup(true);
        }
    }, []);

    // ----------------------------
    // 3. PLAY SOUND FOR FCM
    // ----------------------------
    const playNotificationSound = () => {
        const now = Date.now();
        if (now - lastPlayed < 1000) return;

        const audio = new Audio("/sound/alarm2.wav");
        audio.volume = 0.6;

        audio.play().catch((err) => {
            console.error("Autoplay blocked:", err);
        });

        setLastPlayed(now);
    };

    // ----------------------------
    // 4. FETCH EMERGENCY DATA
    // ----------------------------
    const fetchData = async (munId: string, provId: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency?munId=${munId}&provId=${provId}`,
                { cache: "no-store" }
            );
            const result = await res.json();
            setData(result.emergency_data);
            return result.emergency_data;
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to load emergency data.");
            return [];
        }
    };

    // ----------------------------
    // 5. AUTH + FCM + REALTIME UPDATE
    // ----------------------------
    useEffect(() => {
        const token = localStorage.getItem("authData");

        if (!token) {
            router.push("/weblogin");
            return;
        }

        const authData: AuthData = JSON.parse(token);
        setUserData(authData.user);

        fetchData(authData.user.munId, authData.user.provId);

        messaging
            .then((msg) => {
                if (msg) {
                    const unsubscribe = onMessage(msg, async (payload) => {
                        console.log("FCM Message:", payload);

                        setNotification({
                            message: payload.notification?.body || "",
                        });

                        const newData = await fetchData(
                            authData.user.munId,
                            authData.user.provId
                        );

                        if (newData.length > 0) {
                            setSelectedLocation2(newData[0]);
                        }

                        playNotificationSound();
                    });

                    return () => unsubscribe();
                }
            })
            .catch((err) => console.error("Messaging init error:", err));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[25%_75%] h-screen">
            <div className="w-full h-full overflow-y-auto">
                <DataList
                    onSelectLocation={setSelectedLocation}
                    locations={data}
                    webUserId={userData?.id || ""}
                    onUpdate={() =>
                        userData && fetchData(userData.munId, userData.provId)
                    }
                />
            </div>

            <div className="w-full h-full">
                <MapComponent
                    locations={data}
                    selectedLocation={selectedLocation}
                    selectedLocation2={selectedLocation2}
                    munId={userData?.munId ?? ""}
                    provId={userData?.provId ?? ""}
                    lat={userData?.lat ?? ""}
                    long={userData?.long ?? ""}
                    zoom={userData?.zoom ?? ""}
                />
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            {showSoundPopup && <TestAudioPopup onEnableSound={enableSound} />}

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Page;

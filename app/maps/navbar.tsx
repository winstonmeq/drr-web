'use client';

import React, { useState, useEffect } from "react";
import { 
  FaHome, 
  FaSignOutAlt, 
  FaShieldAlt 
} from "react-icons/fa";

import { useRouter } from "next/navigation";
import Link from "next/link";

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

const TacticalNavbar: React.FC = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  const router = useRouter();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const Logout = async () => {
    localStorage.removeItem("authData");
    router.push("/weblogin");
  };

  // ✅ Load user data
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authData") : null;
    if (!token) {
      router.push("/weblogin");
      return;
    }
    const authData: AuthData = JSON.parse(token);
    setUserData(authData.user);
  }, []);

  // ✅ Digital Clock Logic
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { hour12: false });
      setCurrentTime(timeString);
    };
    updateClock(); // Initialize immediately
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <nav className="bg-gray-900 text-white p-4 w-full shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-green-500" size={28} />
              <h1 className="text-xl font-bold uppercase tracking-wider">
                DRRM Command Center
              </h1>
            </div>
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-green-500" size={28} />
              <h1 className="text-xl font-bold uppercase tracking-wider">
                {userData?.wname} DRRM Command Center
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/main"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                <FaHome size={20} />
                <span className="text-sm font-semibold uppercase">Main</span>
              </Link>

              {/* ✅ Digital Clock */}
              <div className="text-lg font-bold text-green-400 font-mono bg-black px-4 py-1 rounded-md shadow-inner tracking-widest">
                {currentTime || "--:--:--"}
              </div>

              <button
                onClick={Logout}
                className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-green-500 transition-colors duration-200"
              >
                <FaSignOutAlt size={20} />
                <span className="text-sm font-semibold uppercase">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 space-y-2">
              <Link
                href="/main"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                <FaHome size={20} />
                <span className="text-sm font-semibold uppercase">Main</span>
              </Link>

              <div className="text-sm font-mono text-gray-400 bg-gray-800 px-3 py-1 rounded-md inline-block">
                {currentTime || "--:--:--"}
              </div>

              <button
                onClick={Logout}
                className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-green-500 transition-colors duration-200 w-full text-left"
              >
                <FaSignOutAlt size={20} />
                <span className="text-sm font-semibold uppercase">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>



    </>
  );
};

export default TacticalNavbar;

'use client';

import React, { useState } from "react";
import { 
  FaHome, 
  FaBell, 
  FaUser, 
  FaShieldAlt, 
  FaSignOutAlt 
} from "react-icons/fa";
import AlertModal from "./alertModal";
import ReportModal from "./reportModal";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TacticalNavbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModal2 = () => {
    setIsModalOpen2(!isModalOpen2);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const Logout = async () => {
    localStorage.removeItem('authData');
    router.push('/weblogin');
  };

  return (
    <>
      <nav className="bg-gray-900 text-white p-4 w-full shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Logo/Title and Mobile Menu Toggle */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-green-500" size={28} />
              <h1 className="text-xl font-bold uppercase tracking-wider">
                MDRRMO Command Center
              </h1>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
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

          {/* Navigation Links - Grid Layout for Desktop, Hidden on Mobile */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-4">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-green-500" size={28} />
              <h1 className="text-xl font-bold uppercase tracking-wider">
                MDRRMO Command Center
              </h1>
            </div>
            <div className="flex items-center justify-end space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                <FaHome size={20} />
                <span className="text-sm font-semibold uppercase">Dashboard</span>
              </Link>
              <Link
                href="/maps"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                <FaUser size={20} />
                <span className="text-sm font-semibold uppercase">Maps</span>
              </Link>
              <button
                onClick={toggleModal}
                className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-green-500 transition-colors duration-200 relative"
              >
                <FaBell size={20} />
                <span className="text-sm font-semibold uppercase">Alerts</span>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                onClick={toggleModal2}
                className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-green-500 transition-colors duration-200"
              >
                <FaShieldAlt size={20} />
                <span className="text-sm font-semibold uppercase">Reports</span>
              </button>
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
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                <FaHome size={20} />
                <span className="text-sm font-semibold uppercase">Dashboard</span>
              </Link>
              <Link
                href="/maps"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                <FaUser size={20} />
                <span className="text-sm font-semibold uppercase">Maps</span>
              </Link>
              <button
                onClick={toggleModal}
                className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-green-500 transition-colors duration-200 w-full text-left relative"
              >
                <FaBell size={20} />
                <span className="text-sm font-semibold uppercase">Alerts</span>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                onClick={toggleModal2}
                className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-green-500 transition-colors duration-200 w-full text-left"
              >
                <FaShieldAlt size={20} />
                <span className="text-sm font-semibold uppercase">Reports</span>
              </button>
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

      {/* Render the Modal */}
      {isModalOpen && <AlertModal onClose={toggleModal} />}
      {isModalOpen2 && <ReportModal onClose={toggleModal2} />}
    </>
  );
};

export default TacticalNavbar;
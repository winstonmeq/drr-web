'use client'
// Import necessary libraries and components'

import React, { useState } from "react";
import { 
  FaHome, 
  FaBell, 
  FaUser, 
  FaShieldAlt, 
  FaSignOutAlt 
} from "react-icons/fa";
import AlertModal from "./alertModal"; // Import the modal component
import ReportModal from "./reportModal"; // Import the modal component
import { useRouter } from "next/navigation"; // Import useRouter for navigation 

import Link from "next/link";



const TacticalNavbar: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
 const router = useRouter(); // Initialize the router

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModal2 = () => {
    setIsModalOpen2(!isModalOpen2);
  };

  
  const Logout = async () => {
    
    localStorage.removeItem('authData'); // Clear auth data
    router.push('/weblogin'); // Redirect to login page
  }


  return (
    <>
      <nav className="bg-gray-900 text-white p-4 w-full shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-green-500" size={28} />
            <h1 className="text-xl font-bold uppercase tracking-wider">
              MDRRMO Command Center
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
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
      </nav>

      {/* Render the Modal */}
      {isModalOpen && <AlertModal onClose={toggleModal} />}
      {isModalOpen2 && <ReportModal onClose={toggleModal2} />}
    </>
  );
};

export default TacticalNavbar;
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

import {
  SignedOut,
  UserButton,
} from '@clerk/nextjs'












const TacticalNavbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <nav className="bg-gray-900 text-white p-4 w-full shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-green-500" size={28} />
            <h1 className="text-xl font-bold uppercase tracking-wider">
              MDRRMO Command
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <a
              href="/home"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
            >
              <FaHome size={20} />
              <span className="text-sm font-semibold uppercase">Home</span>
            </a>

            <button
              onClick={toggleModal}
              className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200 relative"
            >
              <FaBell size={20} />
              <span className="text-sm font-semibold uppercase">Alerts</span>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            <a
              href="/profile"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
            >
              <FaUser size={20} />
              <span className="text-sm font-semibold uppercase">Profile</span>
            </a>

            <a
              href="/brrmo"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors duration-200"
            >
              <FaShieldAlt size={20} />
              <span className="text-sm font-semibold uppercase">BRRMO</span>
            </a>

           
            <UserButton />

            
          </div>
        </div>
      </nav>

      {/* Render the Modal */}
      {isModalOpen && <AlertModal onClose={toggleModal} />}
    </>
  );
};

export default TacticalNavbar;
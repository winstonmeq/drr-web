'use client'

import moment from "moment";
import React, { useState } from "react";
import {
  FaFire,
  FaAmbulance,
  FaWater,
  FaMountain,
  FaExclamationTriangle,
} from "react-icons/fa";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import PostModal from "./postModal";

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  purok: string;
  barangay: string;
  name: string;
  position: string;
  photoURL: string;
  status: boolean;
  situation: string;
  munName: string;
  verified: boolean;
  createdAt: string;
}

interface DataListProps {
  locations: EmergencyData[];
  onDataLoaded: (data: EmergencyData[]) => void;
  onSelectLocation: (location: EmergencyData | null) => void;
}

const DataList: React.FC<DataListProps> = ({ locations, onSelectLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
  
  const toggleModal = () => {
    
    setIsModalOpen(!isModalOpen);
  };

  // New function to handle post click and clear selected location
  const handlePostClick = (location: EmergencyData) => {
    // Clear the selected location by passing null or undefined
    onSelectLocation(null); // Using 'as any' to bypass strict typing temporarily
    setSelectedLocation(location);
    toggleModal();
  };
    
  // Function to get appropriate icon based on emergency type
  const getEmergencyIcon = (emergency: string) => {
    const type = emergency.toLowerCase();
    switch (type) {
      case "fire":
        return <FaFire className="text-red-600" size={24} />;
      case "ambulance":
      case "medical":
        return <FaAmbulance className="text-blue-500" size={24} />;
      case "flood":
        return <FaWater className="text-blue-400" size={24} />;
      case "landslide":
        return <FaMountain className="text-yellow-600" size={24} />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" size={24} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-4 tracking-wider uppercase pb-2">
        Emergency Reports
      </h2>
      {locations.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          NO ACTIVE EMERGENCIES DETECTED
        </div>
      ) : (
        <div className="space-y-4 ">
          {locations.map((location) => (
            <div
              key={location.id}
              className="border-l-4 border-red-600 rounded-xl "
            >
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200 border border-gray-600 ">
                <div className="flex items-center space-x-4 ">
                  <div className="flex-1">
                    <div className="flex items-center justify-start">
                      <div className="flex-shrink-0">
                        {getEmergencyIcon(location.emergency)}
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase pl-4">
                        {location.emergency}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      CONTACT: {location.name}
                    </p>
                    <div className="mt-1 text-sm text-gray-400">
                      <p>
                        LOCATION: {location.purok}, {location.barangay}
                      </p>
                      <p>MOBILE: {location.mobile}</p>
                      {/* <p>MOBILE: {location.photoURL}</p> */}
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      {location.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300 uppercase">
                          AUTHENTICATED
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {moment(location.createdAt).fromNow().toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center gap-3">
                    <Button 
                      className="hover:bg-gray-800 transition-colors duration-200 cursor-pointer" 
                      onClick={() => onSelectLocation(location)}
                    >
                      Maps
                    </Button>
                    <Button 
                      className="hover:bg-gray-800 transition-colors duration-200 cursor-pointer" 
                      onClick={() => handlePostClick(location)}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && <PostModal 
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
          onClose={toggleModal}
        />}
    </div>
  );
};

export default DataList;
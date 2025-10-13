'use client'

import moment from "moment";
import React, { useState} from "react";
import {
  FaFire,
  FaAmbulance,
  FaWater,
  FaMountain,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import PostModal from "./postModal";
import IncLocModal from "./IncLocModal";
import Image from "next/image";

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  nearby200:string;
  name: string;
  photoURL: string;
  status: string;
  munName: string;
  munId: string;
  provId: string;
  mobUserId: string;
  verified: string;
  createdAt: string;
}

interface DataListProps {
  locations: EmergencyData[];
  onSelectLocation: (location: EmergencyData | null) => void;
  onUpdate: () => void;
  webUserId: string;

}




const DataList: React.FC<DataListProps> = ({ locations, onSelectLocation, onUpdate, webUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const toggleModal = () => {    
    setIsModalOpen(!isModalOpen);
  };

  const toggleModal2 = () => {    
    setIsModalOpen2(!isModalOpen2);
  };

  const handlePostClick = (event: React.MouseEvent, location: EmergencyData) => {
    event.stopPropagation();
    onSelectLocation(null);
    setSelectedLocation(location);
    setSelectedItemId(location.id);
    toggleModal();
  };

  const handleLocationIncident = (location: EmergencyData) => {
    onSelectLocation(null); 
    setSelectedLocation(location);
    setSelectedItemId(location.id);
    toggleModal2();
  };

  const handleMapClick = (event: React.MouseEvent, location: EmergencyData) => {
    event.stopPropagation();
    onSelectLocation(location);
    setSelectedItemId(location.id);
  };

  const getEmergencyIcon = (emergency: string) => {
    const type = emergency.toLowerCase();
    switch (type) {
      case "fire":
        return <FaFire className="text-red-600" size={24} />;
      case "ambulance":
      case "medical":
        return <FaAmbulance className="text-orange-700" size={24} />;
      case "flood":
        return <FaWater className="text-blue-400" size={24} />;
      case "landslide":
        return <FaMountain className="text-yellow-600" size={24} />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" size={24} />;
    }
  };

const unverifiedCount = locations.filter((location) => !location.verified).length;

  return (
    <div className="w-full p-4 bg-gray-800 min-h-screen overflow-hidden">
      <h2 className="text-xl sm:text-xl font-bold text-white mb-4 tracking-wider pb-2">
{locations.length} Active Emergency Reports ({unverifiedCount} Unverified)      </h2>
      {locations.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm sm:text-base">
          NO ACTIVE EMERGENCIES DETECTED
        </div>
      ) : (
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              // className={`border-l-4 ${
              //   location.verified ? ' border-green-600 rounded-xl' : ' border-red-600 rounded-xl'
              // }`}
            >
              <div className={`rounded-lg p-4 sm:p-5 hover:bg-gray-700 transition-colors duration-200 border border-gray-600 ${location.verified?'bg-green-800':'bg-red-900'} `}>
                <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                  <div onClick={() => handleLocationIncident(location)} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-start">
                      <div className="flex-shrink-0">
                        {getEmergencyIcon(location.emergency)}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white uppercase pl-4">
                        {location.emergency}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 mt-2">
                      Location: <span className="font-bold text-white">{location.barangay}</span> 
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1">
                      Sender: {location.name}
                    </p>
                    <div className="mt-1 text-xs sm:text-sm text-gray-200">
                      <p>Mobile: {location.mobile}</p>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                     <span className="text-xs text-gray-300">
                        {moment(location.createdAt).fromNow().toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {/* <div className="flex items-center justify-center">
                    <Image width={30} height={30} src={location.photoURL || '/no-image.png'} alt="Location Image" className="w-full h-32 object-cover rounded-lg" />
                  </div> */}

                  <div className="grid grid-rows-2 p-2 gap-2 items-center">
                    <Button 
                      className={`w-full sm:w-auto hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-xs sm:text-sm ${
                        selectedItemId === location.id ? 'bg-gray-800' : ''
                      }`} 
                      onClick={(e) => handleMapClick(e, location)}
                    >
                      Maps
                    </Button>

                    <Button 
                      className={`w-full sm:w-auto hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-xs sm:text-sm ${
                        selectedItemId === location.id ? 'bg-gray-800' : ''
                      }`} 
                      onClick={(e) => handlePostClick(e, location)}
                    >
                      Posts
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
          webUserId={webUserId}
          onClose={toggleModal}
        />}

        {isModalOpen2 && <IncLocModal 
          selectedLocation={selectedLocation}
          onClose={toggleModal2}
          onUpdate={onUpdate}
        />}
    </div>
  );
};

export default DataList;


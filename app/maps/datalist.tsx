'use client'

import React, { useState} from "react";
// import {
//   FaFire,
//   FaAmbulance,
//   FaWater,
//   FaMountain,
//   FaExclamationTriangle,
// } from "react-icons/fa";
import { Button } from "@/components/ui/button";
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




const DataList: React.FC<DataListProps> = ({ locations, onSelectLocation, onUpdate}) => {
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


  const toggleModal2 = () => {    
    setIsModalOpen2(!isModalOpen2);
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

  
const unverifiedCount = locations.filter((location) => location.status !== "confirmed").length;

  return (
    <div className="w-full p-4 bg-gray-800 min-h-screen overflow-hidden">
      <h2 className="text-xl sm:text-xl font-bold text-white mb-4 tracking-wider pb-2">
{locations.length} Active Emergency Reports, ({unverifiedCount} Unconfirmed)      </h2>
      {locations.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm sm:text-base">
          NO ACTIVE EMERGENCIES DETECTED
        </div>
      ) : (
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`border-l-4 ${
                location.verified ? ' border-green-600 rounded-xl' : ' border-red-600 rounded-xl'
              }`}
            >
              <div className={`rounded-lg p-4 sm:p-4 hover:bg-gray-700 transition-colors duration-200 border border-gray-600 ${location.status == "confirmed" ? 'bg-green-800':'bg-red-900'} `}>
                <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  <div onClick={() => handleLocationIncident(location)} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-start">
                      <div className="flex-shrink-0">
                        <Image width={20} height={20} src={location.photoURL || '/images/no-image.png'} alt="Location Image" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white uppercase pl-4">
                        {location.emergency}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 mt-2">
                      Status: <span className="font-bold text-white">{location.verified}</span> 
                    </p>
                   
                  </div>
                 

                  <div className="grid p-2 gap-2 items-center">
                    <Button 
                      className={`w-full sm:w-auto hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-xs sm:text-sm ${
                        selectedItemId === location.id ? 'bg-gray-800' : ''
                      }`} 
                      onClick={(e) => handleMapClick(e, location)}
                    >
                      Maps
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        {isModalOpen2 && <IncLocModal 
          selectedLocation={selectedLocation}
          onClose={toggleModal2}
          onUpdate={onUpdate}
        />}
    </div>
  );
};

export default DataList;


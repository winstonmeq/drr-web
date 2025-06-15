'use client'

import moment from "moment";
import React, { useState, useEffect } from "react";
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
  onSelectLocation: (location: EmergencyData | null) => void;
}



const DataList: React.FC<DataListProps> = ({ locations, onSelectLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [locationNames, setLocationNames] = useState<{ [key: string]: string | null }>({});

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


    const fetchLocationName = async (lat: number, long: number) => {
    const LocNameGPS = { lat, long };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LocNameGPS),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const statusData = await response.json();

      console.log('Location name status', statusData);
      
      const locationName = statusData.current?.[0]?.name || 'Unknown Location';
      return locationName;
    } catch (err) {
      console.error('Error location name', err);
      return null;
    }
  };

// Fetch location names when locations change
  useEffect(() => {
    const fetchAllLocationNames = async () => {
      const newLocationNames: { [key: string]: string | null } = {};
      for (const location of locations) {
        if (!locationNames[location.id]) {
          const name = await fetchLocationName(parseFloat(location.lat), parseFloat(location.long));
          newLocationNames[location.id] = name;
          console.log(name)
        }
      }
      setLocationNames((prev) => ({ ...prev, ...newLocationNames }));
    };

    fetchAllLocationNames();
  }, [locations]);


  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-800 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-wider uppercase pb-2">
        Emergency Reports
      </h2>
      {locations.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm sm:text-base">
          NO ACTIVE EMERGENCIES DETECTED
        </div>
      ) : (
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`border-l-4 border-red-600 rounded-xl ${
                selectedItemId === location.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="rounded-lg p-4 sm:p-5 hover:bg-gray-700 transition-colors duration-200 border border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
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
                      Location: <span className="font-bold text-red-700">{locationNames[location.id] || 'Loading...'}</span> 
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1">
                      Sender: {location.name}
                    </p>
                    <div className="mt-1 text-xs sm:text-sm text-gray-400">
                      <p>Mobile: {location.mobile}</p>
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

                  <div className="flex flex-row sm:flex-col justify-center items-center gap-3">
                    <Button 
                      className={`w-full sm:w-auto hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-xs sm:text-sm ${
                        selectedItemId === location.id ? 'bg-green-800' : ''
                      }`} 
                      onClick={(e) => handleMapClick(e, location)}
                    >
                      Maps
                    </Button>

                    <Button 
                      className={`w-full sm:w-auto hover:bg-gray-800 transition-colors duration-200 cursor-pointer text-xs sm:text-sm ${
                        selectedItemId === location.id ? 'bg-green-800' : ''
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
          onClose={toggleModal}
        />}

        {isModalOpen2 && <IncLocModal 
          selectedLocation={selectedLocation}
          onClose={toggleModal2}
        />}
    </div>
  );
};

export default DataList;


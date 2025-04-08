'use client';

import React, { useEffect, useState } from 'react';
import MapComponent from './mapsComponent';
import DataList from './datalist';
import { messaging } from "../lib/firebase";
import {onMessage } from "firebase/messaging";

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
    photoURL:string;
    status:boolean;
    verified:boolean;
    createdAt:string;
}

const Page: React.FC = () => {
    const [locations, setLocations] = useState<EmergencyData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<EmergencyData | null>(null);
  const [data, setData] = useState<EmergencyData[]>([]);


    const fetchData = async () => {
        try {
          const res = await fetch('https://47.129.250.250/api/emergency', { cache: 'no-store' });
          const result = await res.json();
  
          console.log('API Response:', result.emergency_data); // Debug: Log the response
  
          setData(result.emergency_data);
        } catch (error) {
          console.error('Error fetching emergency data:', error);
          setData([]); // Ensure data is always an array to prevent .map() errors
        }
      };



    useEffect(() => {

        fetchData();

        // Listen for FCM messages
        messaging.then((msg) => {
          if (msg) {
            const unsubscribe = onMessage(msg, (payload) => {
              console.log("FCM Message Received:", payload);
              // Reload the page when a message is received
              alert(payload.notification?.body || "No notification body available.");

            fetchData();
            });

            // Cleanup the listener when the component unmounts
            return () => {
              unsubscribe();
            };
          }
        }).catch((error) => {
          console.error("Error initializing messaging:", error);
        });
      }, []);



   return (
        <div className="flex h-screen bg-black-100">
            {/* Left Sidebar - DataList */}
            <div className="w-3/12 bg-white shadow-md overflow-y-auto">
                <DataList onDataLoaded={setLocations} onSelectLocation={setSelectedLocation} locations={data} />
            </div>
            {/* <div className="w-1/4 h-1/2 relative">
            {selectedLocation && <GalleryPage selectedLocation={selectedLocation} />}

            </div> */}

            {/* Right Side - Map */}
            <div className="w-11/12 h-screen relative">
            
                <MapComponent locations={locations} selectedLocation={selectedLocation} />
            </div>
        </div>
    );
};

export default Page;

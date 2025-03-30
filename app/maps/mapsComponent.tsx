'use client';

import React, { useEffect, useState } from 'react';

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
}

const MapPage: React.FC<{ locations: EmergencyData[]; selectedLocation: EmergencyData | null }> = ({
  locations,
  selectedLocation,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);


  // Load Google Maps script
  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!API_KEY) {
      console.error('Google Maps API key is missing');
      return;
    }

    const scriptId = 'google-maps-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);


// Initialize the map once the script is loaded
useEffect(() => {
  if (isScriptLoaded) {
    const interval = setInterval(async () => {
      if (window.google && window.google.maps) {
        clearInterval(interval);

        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

        const center = { lat: 7.1577, lng: 125.0513 };

        const mapOptions = {
          center,
          zoom: 12,
          mapId: 'e442539727ad5d7e',          
        };

        const mapElement = document.getElementById('map');
        if (mapElement) {
          const newMap = new Map(mapElement, mapOptions);

          // Update the map state
          setMap(newMap);

          // Add a default marker at the center
          const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
          new AdvancedMarkerElement({
            position: center,
            map: newMap,
            title: 'Center Location',
          });
        }
      }
    }, 100);
  }
}, [isScriptLoaded]);

  
 // Function to clear all markers
 const clearMarkers = () => {
    markers.forEach(marker => {
      marker.map = null; // Remove marker from the map
    });
    setMarkers([]); // Reset the markers state
  };

  // Update the map's center and zoom when selectedLocation changes
  useEffect(() => {
    const updateMap = async () => {
      if (map && selectedLocation) {
        const newCenter = {
          lat: parseFloat(selectedLocation.lat),
          lng: parseFloat(selectedLocation.long),
        };

        // Clear existing markers
        clearMarkers();

        // Update the map's center and zoom
        map.setCenter(newCenter);
        map.setZoom(15);

        // Add a new marker
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
        const newMarker = new AdvancedMarkerElement({
          position: newCenter,
          map: map,
          title: 'Selected Location',
        });

        // Store the new marker in the state
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);

        const infoWindowContent = `
        <div style="
          background-color: #1c1c1c;
          color: #e0e0e0;
          font-family: 'Arial', sans-serif;
          padding: 15px;
          border-radius: 8px;
          border: 2px solid #4caf50;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          max-width: 300px;
          line-height: 1.4;
        ">
          <h3 style="
            margin: 0 0 10px;
            font-size: 18px;
            color: #4caf50;
            text-transform: uppercase;
            font-weight: bold;
          ">${selectedLocation.name}</h3>
          <div style="
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px;
            font-size: 14px;
          ">
            <span style="font-weight: bold; color: #ffffff;">Emergency:</span>
            <span>${selectedLocation.emergency}</span>
      
            <span style="font-weight: bold; color: #ffffff;">Position:</span>
            <span>${selectedLocation.position}</span>
      
            <span style="font-weight: bold; color: #ffffff;">Mobile:</span>
            <span>${selectedLocation.mobile}</span>
      
            <span style="font-weight: bold; color: #ffffff;">Purok:</span>
            <span>${selectedLocation.purok}, ${selectedLocation.barangay}</span>
          </div>
          <div style="
            margin-top: 10px;
            text-align: right;
          ">
            <span style="
              font-size: 12px;
              color: #b0bec5;
              font-style: italic;
            ">Tactical Report</span>
          </div>
        </div>
      `;

        const newInfoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
        });

        // Open the InfoWindow on the marker
        newInfoWindow.open(map, newMarker);

        // Store the InfoWindow in the state
        setInfoWindow(newInfoWindow);
      }
    };

    updateMap();
  }, [map, selectedLocation]); // Do NOT include `markers` here



  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />

      <div
        // style={{
        //   position: 'absolute',
        //   top: '100px', // Adjust vertical position
        //   left: '10px', // Adjust horizontal position
        //   backgroundColor: 'white',
        //   padding: '10px',
        //   borderRadius: '5px',
        //   boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        //   zIndex: 1000, // Ensure it appears above the map

                    
        // }}

        style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent background
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
      >
        <p><strong>Name:</strong> {selectedLocation?.name}</p>
        <p><strong>Barangay:</strong> {selectedLocation?.emergency}</p>
        <p><strong>Location:</strong> {selectedLocation?.barangay}</p>
      </div>

    </div>
  );
};

export default MapPage;
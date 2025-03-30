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
            mapId: 'DEMO_MAP_ID',
          };

          const mapElement = document.getElementById('map');
          if (mapElement) {
            const newMap = new Map(mapElement, mapOptions);

            // Update the map state
            setMap(newMap);

            // // Add a default marker at the center
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
        map.setZoom(18);

        // Add a new marker
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
        const newMarker = new AdvancedMarkerElement({
          position: newCenter,
          map: map,
          title: 'Selected Location',
        });

        // Store the new marker in the state
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      }
    };

    updateMap();
  }, [map, selectedLocation]); // Do NOT include `markers` here



  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default MapPage;
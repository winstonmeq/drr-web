'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

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
  verified: boolean;
  createdAt: string;
}

const MapPage: React.FC<{ locations: EmergencyData[]; selectedLocation: EmergencyData | null }> = ({
  selectedLocation,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

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

          const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

          const center = { lat: 7.1577, lng: 125.0513 };

          const mapOptions = {
            center,
            zoom: 12,
            mapId: 'e442539727ad5d7e',
            mapTypeId: 'satellite', // Added to set default to satellite view
          };

          const mapElement = document.getElementById('map');
          if (mapElement) {
            const newMap = new Map(mapElement, mapOptions);

            // Update the map state
            setMap(newMap);

            const { AdvancedMarkerElement } = (await google.maps.importLibrary(
              'marker'
            )) as google.maps.MarkerLibrary;

            new AdvancedMarkerElement({
              position: center,
              map: newMap,
              title: 'MDRRM Office',
            });
          }
        }
      }, 100);
    }
  }, [isScriptLoaded]);

  // Function to clear all markers, wrapped in useCallback
  const clearMarkers = useCallback(() => {
    markers.forEach((marker) => {
      marker.map = null; // Remove marker from the map
    });
    setMarkers([]); // Reset the markers state
  }, [markers]);

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
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          'marker'
        )) as google.maps.MarkerLibrary;

        const newMarker = new AdvancedMarkerElement({
          position: newCenter,
          map: map,
          title: 'Selected Location',
        });

        // Store the new marker in the state
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

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
            ">${selectedLocation.emergency}</h3>
            <div style="
              display: grid;
              grid-template-columns: auto 1fr;
              gap: 8px;
              font-size: 14px;
            ">
              <span style="font-weight: bold; color: #ffffff;">Purok:</span>
              <span>${selectedLocation.purok}</span>
              <span style="font-weight: bold; color: #ffffff;">Barangay:</span>
              <span>${selectedLocation.barangay}</span>
              <span style="font-weight: bold; color: #ffffff;">Mobile:</span>
              <span>${selectedLocation.mobile}</span>
              <span style="font-weight: bold; color: #ffffff;">Coordinate:</span>
              <span>${selectedLocation.lat}, ${selectedLocation.long}</span>
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

        // Create an InfoWindow
        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
        });

        // Add click listener to marker
        newMarker.addListener('click', () => {
          infoWindow.open({
            anchor: newMarker,
            map: map,
          });
        });

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
  }, [map, selectedLocation, clearMarkers]); // Dependencies are stable now

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />

      {selectedLocation?.emergency ? (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent background
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <p>
            <strong>Emergency:</strong> {selectedLocation?.emergency}
          </p>
          <p>
            <strong>Name:</strong> {selectedLocation?.name}
          </p>
          <p>
            <strong>Barangay:</strong> {selectedLocation?.purok}, {selectedLocation?.barangay}
          </p>
          <Image
            src={selectedLocation?.photoURL || '/no-image.png'}
            alt="Location"
            width={200}
            height={200}
          />
          <p>
            <strong>Status:</strong> {selectedLocation?.status ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Verified:</strong> {selectedLocation?.verified ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Created At:</strong>{' '}
            {selectedLocation?.createdAt ? new Date(selectedLocation.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default MapPage;
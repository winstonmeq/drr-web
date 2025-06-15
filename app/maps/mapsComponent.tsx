'use client';

import React, { useEffect, useState, useCallback } from 'react';
// import { polygons } from './polygon';

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

const MapPage: React.FC<{ munId: string, provId: string, lat: string, long: string, locations: EmergencyData[]; selectedLocation: EmergencyData | null }> = ({
  munId,
  provId,
  lat,
  long,
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

          // const center = { lat: 7.1397, lng: 125.0553 };
          const center = { lat: parseFloat(lat), lng: parseFloat(long) };


          const mapOptions = {
            center,
            zoom: 13,
            mapId: 'e442539727ad5d7e',
            mapTypeId: 'hybrid',
            scrollwheel: true,
          };

          const mapElement = document.getElementById('map');

          if (mapElement) {
            const newMap = new Map(mapElement, mapOptions);

            setMap(newMap);

            // Fetch polygons boundaries
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/polygons?munId=${munId}&provId=${provId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                cache: 'no-store',
              });

              if (!response.ok) {
                console.error('Failed to fetch polygon data:', response.statusText);
                return;
              }

              const polygonsData = await response.json();

              console.log('Polygons Data:', polygonsData);

              // Draw Barangay Polygons
              polygonsData.forEach((poly: { name: string; points: { lat: number; long: number }[]; province: { provinceName: string } }) => {
                // Map points to Google Maps format: swap lat and long
                const paths = poly.points.map((point) => ({
                  lat: point.long, // API's 'long' is latitude
                  lng: point.lat,  // API's 'lat' is longitude
                }));

                console.log(`Drawing polygon for ${poly.name} with paths:`, paths);

                const polygon = new google.maps.Polygon({
                  paths,
                  strokeColor: '#9ACD32',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  map: newMap,
                });

                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div>
                      <strong>Barangay:</strong> ${poly.name}<br>
                    </div>
                  `,
                });

                polygon.addListener('click', (event: google.maps.MapMouseEvent) => {
                  infoWindow.setPosition(event.latLng);
                  infoWindow.open(newMap);
                });
              });
            } catch (error) {
              console.error('Error fetching or rendering polygons:', error);
            }
          }
        }
      }, 100);
    }
  }, [isScriptLoaded]);

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

      return statusData;
    } catch (err) {
      console.error('Error location name', err);
      return null;
    }
  };

  const getStatus = async (lat: number, long: number) => {
    try {
      const result = await fetchLocationName(lat, long);
      if (!result) {
        console.log('No result returned');
        return null;
      }
      const currentStatus = result; // Access the 'status' field
      console.log('Current Status:', currentStatus); // Logs "Poblacion"
      return currentStatus;
    } catch (err) {
      console.error('Error getting status:', err);
      return null;
    }
  };

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

        const lat = parseFloat(selectedLocation.lat);
        const long = parseFloat(selectedLocation.long);
        const currentStatus = await getStatus(lat, long); // Await the async call

        // Fallback to a default value if currentStatus is null
        // const displayStatus = currentStatus.current.name || 'errorLocation';

        const infoWindowContent = `
          <div style="
            background-color: #1c1c1c;
            color: #e0e0e0;
            font-family: 'Arial', sans-serif;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #4caf50;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            line-height: 1.4;
          ">
            <h3 style="
              margin: 0 0 10px;
              font-size: 18px;
              color: #FF0000;
              text-transform: uppercase;
              font-weight: bold;
            ">${selectedLocation.emergency}</h3>
            <div style="
              display: grid;
              grid-template-columns: auto 1fr;
              gap: 8px;
              font-size: 14px;
            ">
              <span style="font-weight: bold; color: #ffffff;">Location:</span>
              <span style="font-weight: bold; color: #FF0000;">${currentStatus.current.length >= 1 ? currentStatus.current[0].name : "Unknown Location"}</span>
                 <span style="font-weight: bold; color: #87ceeb;">NearBy: 200m:</span>
              <span style="font-weight: bold; color: #87ceeb;">${currentStatus.nearby200.length >= 1 ? currentStatus.nearby200[0].name : "no data"}</span>
                 <span style="font-weight: bold; color: #ffff00;">NearBy: 500m:</span>
              <span style="font-weight: bold; color: #ffff00;">${currentStatus.nearby500.length >= 1 ? currentStatus.nearby500[0].name : "no data"}</span>
              <span style="font-weight: bold; color: #ffffff;">Sender:</span>
              <span>${selectedLocation.name}</span>
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
              ">Incident Report</span>
            </div>
          </div>
        `;

        // Create an InfoWindow
        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
        });

        // Add click listener to marker
        newMarker.addListener('gmp-click', () => {
          infoWindow.open({
            anchor: newMarker,
            map: map,
          });
        });

        // Open the InfoWindow on the marker
        infoWindow.open(map, newMarker);

        // Store the InfoWindow in the state
        setInfoWindow(infoWindow);
      }
    };

    updateMap();
  }, [map, selectedLocation]); // Added clearMarkers to dependencies

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default MapPage;
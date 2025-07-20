'use client';

import React, { useEffect, useState, 
//  useCallback
 } from 'react';

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  purok: string;
  barangay: string;
  nearby200: string;
  name: string;
  position: string;
  photoURL: string;
  status: boolean;
  verified: boolean;
  createdAt: string;
  munName: string;
  munId: string;  
  provId: string;
  mobUserId: string;
}


// interface PolygonData {
//   name: string;
//   points: { lat: number; long: number }[];
//   province: { provinceName: string };
// }

// interface Props {
//   lat: string;
//   long: string;
//   zoom: string;
//   munId: string;
//   provId: string;
//   setMap: (map: google.maps.Map) => void;
// }


const MapPage: React.FC<{ munId: string, provId: string, lat: string, long: string,zoom:string, locations: EmergencyData[]; selectedLocation: EmergencyData | null }> = ({
  munId,
  provId,
  lat,
  long,
  zoom,
  selectedLocation,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  // const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const scriptId = 'google-maps-script';

    if (!API_KEY) {
      console.error('Google Maps API key is missing');
      return;
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isScriptLoaded) return;

    const initializeMap = async () => {
      if (!(window.google && window.google.maps)) return;

      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

      const center = { lat: parseFloat(lat), lng: parseFloat(long) };

      const mapOptions: google.maps.MapOptions = {
        center,
        zoom: parseFloat(zoom),
        mapId: '29fe0ea7e76902fde8ce503c',
        mapTypeId: 'hybrid',
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        gestureHandling: 'greedy',
        disableDoubleClickZoom: false,
        keyboardShortcuts: true,
        draggable: true,
        clickableIcons: true,
        scrollwheel: true,
      };

      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      const newMap = new Map(mapElement, mapOptions);

      setMap(newMap);

           
    };



    
    // Use requestAnimationFrame to ensure execution after paint
    requestAnimationFrame(() => {
      initializeMap();
    });
  }, [isScriptLoaded, lat, long, zoom, munId, provId, setMap]);

  // Function to clear all markers, wrapped in useCallback
  // const clearMarkers = useCallback(() => {
  //   markers.forEach((marker) => {
  //     marker.map = null; // Remove marker from the map
  //   });
  //   setMarkers([]); // Reset the markers state
  // }, [markers]);


useEffect(() => {
  const updateMap = async () => {
    if (map && selectedLocation) {
      const newCenter = {
        lat: parseFloat(selectedLocation.lat),
        lng: parseFloat(selectedLocation.long),
      };

      // Update the map's center and zoom
      map.setCenter(newCenter);
      map.setZoom(18);

      // Clear previous InfoWindow if it exists
      if (infoWindow) {
        infoWindow.close();
      }

      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      // Create blinking marker content
      const blinkingMarkerDiv = document.createElement('div');
      blinkingMarkerDiv.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          background-color: red;
          border-radius: 100%;
          animation: blink 1s infinite;
          box-shadow: 0 0 10px red;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 30px;
            height: 30px;
            background-color: orange;
            border-radius: 100%;
            box-shadow: 0 0 100px yellow;
            animation: blink 1.3s infinite;
          "></div>
        </div>
      `;

      if (!document.getElementById('blinking-marker-style')) {
        const style = document.createElement('style');
        style.id = 'blinking-marker-style';
        style.textContent = `
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      // Create new marker
      const newMarker = new AdvancedMarkerElement({
        position: newCenter,
        map: map,
        title: 'Selected Location',
        content: blinkingMarkerDiv,
      });

      // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

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
            <span style="font-weight: bold; color: #FF0000;">${selectedLocation.barangay}</span>
            <span style="font-weight: bold; color: #87ceeb;">Nearby: 200m:</span>
            <span style="font-weight: bold; color: #87ceeb;">${selectedLocation.nearby200}</span>
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

      // Create and open new InfoWindow
      const newInfoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      newMarker.addListener('gmp-click', () => {
        newInfoWindow.open({
          anchor: newMarker,
          map: map,
        });
      });

      newInfoWindow.open(map, newMarker);

      // Update the current InfoWindow state
      setInfoWindow(newInfoWindow);
    }
  };

  updateMap();
}, [map, selectedLocation, lat, long, munId, provId]);
 // Added clearMarkers to dependencies

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default MapPage;
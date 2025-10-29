

import React, { useEffect, useState } from 'react'



interface Place {
  polType: string;
  name: string;
}

interface PlaceData {
  current: Place[];
  nearby200: Place[];
  nearby500: Place[];
}

interface findLocationProps {
   lat: string; long: string ;
}



const FindLocation: React.FC<findLocationProps> = ({lat, long }) => {


  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(false);

  
      useEffect(() => {
        if (!lat || !long) return;
    
        const fetchPlace = async () => {
          setLoading(true);
          try {
            const res = await fetch(
              `https://restapi.qalertapp.com/api/places?lat=${lat}&long=${long}`
            );
            const data = await res.json();
            console.log(data);
            setPlaceData(data);
          } catch (err) {
            console.error('Error fetching place data:', err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPlace();
      }, [lat,long]);

  return (
    <div>
          {loading ? (
        <p className="text-gray-400">Loading place info...</p>
      ) : placeData ? (
          <div>
                {placeData?.current?.[0]?.name || 'N/A'}
              </div>
      ) : (
        <p className="text-gray-400">No place data found.</p>
      )}  
    </div>
  )
}

export default FindLocation
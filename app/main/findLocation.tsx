import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Place {
  polType: string;
  name: string;
}

interface PlaceData {
  current: Place[];
  nearby200: Place[];
  nearby500: Place[];
}

interface FindLocationProps {
  lat: string;
  long: string;
}

const FindLocation: React.FC<FindLocationProps> = ({ lat, long }) => {
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !long) {
      setLoading(false);
      return;
    }

    const fetchPlace = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://restapi.qalertapp.com/api/places?lat=${lat}&long=${long}`
        );
        if (!res.ok) throw new Error('Failed to fetch place');
        const data: PlaceData = await res.json();
        setPlaceData(data);
      } catch (err) {
        console.error('Error fetching place data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [lat, long]);

  const displayName = placeData?.current?.[0]?.name;

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <div className="flex items-center gap-1 text-gray-500">
          <Loader2 className="animate-spin" size={16} />
          <span>Fetching location...</span>
        </div>
      ) : (
        <span
          className={
            displayName ? 'text-blue-600 font-medium' : 'text-gray-400 italic'
          }
        >
          {displayName || 'Unknown location'}
        </span>
      )}
    </div>
  );
};

export default FindLocation;

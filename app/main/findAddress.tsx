import React, { useEffect} from 'react';

interface Place {
  polType: string;
  name: string;
}

interface PlaceData {
  current: Place[];
  nearby200: Place[];
  nearby500: Place[];
}

interface FindAdressProps {
  lat: string;
  long: string;
  onLocationFound?: (barangay: string) => void;
}

const FindAdress: React.FC<FindAdressProps> = ({ lat, long, onLocationFound }) => {

  useEffect(() => {
    if (!lat || !long) {
      return;
    }

    const fetchPlace = async () => {
      try {
        const res = await fetch(
          `https://restapi.qalertapp.com/api/places?lat=${lat}&long=${long}`
        );
        if (!res.ok) throw new Error('Failed to fetch place');
        const data: PlaceData = await res.json();

        const barangay = data?.current?.[0]?.name || 'Unknown Barangay';
        onLocationFound?.(barangay);
      } catch (err) {
        console.error('Error fetching place data:', err);
        onLocationFound?.('Location error');
      } finally {

      }
    };

    fetchPlace();
  }, [lat, long, onLocationFound]);



  return null
};

export default FindAdress;
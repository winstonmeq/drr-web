import React from "react";



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


const GalleryPage: React.FC<{selectedLocation:EmergencyData}> = ({ selectedLocation }) => {
  return (
    <ul>
     <li>{selectedLocation.emergency}</li>
    </ul>
  );
};

export default GalleryPage;
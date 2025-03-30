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

interface DataListProps {
  locations: EmergencyData[];
  onDataLoaded: (data: EmergencyData[]) => void;
  onSelectLocation: (location: EmergencyData) => void;
}

const DataList: React.FC<DataListProps> = ({ locations, onSelectLocation }) => {
  return (
    <ul>
      {locations.map((location) => (
        <li
          key={location.id}
          className="p-2 border-b cursor-pointer hover:bg-gray-200"
          onClick={() => onSelectLocation(location)}
        >
          {location.name} - {location.emergency}
        </li>
      ))}
    </ul>
  );
};

export default DataList;
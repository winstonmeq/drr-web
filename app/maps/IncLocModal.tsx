import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string; // Can be parsed as a number
  long: string; // Can be parsed as a number
  mobile: string;
  purok: string;
  barangay: string;
  name: string;
  position: string;
  photoURL: string;
  situation: string;
  munName: string;
  status: boolean;
  verified: boolean;
  createdAt: string;
}

interface IncLocModalProps {
  selectedLocation: EmergencyData | null;
  onClose: () => void;
}

const IncLocModal: React.FC<IncLocModalProps> = ({ selectedLocation, onClose }) => {
  const [formData, setFormData] = useState<EmergencyData>(
    selectedLocation || {
      id: "",
      emergency: "",
      lat: "",
      long: "",
      mobile: "",
      purok: "",
      barangay: "",
      name: "",
      position: "",
      photoURL: "",
      situation: "",
      munName: "",
      status: false,
      verified: false,
      createdAt: new Date().toISOString(),
    }
  );

  const [isLoading] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  const fetchLocationName = async (lat: number, long: number): Promise<string | null> => {
    if (!process.env.NEXT_PUBLIC_DOMAIN) {
      console.error("NEXT_PUBLIC_DOMAIN is not defined");
      return null;
    }

    const LocNameGPS = { lat, long };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(LocNameGPS),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const statusData = await response.json();
      const name = statusData.current?.[0]?.name || "Unknown Location";
      return name;
    } catch (err) {
      console.error("Error fetching location name", err);
      return null;
    }
  };

  // Fetch location name when selectedLocation changes
  useEffect(() => {
    const fetchLocation = async () => {
      if (selectedLocation && selectedLocation.lat && selectedLocation.long) {
        const lat = parseFloat(selectedLocation.lat);
        const long = parseFloat(selectedLocation.long);
        if (!isNaN(lat) && !isNaN(long)) {
          const name = await fetchLocationName(lat, long);
          setLocationName(name);
        } else {
          setLocationName("Invalid Coordinates");
        }
      }
    };

    fetchLocation();
  }, [selectedLocation]);

  // Update form data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}
    >
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg border border-gray-600">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Emergency Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            disabled={isLoading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-4">
          {/* Emergency Type */}
          <div>
            <label htmlFor="emergency" className="block text-white mb-1">
              Emergency Type *
            </label>
            <input
              type="text"
              id="emergency"
              name="emergency"
              readOnly
              value={formData.emergency}
              placeholder="Emergency Type *"
              className="w-full p-2 bg-gray-700 text-red-500 rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>

          {/* Incident Location */}
          <div>
            <label htmlFor="location" className="block text-white mb-1">
              Incident Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              readOnly
              value={locationName || "Loading..."}
              placeholder="Incident Location"
              className="w-full p-2 bg-gray-700 text-red-500 rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>

          {/* Incident Photo */}
          <div>
            <Image
              src={formData.photoURL || "/images/no-image.png"}
              alt="Incident Photo"
              width={300}
              height={300}
              className="w-full max-h-64 object-cover rounded mb-2"
              priority={true}
              onError={(e) => {
                console.error("Image failed to load:", formData.photoURL);
                e.currentTarget.src = "/images/no-image.png";
              }}
            />
          </div>

          {/* Horizontal Line */}
          <div className="w-full border-b border-red-500"></div>

          {/* Sender and Mobile Number */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-white mb-1">
                Sender
              </label>
              <input
                type="text"
                id="name"
                name="name"
                readOnly
                value={formData.name}
                placeholder="Name"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="mobile" className="block text-white mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                readOnly
                value={formData.mobile}
                placeholder="Mobile Number"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="barangay" className="block text-white mb-1">
              Address
            </label>
            <input
              type="text"
              id="barangay"
              name="barangay"
              readOnly
              value={formData.barangay}
              placeholder="Address"
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold uppercase rounded hover:bg-gray-500 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncLocModal;
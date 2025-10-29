import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import FindLocation from "../main/findLocation";

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  nearby200: string;
  name: string;
  photoURL: string;
  munName: string;
  status: string;
  verified: string;
  createdAt: string;
}

interface IncLocModalProps {
  selectedLocation: EmergencyData | null;
  onClose: () => void;
  onUpdate: () => void;
}

const IncLocModal: React.FC<IncLocModalProps> = ({ selectedLocation, onClose}) => {
  const [formData, setFormData] = useState<EmergencyData>(
    selectedLocation || {
      id: "",
      emergency: "",
      lat: "",
      long: "",
      mobile: "",
      barangay: "",
      nearby200: "",
      name: "",
      photoURL: "",
      munName: "",
      status: "",
      verified: "",
      createdAt: new Date().toISOString(),
    }
  );

  const [isLoading,] = useState(false);
  const [error, ] = useState<string | null>(null);
  const [success,] = useState<string | null>(null);


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
            Emergency: {formData.emergency}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            disabled={isLoading}
          >
            <FaTimes size={20} />
          </button>
        </div>

       
          {/* Incident Photo */}
          <div>
            <Image
              src={formData.photoURL && formData.photoURL.trim() !== "" ? formData.photoURL : "/images/no-image.png"}
              alt="Incident Photo"
              width={600}
              height={600}
              className="w-full max-h-64 object-cover rounded mb-2"
              priority={true}
              // onError={(e) => {
              //   console.error("Image failed to load:", formData.photoURL);
              //   e.currentTarget.src = "/images/no-image.png";
              // }}
            />
          </div>

          {/* Horizontal Line */}
          <div className="w-full border-b border-red-500"></div>

        <div className="flex space-x-4 py-2">
           
              <div className="flex-1">
                  
                <label htmlFor="location" className="block text-white mb-1">
                  Location
                </label>
                <div className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
                  <FindLocation lat={formData.lat} long={formData.long} />
                </div>
            
            </div>

         
          </div>
          {/* Sender and Mobile Number */}
          <div className="flex space-x-4 py-4">
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

          {/* Status and Verified Dropdowns */}
     

          {/* Modal Footer */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold uppercase rounded hover:bg-gray-500 transition-colors duration-200"
            >
              Close
            </button>
            {/* <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold uppercase rounded hover:bg-red-500 transition-colors duration-200"
            >
              {isLoading ? "Saving..." : "Save"}
            </button> */}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
          {success && (
            <div className="mt-4 text-green-500 text-sm">{success}</div>
          )}
      </div>
    </div>
  );
};

export default IncLocModal;
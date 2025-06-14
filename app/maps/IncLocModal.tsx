import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import {polygons } from './polygon';
import Image from "next/image";

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
  situation: string;
  munName: string;
  status: boolean;
  verified: boolean;
  createdAt: string;
}

interface IncLocModalProps {
  selectedLocation: EmergencyData | null;
  onSelectLocation: (location: EmergencyData) => void;
  onClose: () => void;
}

function isPointInPolygon(point: { lat: number; long: number }, polygon: { lat: number; long: number }[]) {
  let inside = false;
  const { lat, long } = point;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].long;
    const xj = polygon[j].lat, yj = polygon[j].long;

    const intersect =
      yi > long !== yj > long &&
      lat < ((xj - xi) * (long - yi)) / (yj - yi + 0.0000001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
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
  const [status, setStatus] = useState('');

  const checkPoint = () => {
    const lat = parseFloat(formData.lat);
    const long = parseFloat(formData.long);
    if (isNaN(lat) || isNaN(long)) {
      setStatus('Enter valid coordinates');
      return;
    }

    const point = { lat, long };

    const matched = polygons.filter(poly => isPointInPolygon(point, poly.points));

    if (matched.length > 0) {
      const polygonNames = matched.map(poly => poly.name).join(', ');
      setStatus(`${polygonNames}`);
    } else {
      setStatus('unknown location');
    }
  };
 
  // Update form data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(selectedLocation);
      checkPoint();
    }
  }, [selectedLocation, checkPoint]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  
  

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
              onChange={handleInputChange}
              placeholder="Emergency Type *"
              className="w-full p-2 bg-gray-700 text-red-500 rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>
        

          {/* Purok and Municipality in one row */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="barangay" className="block text-white mb-1">
                Incident Location
              </label>
              <input
                type="text"
                id="barangay"
                name="barangay"
                readOnly
                value={status}
                onChange={handleInputChange}
                placeholder="Municipality"
                className="w-full p-2 bg-gray-700 text-red-500 rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>

            <div>
            <Image
              src={formData.photoURL || "/images/no-image.png"}
              alt="Incident Photo"
              width={300}
              height={300}
              className="w-full max-h-64 object-cover rounded mb-2"
              // Add priority if the image is critical for initial load
              priority={true}
              // Optionally handle errors
              // onError={(e) => {
              //   console.error("Image failed to load:", formData.photoURL);
              //   e.currentTarget.src = "/images/no-image.png"; // Fallback on error
              // }}
            />
          </div>
          

        {/* Horizontal Line */}
          <div className="w-full border-b-red-500 border-solid border-1"></div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-white mb-1">
                Sender:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                readOnly
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-white mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                readOnly
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>
             <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-white mb-1">
                Address:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.barangay}
                readOnly
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
           
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
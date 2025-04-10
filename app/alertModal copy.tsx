'use client'
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface EmergencyData {
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
  situation: string;
  munName: string;
  createdAt: string;
  munId: string;
  provId: string;
}

interface AlertModalProps {
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ onClose }) => {


  const [selectedForm, setSelectedForm] = useState<"blue" | "red">("blue");
  
  const [formData, setFormData] = useState<EmergencyData>({
    emergency: "Blue Alert",
    lat: "7.1577",
    long: "125.0513",
    mobile: "09481234567",
    purok: "none",
    barangay: "Poblacion",
    name: "MDRRMO",
    position: "Government",
    photoURL: "https://res.cloudinary.com/dagi3xoz0/image/upload/v1744289199/logo/bluealert_sggcov.jpg",
    situation: "",
    munName: "President Roxaselite",
    status: false,
    verified: false,
    createdAt: new Date().toISOString(),
    munId: "67e362085d82ab1bd2f2662e",
    provId: "67e23dcc8de27c2818dbbd9b",
  });

  const [formData2, setFormData2] = useState<EmergencyData>({
    emergency: "Red Alert",
    lat: "7.1577",
    long: "125.0513",
    mobile: "09481234567",
    purok: "none",
    barangay: "Poblacion",
    name: "MDRRMO",
    position: "Government",
    photoURL: "https://res.cloudinary.com/dagi3xoz0/image/upload/v1744290772/logo/redalert_gfmsbg.jpg",
    situation: "",
    munName: "President Roxas",
    status: false,
    verified: false,
    createdAt: new Date().toISOString(),
    munId: "67e362085d82ab1bd2f2662e",
    provId: "67e23dcc8de27c2818dbbd9b",
  });

  const [isLoading, setIsLoading] = useState(false);

  const currentFormData = selectedForm === "blue" ? formData : formData2;
  const setCurrentFormData = selectedForm === "blue" ? setFormData : setFormData2;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(e.target.value as "blue" | "red");
  };

  const handleSubmit = async () => {
    if (!currentFormData.emergency || !currentFormData.lat || !currentFormData.long) {
      alert("Please fill required fields: Emergency, Latitude, and Longitude");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentFormData),
      });

      console.log("this is the form", currentFormData);

      if (response.ok) {
        console.log("Emergency posted successfully");
        onClose();
      } else {
        console.error("Failed to post emergency:", response.statusText);
        alert("Failed to post emergency. Please try again.");
      }
    } catch (error) {
      console.error("Error posting emergency:", error);
      alert("An error occurred while posting. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            Alert Notification
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
          {/* Alert Type Selection */}
          <div>
            <label htmlFor="alertType" className="block text-white mb-1">
              Alert Type *
            </label>
            <select
              id="alertType"
              value={selectedForm}
              onChange={handleFormSelect}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              disabled={isLoading}
            >
              <option value="blue">Blue Alert</option>
              <option value="red">Red Alert</option>
            </select>
          </div>

          {/* Emergency Type */}
          <div>
            <label htmlFor="emergency" className="block text-white mb-1">
              Emergency Type *
            </label>
            <input
              type="text"
              id="emergency"
              name="emergency"
              value={currentFormData.emergency}
              onChange={handleInputChange}
              placeholder="Emergency Type *"
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-white mb-1">
                Reported by:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentFormData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="position" className="block text-white mb-1">
                Occupation
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={currentFormData.position}
                onChange={handleInputChange}
                placeholder="Position"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile" className="block text-white mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={currentFormData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>

          {/* Purok and Municipality in one row */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="purok" className="block text-white mb-1">
                Purok
              </label>
              <input
                type="text"
                id="purok"
                name="purok"
                value={currentFormData.purok}
                onChange={handleInputChange}
                placeholder="Purok"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="barangay" className="block text-white mb-1">
                Barangay
              </label>
              <input
                type="text"
                id="barangay"
                name="barangay"
                value={currentFormData.barangay}
                onChange={handleInputChange}
                placeholder="Municipality"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Situation */}
          <div>
            <label htmlFor="situation" className="block text-white mb-1">
              Situation
            </label>
            <textarea
              id="situation"
              name="situation"
              value={currentFormData.situation}
              onChange={handleInputChange}
              placeholder="Situation"
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white text-sm font-semibold uppercase rounded transition-colors duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Posting..." : "Posts"}
          </button>
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

export default AlertModal;
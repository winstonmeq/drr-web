import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";

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
  status: boolean;
  verified: boolean;
  createdAt: string;
}

interface IncLocModalProps {
  selectedLocation: EmergencyData | null;
  onClose: () => void;
  onUpdate: () => void;
}

const IncLocModal: React.FC<IncLocModalProps> = ({ selectedLocation, onClose, onUpdate }) => {
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
      status: false,
      verified: false,
      createdAt: new Date().toISOString(),
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  // Update form data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(selectedLocation);
    }
  }, [selectedLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/emergency/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      console.log(responseData)

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to update incident");
      }
      setSuccess("Incident updated successfully");

      onUpdate()
      onClose();


    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" || name === "verified" ? value === "true" : value,
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
              id="barangay"
              name="barangay"
              readOnly
              value={formData.barangay}
              placeholder="Incident Location"
              className="w-full p-2 bg-gray-700 text-red-500 rounded border border-gray-600"
              disabled={isLoading}
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="barangay" className="block text-white mb-1">
              Nearby 200 Meters
            </label>
            <input
              type="text"
              id="nearby200"
              name="nearby200"
              readOnly
              value={formData.nearby200 ? formData.nearby200 : 'no data'}
              placeholder="..."
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
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

          {/* Status and Verified Dropdowns */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="status" className="block text-white mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status.toString()}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="verified" className="block text-white mb-1">
                Verified
              </label>
              <select
                id="verified"
                name="verified"
                value={formData.verified.toString()}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

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
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold uppercase rounded hover:bg-red-500 transition-colors duration-200"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
          {success && (
            <div className="mt-4 text-green-500 text-sm">{success}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default IncLocModal;
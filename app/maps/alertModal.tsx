'use client'
import React, { useState } from "react";
import { FaTimes} from "react-icons/fa";
import Image from "next/image";

interface EmergencyData {
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  name: string;
  position: string;
  photoURL: string;
  status: boolean;
  verified: boolean;
  situation: string;
  munName: string;
  createdAt: string;
  mobUserId: string;
  munId: string;
  provId: string;
}

interface AlertModalProps {
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<EmergencyData>({
    emergency: "", // Default to blue alert
    lat: "",
    long: "",
    mobile: "",
    barangay: "",
    name: "",
    position: "",
    photoURL: "",
    situation: "",
    munName: "",
    status: false,
    verified: false,
    createdAt: new Date().toISOString(),
    mobUserId: "n/a",
    munId: "",
    provId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'drrphoto');
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '115382555444171');

    try {
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('No secure URL returned from Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.emergency || !formData.lat || !formData.long) {
      alert("Please fill required fields: Emergency, Latitude, and Longitude");
      return;
      }

    setIsLoading(true);

    try {
      let photoURL = formData.photoURL;
      
      if (selectedFile) {
        photoURL = await uploadImageToCloudinary(selectedFile);
      }

      const updatedFormData = { ...formData, photoURL };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        console.log("Emergency posted successfully");
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
      } else {
        console.error("Failed to post emergency:", response.statusText);
        alert("Failed to post emergency. Please try again.");
      }
    } catch (error) {
      console.error("Error posting emergency:", error);
      alert("An error occurred while posting: " + (error instanceof Error ? error.message : "Unknown error"));
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

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="emergency" className="block text-white mb-1">
              Alert Type *
            </label>
             
              <input
                type="text"
                id="emergency"
                name="emergency"
                value={formData.emergency}
                onChange={handleInputChange}
                placeholder="Emergency Type *"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            {/* <select
              id="emergency"
              name="emergency" // Added name attribute to match formData
              value={formData.emergency}
              onChange={handleInputChange} // Fixed typo from handleInputChanget
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              disabled={isLoading}
            >
              <option value="Blue Alert">Blue Alert</option>
              <option value="Red Alert">Red Alert</option>
              <option value="Landslide">Landslide</option>

            </select> */}
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
                value={formData.name}
                onChange={handleInputChange}
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
              <label htmlFor="barangay" className="block text-white mb-1">
                Barangay
              </label>
              <input
                type="text"
                id="barangay"
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                placeholder="Barangay"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-white mb-1">
              Upload Photo
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              disabled={isLoading}
            />
            {previewUrl && (
              <div className="mt-2">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '200px' }}
                  width={200}
                  height={200}  
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="situation" className="block text-white mb-1">
              Situation
            </label>
            <textarea
              id="situation"
              name="situation"
              value={formData.situation}
              onChange={handleInputChange}
              placeholder="Situation"
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

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
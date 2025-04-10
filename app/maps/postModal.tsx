import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";


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
  status: boolean;
  verified: boolean;
  situation: string;
  munName: string;
  createdAt: string;
}

interface PostModalProps {
  selectedLocation: EmergencyData | null; // Changed to accept a single location
  onSelectLocation: (location: EmergencyData) => void;
  onClose: () => void;
}


// const { emergency, lat, long, purok, barangay,munName, name, mobile, position, photoURL, situation, munId, provId } =

const PostModal: React.FC<PostModalProps> = ({ selectedLocation, onSelectLocation, onClose }) => {
  const [formData, setFormData] = useState<EmergencyData>(
    selectedLocation || {
      id:"",
      emergency: "",
      lat: "",
      long: "",
      mobile: "",
      purok: "",
      barangay: "",
      name: "",
      position: "",
      photoURL: "",
      situation:"",
      munName: "",
      status: false,
      verified: false,
      createdAt: new Date().toISOString(),
    }
  );
  
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(selectedLocation);
    }
  }, [selectedLocation]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.emergency || !formData.lat || !formData.long) {
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
        body: JSON.stringify(formData),
      });

      console.log(formData);
      console.log(response);

      if (response.ok) {
        console.log("Emergency posted successfully");
        onSelectLocation(formData);
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
            Posts Online
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
      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
      disabled={isLoading}
    />
  </div>


  <div className="flex space-x-4">
    <div className="flex-1">
      <label htmlFor="purok" className="block text-white mb-1">
       Reported by:
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
    <div className="flex-1">
      <label htmlFor="barangay" className="block text-white mb-1">
       Occupation
      </label>
      <input
      type="text"
      id="position"
      name="position"
      readOnly
      value={formData.position}
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
      readOnly
      value={formData.mobile}
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
        readOnly
        value={formData.purok}
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
        readOnly
        value={formData.barangay}
        onChange={handleInputChange}
        placeholder="Municipality"
        className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
        disabled={isLoading}
      />
    </div>
  </div>

  {/* Name */}
  {/* <div>
    <label htmlFor="name" className="block text-white mb-1">
      Name
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
  </div> */}

  {/* Position */}
  {/* <div>
    <label htmlFor="position" className="block text-white mb-1">
      Position
    </label>
    <input
      type="text"
      id="position"
      name="position"
      value={formData.position}
      onChange={handleInputChange}
      placeholder="Position"
      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
      disabled={isLoading}
    />
  </div> */}

  {/* Situation */}
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

export default PostModal;
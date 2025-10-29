'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Phone, User, Clock, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface EmergencyData {
  id: string;
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  barangay: string;
  name: string;
  photoURL: string;
  munName: string;
  situation: string;
  verified: string;
  createdAt: string;
  updatedAt: string;
  provId: string;
  munId: string;
}

interface Place {
  polType: string;
  name: string;
}

interface PlaceData {
  current: Place[];
  nearby200: Place[];
  nearby500: Place[];
}

interface PostModalProps {
  onClose: () => void;
  data: EmergencyData;
  webUserId: string;
  selectedLocation: { lat: string; long: string };
}

const PostModal: React.FC<PostModalProps> = ({ onClose, data, selectedLocation, webUserId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmergencyData>({ ...data });
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedLocation.lat || !selectedLocation.long) return;

    const fetchPlace = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://restapi.qalertapp.com/api/places?lat=${selectedLocation.lat}&long=${selectedLocation.long}`
        );
        const data = await res.json();
        console.log(data);
        setPlaceData(data);
      } catch (err) {
        console.error('Error fetching place data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [selectedLocation.lat, selectedLocation.long]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const {
        id,
        emergency,
        lat,
        long,
        barangay,
        munName,
        name,
        mobile,
        photoURL,
        situation,
        createdAt,
        munId,
        provId,
      } = formData;

      const finalData = {
        id,
        emergency,
        lat: selectedLocation.lat || lat,
        long: selectedLocation.long || long,
        barangay: placeData?.current?.[0]?.name || barangay,
        munName,
        name,
        mobile,
        verified: true,
        photoURL,
        situation,
        createdAt,
        munId,
        provId,
        webUserId,
      };

      console.log("Submitting final data:", finalData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/postnotify?token=mySecretAlertifyToken2025`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        alert("Emergency posted successfully!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Failed to post emergency: ${errorData.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error posting emergency:", error);
      alert("An error occurred while posting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-black to-indigo-600">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Emergency: {formData.emergency}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Photo */}
          <div className="w-full h-48 rounded-lg overflow-hidden border">
            <Image
              src={formData.photoURL || '/images/no-image.png'}
              alt="Incident"
              width={500}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="text-xs text-gray-600 pl-2">
              <p>
                <span className="font-medium">Latitude:</span> {selectedLocation.lat}{' '}
                <span className="font-medium">Longitude:</span> {selectedLocation.long}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">Sender:</span>
              <span>{formData.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">Mobile:</span>
              <span>{formData.mobile}</span>
            </div>

            {/* Location with Loading Spinner */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">Location:</span>
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Fetching location...</span>
                </div>
              ) : placeData?.current?.[0]?.name ? (
                <span>{placeData.current[0].name}</span>
              ) : (
                <span className="text-gray-400">Unknown location</span>
              )}
            </div>

            {/* Situation Textarea */}
            <div className="flex flex-col gap-1 mt-4">
              <label
                htmlFor="situation"
                className="flex items-center gap-2 font-semibold text-gray-700"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                Situation
              </label>
              <textarea
                id="situation"
                name="situation"
                value={formData.situation || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the current situation..."
                className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(formData.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Now'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PostModal;
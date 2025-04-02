import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

interface AlertModalProps {
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ onClose }) => {
  // Sample alert data (you can replace this with dynamic data)
  const alerts = [
    {
      id: 1,
      type: "FIRE",
      location: "Purok 9, Greenhill",
      time: "5 minutes ago",
      severity: "CRITICAL",
    },
    {
      id: 2,
      type: "LANDSLIDE",
      location: "Purok 5, Poblacion",
      time: "10 minutes ago",
      severity: "HIGH",
    },
    {
      id: 3,
      type: "FLOOD WARNING",
      location: "Purok 2, Poblacion",
      time: "15 minutes ago",
      severity: "MODERATE",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" 
       style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg border border-gray-600">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Active Alerts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              NO ACTIVE ALERTS DETECTED
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-gray-700 rounded-md p-4 flex items-start space-x-3 border-l-4 border-red-600"
              >
                <FaExclamationTriangle
                  className={
                    alert.severity === "CRITICAL"
                      ? "text-red-600"
                      : alert.severity === "HIGH"
                      ? "text-yellow-600"
                      : "text-blue-500"
                  }
                  size={20}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white uppercase">
                    {alert.type}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    GRID: {alert.location}
                  </p>
                  <p className="text-xs text-gray-400">
                    TIME: {alert.time.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400">
                    SEVERITY: {alert.severity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
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
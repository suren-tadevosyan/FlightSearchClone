import React from "react";
import { motion } from "framer-motion";

const FlightModal = ({ flight, onClose }) => {
  if (!flight) return null;

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const dateObj = new Date(dateTimeStr);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const firstLeg = flight.legs && flight.legs[0];

  const origin = firstLeg?.origin;
  const destination = firstLeg?.destination;

  const originDisplay = origin
    ? `${origin.name} (${origin.displayCode}), ${origin.city}`
    : "N/A";
  const destinationDisplay = destination
    ? `${destination.name} (${destination.displayCode}), ${destination.city}`
    : "N/A";

  const departureTime = formatDateTime(firstLeg?.departure);
  const arrivalTime = formatDateTime(firstLeg?.arrival);
  const duration = firstLeg?.durationInMinutes
    ? `${firstLeg.durationInMinutes} minutes`
    : "N/A";

  const airline = firstLeg?.carriers?.marketing?.[0]?.name || "N/A";
  const airlineLogo = firstLeg?.carriers?.marketing?.[0]?.logoUrl;

  const price = flight.price?.formatted || "N/A";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"> 
     
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      ></div>

  
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full relative z-50" 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
     
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Flight Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl">
            &times;
          </button>
        </div>

    
        <div className="mt-4">
          <div className="flex items-center space-x-4">
            {airlineLogo && (
              <img src={airlineLogo} alt={airline} className="w-12 h-12 object-contain" />
            )}
            <span className="text-lg font-semibold">{airline}</span>
          </div>

  
          <div className="mt-4">
            <p className="text-gray-700 font-semibold">Route:</p>
            <p className="text-gray-600">{originDisplay}</p>
            <span className="w-32 flex justify-center">↓</span>
            <p className="text-gray-600">{destinationDisplay}</p>
          </div>


          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 font-semibold">Departure:</p>
              <p className="text-gray-600">{departureTime}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Arrival:</p>
              <p className="text-gray-600">{arrivalTime}</p>
            </div>
          </div>

        
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 font-semibold">Duration:</p>
              <p className="text-gray-600">{duration}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Price:</p>
              <p className="text-gray-600">{price}</p>
            </div>
          </div>
        </div>


        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default FlightModal;

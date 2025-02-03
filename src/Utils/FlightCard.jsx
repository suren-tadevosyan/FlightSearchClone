import React from "react";
import { motion } from "framer-motion";

const FlightCard = ({ flight, onClick }) => {
  let routeDisplay = `Маршрут`;
  let airlineName = "Авиакомпания не указана";
  let airlineLogo = null;

  if (flight.legs && flight.legs.length > 0) {
    const firstLeg = flight.legs[0];
    const originCode =
      firstLeg.origin?.displayCode || firstLeg.origin?.name || "N/A";
    const destinationCode =
      firstLeg.destination?.displayCode ||
      firstLeg.destination?.name ||
      "N/A";
    routeDisplay = `${originCode} → ${destinationCode}`;

    if (
      firstLeg.carriers &&
      firstLeg.carriers.marketing &&
      Array.isArray(firstLeg.carriers.marketing) &&
      firstLeg.carriers.marketing.length > 0
    ) {
      const carrier = firstLeg.carriers.marketing[0];
      airlineName = carrier.name;
      airlineLogo = carrier.logoUrl;
    }
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }} 
      onClick={onClick}
    >
      <div>
        <p className="font-semibold text-lg">{routeDisplay}</p>
        <div className="flex items-center space-x-2">
          {airlineLogo && (
            <img
              src={airlineLogo}
              alt={airlineName}
              className="w-10 h-10 object-contain"
            />
          )}
          <p className="text-gray-500">{airlineName}</p>
        </div>
      </div>
      <p className="text-blue-600 font-bold text-xl">
        {flight.price && flight.price.formatted ? flight.price.formatted : "N/A"}
      </p>
    </motion.div>
  );
};

export default FlightCard;

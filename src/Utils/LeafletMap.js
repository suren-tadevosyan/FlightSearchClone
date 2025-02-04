import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arc";

const FlightPath = ({ departure, arrival }) => {
  const map = useMap();

  useEffect(() => {
    if (departure && arrival) {
      const latlngs = [
        L.latLng(departure[0], departure[1]),
        L.latLng(arrival[0], arrival[1]),
      ];

      map.fitBounds(latlngs, { padding: [50, 50] });

      const arc = L.Polyline.Arc(latlngs[0], latlngs[1], {
        color: "blue",
        weight: 3,
        dashArray: "5,10",
      }).addTo(map);

      return () => {
        map.removeLayer(arc);
      };
    }
  }, [departure, arrival, map]);

  return null;
};

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [45, 45],
});

const LeafletMap = ({ departure, arrival }) => {
  const center = departure || [40.7128, -74.006];

  return (
    <div className="relative z-10 h-[400px] w-full">
      <MapContainer
        center={center}
        zoom={4}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {departure && (
          <Marker position={departure} icon={customIcon}>
            <Popup>Departure</Popup>
          </Marker>
        )}
        {arrival && (
          <Marker position={arrival} icon={customIcon}>
            <Popup>Arrival</Popup>
          </Marker>
        )}

        {departure && arrival && (
          <FlightPath departure={departure} arrival={arrival} />
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

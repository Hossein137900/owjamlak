"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Poster } from "@/types/type";

export default function LeafletMap({
  lat,
  lng,
  title,
  location,
  posterData,
}: {
  lat: number;
  lng: number;
  title: string;
  location: string;
  posterData: Poster;
}) {
  return (
    <MapContainer
      // key={`map-${mapKey}-${posterData._id}`} // Unique key to prevent reuse
      key={`map-${lat}-${lng}`}
      center={[posterData.coordinates.lat, posterData.coordinates.lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      attributionControl={true}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[posterData.coordinates.lat, posterData.coordinates.lng]}
      >
        <Popup>
          <div className="text-center p-2" dir="rtl">
            <h4 className="font-semibold text-gray-800 mb-1">
              {posterData.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{posterData.location}</p>
            <div className="text-xs text-gray-500">
              {posterData.coordinates.lat.toFixed(6)},{" "}
              {posterData.coordinates.lng.toFixed(6)}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

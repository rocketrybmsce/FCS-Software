import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons missing in React environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A custom rocket SVG icon encoded as a data URI so we don't need external image files
// Updated to match the blue & white chevron rocket image with a taller correctly proportioned aspect ratio
const rocketIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 128'%3E%3Cpath d='M 32 4 C 35 24, 38 36, 38 44 L 26 44 C 26 36, 29 24, 32 4 Z' fill='%23e2e8f0' /%3E%3Crect x='26' y='44' width='12' height='20' fill='%23e2e8f0' /%3E%3Crect x='26' y='64' width='12' height='48' fill='%232b6cb0' /%3E%3Cpath d='M 26 48 L 32 38 L 38 48 L 38 53 L 32 43 L 26 53 Z' fill='%232b6cb0' /%3E%3Cpath d='M 26 55 L 32 45 L 38 55 L 38 60 L 32 50 L 26 60 Z' fill='%232b6cb0' /%3E%3Cpath d='M 26 90 L 10 106 L 10 112 L 26 112 Z' fill='%232b6cb0' /%3E%3Cpath d='M 38 90 L 54 106 L 54 112 L 38 112 Z' fill='%232b6cb0' /%3E%3Crect x='30' y='90' width='4' height='22' fill='%231a365d' /%3E%3C/svg%3E",
  iconSize: [48, 96],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
  shadowUrl: null // No shadow needed
});

// A small sub-component strictly to handle re-centering the map when GPS coords change
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

const MapViewer = ({ lat, lon }) => {
  // Add a fallback just in case data is zero at startup 
  // (using BMSCE approximate coordinates as default)
  const safeLat = lat !== 0 && lat !== undefined ? lat : 12.9410;
  const safeLon = lon !== 0 && lon !== undefined ? lon : 77.5655;

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '8px', zIndex: 1 }}>
      <MapContainer 
        center={[safeLat, safeLon]} 
        zoom={16} 
        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          // =========================================================================
          // HOW TO ADD YOUR QGIS OFFLINE TILES:
          // 1. Export your tiles from QGIS. They usually output as folders of zooming levels: {z}/{x}/{y}.png
          // 2. Place that entire exported folder into bmsce-rocketry-app/public/
          //    (For example: bmsce-rocketry-app/public/bmsce_tiles/)
          // 3. Change the url below to: url="/bmsce_tiles/{z}/{x}/{y}.png"
          // =========================================================================
          
          url="/map_tiles/{z}/{x}/{y}.png" /* Loading from local map_tiles folder */
          attribution='&copy; OpenStreetMap contributors | QGIS Customized'
        />
        <Marker position={[safeLat, safeLon]} icon={rocketIcon}>
          <Popup>Rocket Current Pos</Popup>
        </Marker>
        <RecenterMap lat={safeLat} lon={safeLon} />
      </MapContainer>
    </div>
  );
};

export default MapViewer;
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const StationMap = ({ stations = [] }) => {
  // Default center (e.g., a central location or first station)
  const defaultCenter = [51.505, -0.09]; 

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={13} 
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => (
        <Marker key={station.id} position={[station.latitude, station.longitude]}>
          <Popup>
            <div className="font-semibold">{station.name}</div>
            <div className="text-sm text-gray-600">{station.water_body}</div>
            <div className="text-xs mt-1">Status: {station.status}</div>
          </Popup>
        </Marker>
      ))}
      
      {/* Demo Marker if no stations */}
      {stations.length === 0 && (
        <Marker position={defaultCenter}>
          <Popup>
            Demo Station <br /> Water Quality: Good
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default StationMap;

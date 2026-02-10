import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Phone, Users } from 'lucide-react';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      background-color: #3B82F6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Component to update map view when location changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

const SafeZoneMap = ({ safeZones, userLocation }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const mapRef = useRef();

  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [6.9271, 79.8612];

  const getMarkerColor = (safeZone) => {
    const percentage = safeZone.occupancyPercentage || 0;
    if (percentage >= 95) return '#EF4444';
    if (percentage >= 85) return '#F97316';
    if (percentage >= 65) return '#EAB308';
    return '#10B981';
  };

  const handleGetDirections = (safeZone) => {
    const destination = `${safeZone.location.coordinates[1]},${safeZone.location.coordinates[0]}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md" style={{ position: 'relative', zIndex: 0 }}>
      <div style={{ height: '600px', width: '100%', position: 'relative', zIndex: 0 }}>
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          
          <MapUpdater center={center} />

          {/* User Location Marker */}
          {userLocation && (
            <>
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={userLocationIcon}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold text-blue-600">Your Location</p>
                  </div>
                </Popup>
              </Marker>
              
              {/* Circle showing search radius */}
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={5000}
                pathOptions={{
                  fillColor: '#3B82F6',
                  fillOpacity: 0.1,
                  color: '#3B82F6',
                  weight: 1
                }}
              />
            </>
          )}

          {/* Safe Zone Markers */}
          {safeZones.map((safeZone) => {
            if (!safeZone.location?.coordinates) return null;
            
            const position = [
              safeZone.location.coordinates[1],
              safeZone.location.coordinates[0]
            ];

            return (
              <Marker
                key={safeZone._id}
                position={position}
                icon={createCustomIcon(getMarkerColor(safeZone))}
                eventHandlers={{
                  click: () => setSelectedZone(safeZone)
                }}
              >
                <Popup maxWidth={300}>
                  <div className="p-3 min-w-[250px]">
                    <h3 className="font-bold text-gray-900 mb-1 text-base">
                      {safeZone.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {safeZone.type} • {safeZone.distance?.toFixed(1) || '0.0'} km away
                    </p>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Capacity</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {safeZone.capacity?.current || 0}/{safeZone.capacity?.max || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${
                            safeZone.occupancyPercentage >= 95 ? 'bg-red-500' :
                            safeZone.occupancyPercentage >= 85 ? 'bg-orange-500' :
                            safeZone.occupancyPercentage >= 65 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${safeZone.occupancyPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      {safeZone.amenities?.water && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Water
                        </span>
                      )}
                      {safeZone.amenities?.medical && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Medical
                        </span>
                      )}
                      {safeZone.amenities?.power && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          Power
                        </span>
                      )}
                    </div>

                    {safeZone.contact?.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Phone className="w-4 h-4" />
                        <span>{safeZone.contact.phone}</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleGetDirections(safeZone)}
                      className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">Map Legend</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-600">Available (&lt;65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-600">Filling (65-84%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-600">Almost Full (85-94%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-600">Full (≥95%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-600">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeZoneMap;
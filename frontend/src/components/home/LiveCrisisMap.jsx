import React from 'react';
import { MapPin, Maximize2 } from 'lucide-react';

const LiveCrisisMap = () => {
  // This will be replaced with actual Leaflet map integration later
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Live Crisis Map
        </h3>
        <button className="p-1 hover:bg-gray-800 rounded transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="relative">
        {/* Placeholder for map - will be replaced with Leaflet */}
        <div className="h-[400px] lg:h-[600px] bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
          {/* Map placeholder image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/80.0,7.5,7/600x800@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')`
            }}
          />
          
          {/* Location markers overlay */}
          <div className="absolute inset-0">
            {/* Sample markers - will be dynamic with real data */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute top-2/3 left-2/3 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
          
          {/* Map attribution */}
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
            © MapBox | © OpenStreetMap
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-xs text-gray-600">High Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Low Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-xs text-gray-600">Safe Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Integrate with Leaflet */}
      {/* 
      <MapContainer 
        center={[7.8731, 80.7718]} 
        zoom={7} 
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
      */}
    </div>
  );
};

export default LiveCrisisMap;
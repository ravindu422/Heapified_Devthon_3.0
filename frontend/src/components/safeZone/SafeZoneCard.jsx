import React from 'react';
import { MapPin, Droplet, Zap, Users, Navigation } from 'lucide-react';

const SafeZoneCard = ({ safeZone, userLocation }) => {
  // Get capacity fill color
  const getCapacityColor = (percentage) => {
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 85) return 'bg-orange-500';
    if (percentage >= 65) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get capacity text color
  const getCapacityTextColor = (percentage) => {
    if (percentage >= 95) return 'text-red-700';
    if (percentage >= 85) return 'text-orange-700';
    if (percentage >= 65) return 'text-yellow-700';
    return 'text-green-700';
  };

  const occupancyPercentage = safeZone.occupancyPercentage || 0;

  // Get amenity icons
  const getAmenityIcons = () => {
    const icons = [];
    if (safeZone.amenities?.water) {
      icons.push({ icon: Droplet, label: 'Water', key: 'water' });
    }
    if (safeZone.amenities?.power) {
      icons.push({ icon: Zap, label: 'Power', key: 'power' });
    }
    if (safeZone.amenities?.medical) {
      icons.push({ icon: Users, label: 'Medical', key: 'medical' });
    }
    return icons;
  };

  const amenityIcons = getAmenityIcons();

  // Open directions in Google Maps
  const handleGetDirections = () => {
    const destination = `${safeZone.location.coordinates[1]},${safeZone.location.coordinates[0]}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex-1">
          {/* Name and Type */}
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {safeZone.name}
          </h3>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-600">
              {safeZone.type}
            </span>
            
            <span className="text-gray-300">|</span>
            
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{safeZone.distance?.toFixed(1) || '0.0'} Km Away</span>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Crowd is filled by {occupancyPercentage}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getCapacityColor(occupancyPercentage)}`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
            
            <div className="mt-1 text-xs text-gray-500">
              {safeZone.capacity?.current || 0}/{safeZone.capacity?.max || 0} people
            </div>
          </div>
        </div>

        {/* Right: Icons and Button */}
        <div className="flex flex-col items-end gap-3">
          {/* Amenity Icons */}
          <div className="flex items-center gap-2">
            {amenityIcons.map(({ icon: Icon, label, key }) => (
              <div
                key={key}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title={label}
              >
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            ))}
          </div>

          {/* Route Button */}
          <button
            onClick={handleGetDirections}
            className="flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-medium transition-colors border border-teal-200"
          >
            <Navigation className="w-4 h-4" />
            <span>Route</span>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      {safeZone.contact?.phone && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
          Contact: {safeZone.contact.phone}
        </div>
      )}
    </div>
  );
};

export default SafeZoneCard;
import React from 'react';
import { MapPin, Globe, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ activeAlert }) => {
  return (
    <div className="relative">
      {/* Alert Banner */}
      {activeAlert && (
        <div className="bg-red-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm">
                LIVE
              </span>
              <span className="font-bold">{activeAlert.type} – {activeAlert.province}</span>
              <span className="hidden sm:inline">|</span>
              <span className="text-sm">{activeAlert.message}</span>
              <span className="hidden sm:inline">|</span>
              <span className="text-sm">Updated {activeAlert.updatedMinsAgo} mins ago</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Image Section */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=2070')`,
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              When Disaster Strikes,
              <br />
              Information Saves Lives
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-8">
              Real-time disaster alerts, safe zones, and verified rescue information across Sri Lanka.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/safe-zones" className="group bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Find Nearest Safe Zone</span>
            </Link>
            
            <Link to="/crisis-map" className="group bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-lg font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              <span>View Crisis Map</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
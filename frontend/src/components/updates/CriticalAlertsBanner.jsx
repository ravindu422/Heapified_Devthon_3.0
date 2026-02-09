import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CriticalAlertsBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 border-b-4 border-red-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              Critical Alerts Active
            </h3>
            <div className="space-y-1">
              {alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <p className="text-white text-sm">
                    {alert.title} - {alert.location?.province || 'Multiple Areas'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="#critical"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-red-600 rounded-lg font-semibold transition-colors"
          >
            <span>View Details</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertsBanner;
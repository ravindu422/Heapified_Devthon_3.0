import React from 'react';
import { MapPin, TrendingUp, AlertCircle } from 'lucide-react';

const SituationCard = ({ situation }) => {
  const getBadgeColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      green: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[color] || colors.red;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      High: 'text-red-600',
      Warning: 'text-orange-600',
      Low: 'text-yellow-600'
    };
    return colors[severity] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className={`px-3 py-1 rounded-md border font-semibold text-sm ${getBadgeColor(situation.color)}`}>
          {situation.severity}
        </span>
      </div>

      {/* Title */}
      <h3 className={`text-2xl font-bold mb-3 ${getSeverityColor(situation.severity)}`}>
        {situation.type}
      </h3>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {situation.affectedDistricts 
              ? `${situation.affectedDistricts} Districts affected`
              : situation.affectedAreas}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{situation.riskLevel}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Updated {situation.updatedMinsAgo} mins ago</p>
      </div>
    </div>
  );
};

const CurrentSituationOverview = ({ situations = [] }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Current Situation Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {situations.map((situation) => (
          <SituationCard key={situation.id} situation={situation} />
        ))}
      </div>
    </section>
  );
};

export default CurrentSituationOverview;
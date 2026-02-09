import React from 'react';
import { Users, Home, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

const MetricCard = ({ icon: Icon, value, label, trend, trendLabel, statusColor }) => {
  const getStatusColorClass = () => {
    if (statusColor === 'red') return 'text-red-600';
    if (statusColor === 'yellow') return 'text-yellow-600';
    if (statusColor === 'green') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${statusColor === 'red' ? 'bg-red-100' : statusColor === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'}`}>
          <Icon className={`w-6 h-6 ${getStatusColorClass()}`} />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded ${
            trend === 'Increasing' ? 'bg-red-100 text-red-800' :
            trend === 'Stable' ? 'bg-green-100 text-green-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        {trendLabel && (
          <div className="flex items-center gap-1 mt-2">
            <AlertTriangle className="w-3 h-3 text-yellow-600" />
            <p className="text-xs text-yellow-800 font-medium">{trendLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SituationIntelligence = ({ intelligence }) => {
  if (!intelligence) return null;

  const metrics = [
    {
      icon: Users,
      value: intelligence.peopleAffected,
      label: 'People Affected',
      trend: intelligence.peopleAffectedTrend,
      statusColor: 'red'
    },
    {
      icon: Home,
      value: intelligence.homesDamaged,
      label: 'Homes Damaged',
      trendLabel: intelligence.homesDamagedImpact,
      statusColor: 'red'
    },
    {
      icon: MapPin,
      value: intelligence.safeZonesActive,
      label: 'Safe Zones Active',
      trend: intelligence.safeZonesStatus,
      statusColor: 'green'
    },
    {
      icon: TrendingUp,
      value: `${intelligence.riskEscalation}%`,
      label: 'Risk Escalation Probability',
      trendLabel: intelligence.riskEscalationTime,
      statusColor: 'yellow'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Situation Intelligence & Risk Analysis
      </h2>
      <p className="text-gray-600 mb-6">
        Based on verified reports, historical data, and current conditions
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </section>
  );
};

export default SituationIntelligence;
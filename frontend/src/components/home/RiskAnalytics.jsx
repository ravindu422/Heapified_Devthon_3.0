import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const RiskProbabilityChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.probability));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Probability by Disaster Type</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.type}</span>
              <span className="text-sm font-bold text-gray-900">{item.probability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.probability >= 70 ? 'bg-red-600' :
                  item.probability >= 50 ? 'bg-orange-500' :
                  'bg-yellow-500'
                }`}
                style={{ width: `${item.probability}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">© Risk data sources</p>
      </div>
    </div>
  );
};

const AffectedPopulationTrend = ({ trendData }) => {
  if (!trendData) return null;

  const maxCount = Math.max(...trendData.data.map(d => d.count));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Affected Population Trend (Time-Based)</h3>
      
      {/* Simple line chart representation */}
      <div className="relative h-48 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {trendData.data.map((point, index) => {
            const height = (point.count / maxCount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-teal-600 rounded-t-sm hover:bg-teal-700 transition-colors cursor-pointer relative group"
                     style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {point.count.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{point.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Message */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <p className="text-sm text-yellow-800 font-medium">{trendData.message}</p>
        </div>
      </div>
    </div>
  );
};

const GeographicRiskDistribution = ({ geographicData }) => {
  if (!geographicData) return null;

  const colors = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Risk Distribution</h3>
      
      {/* Donut Chart representation */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-64 h-64">
          {/* Simple donut chart using conic gradient */}
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(
                ${geographicData.map((item, i) => {
                  const prevTotal = geographicData.slice(0, i).reduce((sum, d) => sum + d.percentage, 0);
                  const start = prevTotal * 3.6;
                  const end = (prevTotal + item.percentage) * 3.6;
                  return `${colors[i]} ${start}deg ${end}deg`;
                }).join(', ')}
              )`
            }}
          >
            {/* Inner circle to create donut effect */}
            <div className="absolute inset-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {geographicData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-sm text-gray-700">{item.district}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskAnalytics = ({ riskProbability, affectedPopulationTrend, geographicRisk }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RiskProbabilityChart data={riskProbability || []} />
      <AffectedPopulationTrend trendData={affectedPopulationTrend} />
      <div className="lg:col-span-2">
        <GeographicRiskDistribution geographicData={geographicRisk} />
      </div>
    </div>
  );
};

export default RiskAnalytics;
import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const RecommendationBanner = ({ recommendation, dataSources, confidenceLevel, lastUpdated }) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Recommendation Based on Current Situation
            </h3>
            <p className="text-sm text-gray-600">
              Risk Escalation Probability indicates the likelihood of the situation worsening within the next 24 hours, based on rainfall, reports, and historical patterns.
            </p>
          </div>
        </div>

        {/* Recommendation Message */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-orange-200">
          <p className="text-gray-900 font-medium text-lg">
            {recommendation?.message}
          </p>
        </div>

        {/* Data Sources and Confidence Level */}
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Data Sources */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Data Sources:</h4>
              <ul className="space-y-1">
                {dataSources?.map((source, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence & Last Updated */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Confidence Level:</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  confidenceLevel === 'High' ? 'bg-green-100 text-green-800' :
                  confidenceLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {confidenceLevel}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Last Updated:</h4>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationBanner;
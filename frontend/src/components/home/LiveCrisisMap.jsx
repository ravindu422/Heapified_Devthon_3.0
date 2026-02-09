import React, { useState, useEffect } from 'react';
import { MapPin, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CrisisMap from '../crisis-map/CrisisMap';
import alertService from '../../services/alertService';

const LiveCrisisMap = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAllAlerts({
        limit: 100,
        sortBy: 'createdAt',
        order: 'desc'
      });
      setAlerts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMaximize = () => {
    navigate('/crisis-map');
  };

  // Calculate severity counts for legend
  const severityCounts = {
    Critical: alerts.filter(a => a.severityLevel === 'Critical').length,
    High: alerts.filter(a => a.severityLevel === 'High').length,
    Medium: alerts.filter(a => a.severityLevel === 'Medium').length,
    Low: alerts.filter(a => a.severityLevel === 'Low').length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Live Crisis Map
        </h3>
        <button 
          onClick={handleMaximize}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Maximize Map"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="relative">
        {/* Map Container */}
        <div className="h-[400px] lg:h-[600px] relative overflow-hidden">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Loading crisis data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center px-4">
                <p className="text-red-600 mb-2 text-sm">Error: {error}</p>
                <button 
                  onClick={fetchAlerts}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <CrisisMap 
              alerts={alerts} 
              enableScrollZoom={false}
              selectedAlertType="All"
              isEmbedded={true}
              initialZoom={7}
              tileUrl="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCrisisMap;
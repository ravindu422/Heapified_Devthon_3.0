import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LowStockAlert from '../components/resources/LowStockAlert';
import ProvinceFilter from '../components/resources/ProvinceFilter';
import ResourceCenterCard from '../components/resources/ResourceCenterCard';
import { resourceAPI } from '../services/resourceAPI';

const ResourcesAvailability = () => {
  const [centers, setCenters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // List of all Sri Lankan provinces
  const provinces = [
    'Central Province',
    'Sabaragamuwa Province',
    'Eastern Province',
    'Northern Province',
    'North Western Province',
    'Southern Province',
    'North Central Province',
    'Uva Province',
    'Western Province'
  ];

  useEffect(() => {
    fetchData();
  }, [selectedProvince, selectedDistrict]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch distribution centers
      const params = { hasStock: true };
      if (selectedProvince) params.province = selectedProvince;
      if (selectedDistrict) params.district = selectedDistrict;

      const centersResponse = await resourceAPI.getDistributionCenters(params);
      setCenters(centersResponse.data.data);

      // Fetch critical alerts
      const alertsResponse = await resourceAPI.getLowStockAlerts({ severity: 'Critical' });
      setAlerts(alertsResponse.data.data);

      // Select first center by default (when list updates)
      if (centersResponse.data.data.length > 0) {
        setSelectedCenter(centersResponse.data.data[0]);
      } else {
        setSelectedCenter(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedCenter(null);
  };

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="grow">
        {/* Low Stock Alert Banner */}
        {alerts.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <LowStockAlert alerts={alerts} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Province/District Filter */}
            <div className="lg:col-span-1">
              <ProvinceFilter
                provinces={provinces}
                selectedProvince={selectedProvince}
                onProvinceSelect={handleProvinceSelect}
                selectedDistrict={selectedDistrict}
                onDistrictSelect={setSelectedDistrict}
              />
            </div>

            {/* Right Content - Resource Center Details */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading resources...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchData}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : centers.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-600">No distribution centers found for the selected area.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Center Selection List */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Distribution Centers ({centers.length})
                    </h3>
                    <div className="space-y-2">
                      {centers.map((center) => (
                        <button
                          key={center.id || center._id}
                          onClick={() => handleCenterSelect(center)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            (selectedCenter?.id || selectedCenter?._id) === (center.id || center._id)
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-teal-600 truncate">{center.name}</h4>
                              <p className="text-sm text-gray-600 truncate">
                                {center.location?.district || center.district}, {center.location?.province || center.province}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Center Details */}
                  {selectedCenter && (
                    <ResourceCenterCard center={selectedCenter} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesAvailability;
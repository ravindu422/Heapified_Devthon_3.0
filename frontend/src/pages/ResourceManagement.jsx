import { useEffect, useState } from "react";
import { resourceAPI } from "../services/resourceAPI"; // Import resourceAPI
import ResourceTable from "../components/ResourceTable";
import LowStockCard from "../components/LowStockCard";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all distribution centers
      const centersResponse = await resourceAPI.getDistributionCenters({});
      
      // Fetch low stock alerts
      const alertsResponse = await resourceAPI.getLowStockAlerts({ 
        severity: 'Critical',
        isActive: true 
      });

      // Fetch statistics
      const statsResponse = await resourceAPI.getStats();

      // Set the data
      setResources(centersResponse.data.data || []);
      setLowStockAlerts(alertsResponse.data.data || []);
      setStats(statsResponse.data || null);

    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load resources');
      setResources([]);
      setLowStockAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // Find centers with low stock items
  const getCentersWithLowStock = () => {
    if (!Array.isArray(resources)) return [];
    
    return resources.filter(center => {
      if (!center.stock || !Array.isArray(center.stock)) return false;
      return center.stock.some(item => {
        const percentage = (item.currentStock / item.requiredStock) * 100;
        return percentage < 30; // Less than 30% is considered low stock
      });
    });
  };

  const lowStockCenters = getCentersWithLowStock();

  return (
    <DashboardLayout activePage="resource">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resource Management Panel</h1>
            <p className="text-gray-600 mt-1">
              Manage distribution centers and monitor stock levels
            </p>
          </div>
          <button 
            onClick={() => {/* Add your create handler */}}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Distribution Center
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Centers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalCenters || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Operational</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.operationalCenters || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {lowStockAlerts.length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalItems || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={loadResources}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Low Stock Alerts */}
            {lowStockAlerts.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-orange-800 font-semibold mb-1">
                      Critical Low Stock Alerts ({lowStockAlerts.length})
                    </h3>
                    <div className="space-y-2">
                      {lowStockAlerts.slice(0, 3).map((alert, index) => (
                        <p key={index} className="text-orange-700 text-sm">
                          • {alert.centerName}: {alert.itemName} - {alert.severity}
                        </p>
                      ))}
                      {lowStockAlerts.length > 3 && (
                        <p className="text-orange-600 text-sm font-medium">
                          +{lowStockAlerts.length - 3} more alerts
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {resources.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No distribution centers found</p>
                <p className="text-gray-400 text-sm mt-2">Add your first distribution center to get started</p>
              </div>
            ) : (
              /* Resource Table */
              <ResourceTable 
                data={resources} 
                onRefresh={loadResources}
                onUpdate={(id, data) => {
                  // Handle update
                  resourceAPI.updateDistributionCenter(id, data)
                    .then(() => loadResources())
                    .catch(err => console.error(err));
                }}
                onDelete={(id) => {
                  // Handle delete
                  if (confirm('Are you sure you want to delete this center?')) {
                    resourceAPI.deleteDistributionCenter(id)
                      .then(() => loadResources())
                      .catch(err => console.error(err));
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
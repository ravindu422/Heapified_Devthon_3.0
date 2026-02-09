import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import CrisisMap from '../components/crisis-map/CrisisMap';
//import Footer from '../components/common/Footer';
import FilterSidebar from '../components/crisis-map/FilterSidebar';
import alertService from '../services/alertService';
import AlertViewer from '../components/crisis-map/AlertViewer';

const ViewCrisisMap = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        searchQuery: '',
        selectedCity: '',
        affectedArea: false,
        safeZones: false,
        emergenceAlerts: false,
        distributionCenters: false,
        otherResources: false
    });

    // Fetch alerts on mount
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

    // Handle filter changes from sidebar
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Filter alerts based on sidebar selections
    const filteredAlerts = alerts.filter(alert => {
        // Search query filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const matchesSearch = 
                alert.title?.toLowerCase().includes(query) ||
                alert.message?.toLowerCase().includes(query) ||
                alert.affectedAreas?.some(area => 
                    area.displayName?.toLowerCase().includes(query) ||
                    area.name?.toLowerCase().includes(query)
                );
            if (!matchesSearch) return false;
        }

        // City filter
        if (filters.selectedCity) {
            const matchesCity = alert.affectedAreas?.some(area =>
                area.displayName?.toLowerCase().includes(filters.selectedCity.toLowerCase()) ||
                area.name?.toLowerCase().includes(filters.selectedCity.toLowerCase())
            );
            if (!matchesCity) return false;
        }

        return true;
    });

    return (
        <div className='min-h-screen flex flex-col bg-gray-50'>
            <Navbar />
            <main className="flex-1 flex flex-col">
                <div className="flex h-177.5">
                    <FilterSidebar 
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        alertCount={filteredAlerts.length}
                    />
                    
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 relative overflow-hidden">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading crisis data...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-2">Error: {error}</p>
                                        <button 
                                            onClick={fetchAlerts}
                                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <CrisisMap
                                    alerts={filteredAlerts}
                                    enableScrollZoom={true}
                                    selectedAlertType={filters.alertType || 'All'}
                                />
                            )}
                        </div>
                    </div>

                    {/* Real Time Updates Panel */}
                    <AlertViewer alerts={filteredAlerts} />
                </div>
            </main>
            {/* <Footer /> */}
        </div>
    );
}

export default ViewCrisisMap;
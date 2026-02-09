import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import UpdatesFeed from '../components/updates/UpdatesFeed';
import UpdateFilters from '../components/updates/UpdateFilters';
import CriticalAlertsBanner from '../components/updates/CriticalAlertsBanner';
import SearchBar from '../components/updates/UpdatesSearchBar';
import { updateAPI } from '../services/updateAPI';

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [criticalUpdates, setCriticalUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    severity: [],
    category: null,
    province: null,
    district: null,
    dateFrom: null,
    dateTo: null,
    verified: true // Show verified by default
  });

  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    districts: [],
    categories: [],
    severities: ['Critical', 'High', 'Medium', 'Low']
  });

  useEffect(() => {
    fetchFilterOptions();
    fetchCriticalUpdates();
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [filters, page, searchQuery]);

  const fetchFilterOptions = async () => {
    try {
      const response = await updateAPI.getFilterOptions();
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchCriticalUpdates = async () => {
    try {
      const response = await updateAPI.getRecentCritical(3);
      setCriticalUpdates(response.data.data);
    } catch (error) {
      console.error('Error fetching critical updates:', error);
    }
  };

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page,
        limit: 10
      };

      // Add filters
      if (filters.severity.length > 0) {
        params.severity = filters.severity.join(',');
      }
      if (filters.category) {
        params.category = filters.category;
      }
      if (filters.province) {
        params.province = filters.province;
      }
      if (filters.district) {
        params.district = filters.district;
      }
      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
      }
      if (filters.dateTo) {
        params.dateTo = filters.dateTo;
      }
      if (filters.verified) {
        params.verified = 'true';
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await updateAPI.getUpdates(params);
      setUpdates(response.data.data);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error('Error fetching updates:', error);
      setError('Failed to load updates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      severity: [],
      category: null,
      province: null,
      district: null,
      dateFrom: null,
      dateTo: null,
      verified: true
    });
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16 sm:pt-20">
        {/* Critical Alerts Banner */}
        {criticalUpdates.length > 0 && (
          <CriticalAlertsBanner alerts={criticalUpdates} />
        )}

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Updates</h1>
                <p className="text-gray-600 mt-1">Stay informed with the latest verified updates</p>
              </div>
              
              {/* Live Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold text-red-700">LIVE UPDATES</span>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <UpdateFilters
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Updates Feed */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading updates...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchUpdates}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <UpdatesFeed 
                    updates={updates}
                    onRefresh={fetchUpdates}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          page === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-lg font-medium ${
                                page === pageNum
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        {totalPages > 5 && <span className="text-gray-500">...</span>}
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          page === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Updates;
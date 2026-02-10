import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/safeZone/SearchBar';
import FilterPanel from '../components/safeZone/FilterPanel';
import SafeZoneList from '../components/safeZone/SafeZoneList';
import SafeZoneMap from '../components/safeZone/SafeZoneMap';
import { safeZoneAPI } from '../services/safeZoneAPI';

const SafeZoneFinder = () => {
  const [view, setView] = useState('map'); // 'list' or 'map'
  const [safeZones, setSafeZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    distance: 50, // km
    types: [],
    amenities: [],
    minCapacity: 0
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Colombo if location access denied
          setUserLocation({
            latitude: 6.9271,
            longitude: 79.8612
          });
        }
      );
    } else {
      // Default to Colombo
      setUserLocation({
        latitude: 6.9271,
        longitude: 79.8612
      });
    }
  }, []);

  // Fetch safe zones when location or filters change
  useEffect(() => {
    if (userLocation) {
      fetchSafeZones();
    }
  }, [userLocation, filters]);

  const fetchSafeZones = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        maxDistance: filters.distance,
        sortBy: 'distance'
      };

      // Add type filter if selected
      if (filters.types.length > 0) {
        params.type = filters.types[0]; // API accepts single type for now
      }

      // Add amenities filter
      if (filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(',');
      }

      // Add minimum capacity filter
      if (filters.minCapacity > 0) {
        params.minCapacity = filters.minCapacity;
      }

      const response = await safeZoneAPI.getSafeZones(params);
      setSafeZones(response.data.data);

    } catch (error) {
      console.error('Error fetching safe zones:', error);
      setError('Failed to load safe zones. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement geocoding to convert address to coordinates
    // For now, filter by name
    if (query) {
      const filtered = safeZones.filter(zone =>
        zone.name.toLowerCase().includes(query.toLowerCase()) ||
        zone.location.address.toLowerCase().includes(query.toLowerCase())
      );
      setSafeZones(filtered);
    } else {
      fetchSafeZones();
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    fetchSafeZones();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="grow pt-16 sm:pt-20">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 top-16 sm:top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SearchBar
              onSearch={handleSearch}
              onUseLocation={handleUseMyLocation}
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-end gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'list'
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'map'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
              />
            </div>

            {/* Safe Zones Display */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading safe zones...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchSafeZones}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : view === 'map' ? (
                <SafeZoneMap
                  safeZones={safeZones}
                  userLocation={userLocation}
                />
              ) : (
                <SafeZoneList
                  safeZones={safeZones}
                  userLocation={userLocation}
                />
              )}

              {/* Results Count */}
              {!loading && !error && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                  Showing {safeZones.length} safe zone{safeZones.length !== 1 ? 's' : ''}
                  {userLocation && ' near you'}
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

export default SafeZoneFinder;
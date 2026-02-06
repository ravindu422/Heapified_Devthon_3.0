import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Activity, Droplet, Mountain } from 'lucide-react';
import locationService from '../../services/locationService';

const FilterSidebar = ({ filters, onFilterChange }) => {
    const [showAdditionalFilters, setShowAdditionalFilters] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Alert type options
    const alertTypes = [
        { id: 'All', icon: Activity, label: 'All Types', color: '#6B7280' },
        { id: 'Flood', icon: Droplet, label: 'Flood', color: '#3B82F6' },
        { id: 'Landslide', icon: Mountain, label: 'Landslide', color: '#92400E' }
    ];

    // Debounced location search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length > 2) {
                searchLocations(searchQuery);
            } else {
                setLocationSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const searchLocations = async (query) => {
        try {
            const results = await locationService.searchOnLocations(query);
            setLocationSuggestions(results || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Location search error:', error);
            setLocationSuggestions([]);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onFilterChange({ searchQuery: value });
    };

    const handleLocationSelect = (location) => {
        setSearchQuery(location.displayName || location.name);
        onFilterChange({ searchQuery: location.displayName || location.name });
        setShowSuggestions(false);
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        onFilterChange({ selectedCity: city });
    };

    const handleCheckboxChange = (filterName) => {
        onFilterChange({ [filterName]: !filters[filterName] });
    };

    const handleAlertTypeChange = (typeId) => {
        onFilterChange({ alertType: typeId });
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('User location:', latitude, longitude);
                    setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to get your location');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm">
            {/* Search Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search location..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    
                    {/* Location Suggestions Dropdown */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                            {locationSuggestions.map((location, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleLocationSelect(location)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                >
                                    <div className="font-medium text-gray-800">
                                        {location.displayName || location.name}
                                    </div>
                                    {location.name && location.displayName !== location.name && (
                                        <div className="text-xs text-gray-500">{location.name}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleUseMyLocation}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                    <MapPin size={16} />
                    Use my Location
                </button>
            </div>

            <div className='flex flex-col overflow-auto'>

            {/* City Selector */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <select 
                        onChange={handleCityChange}
                        value={filters.selectedCity || ''}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="">Select The City/Town..</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Kalutara">Kalutara</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Galle">Galle</option>
                        <option value="Matara">Matara</option>
                        <option value="Jaffna">Jaffna</option>
                        <option value="Negombo">Negombo</option>
                        <option value="Anuradhapura">Anuradhapura</option>
                        <option value="Batticaloa">Batticaloa</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
            </div>

            {/* Alert Type Filter */}
            <div className="p-4 border-b border-gray-200">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                    Alert Type
                </label>
                <div className="space-y-2">
                    {alertTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = (filters.alertType || 'All') === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => handleAlertTypeChange(type.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                                    isSelected 
                                        ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm' 
                                        : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-200/50' : 'bg-white'}`}>
                                    <Icon className="w-4 h-4" style={{ color: isSelected ? '#0f766e' : type.color }} />
                                </div>
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex-1">
                <div className="p-4 border-b border-gray-200">
                    <button 
                        onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <h3 className="text-base font-bold text-gray-800">Additional Filters</h3>
                        <ChevronDown 
                            className={`text-gray-600 transition-transform ${showAdditionalFilters ? '' : 'rotate-180'}`} 
                            size={18} 
                        />
                    </button>
                    
                    {showAdditionalFilters && (
                        <div className="space-y-3">
                        {[
                            { key: 'affectedArea', label: 'Affected Area' },
                            { key: 'safeZones', label: 'Safe Zones' },
                            { key: 'emergenceAlerts', label: 'Emergency Alerts' },
                            { key: 'distributionCenters', label: 'Distribution Centers' },
                            { key: 'otherResources', label: 'Other Resources' }
                        ].map(filter => (
                            <label key={filter.key} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    checked={filters[filter.key] || false}
                                    onChange={() => handleCheckboxChange(filter.key)}
                                    className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-teal-600 focus:ring-2 focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {filter.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    )}   
                </div>
            </div>
            <div className='pb-4'>
                {/* Legend Section */}
                    <div className="p-4">
                        <div className="space-y-2.5">
                            {[
                                { color: 'bg-red-600', label: 'Critical' },
                                { color: 'bg-orange-600', label: 'High' },
                                { color: 'bg-yellow-400', label: 'Medium' },
                                { color: 'bg-green-500', label: 'Low' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-6 h-3 rounded ${item.color}`}></div>
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
            </div>
        </div>
    );
}

export default FilterSidebar;
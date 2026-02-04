import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableAmenities, setAvailableAmenities] = useState([]);

  useEffect(() => {
    // Fetch filter options from backend
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Fetch types
      const typesResponse = await fetch('/api/safe-zones/types/list');
      const typesData = await typesResponse.json();
      setAvailableTypes(typesData.data || []);

      // Fetch amenities
      const amenitiesResponse = await fetch('/api/safe-zones/amenities/list');
      const amenitiesData = await amenitiesResponse.json();
      setAvailableAmenities(amenitiesData.data || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleDistanceChange = (e) => {
    const newFilters = { ...localFilters, distance: parseInt(e.target.value) };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTypeToggle = (type) => {
    const newTypes = localFilters.types.includes(type)
      ? localFilters.types.filter(t => t !== type)
      : [...localFilters.types, type];
    
    const newFilters = { ...localFilters, types: newTypes };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenityKey) => {
    const newAmenities = localFilters.amenities.includes(amenityKey)
      ? localFilters.amenities.filter(a => a !== amenityKey)
      : [...localFilters.amenities, amenityKey];
    
    const newFilters = { ...localFilters, amenities: newAmenities };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApply = () => {
    onApply();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      distance: 50,
      types: [],
      amenities: [],
      minCapacity: 0
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onApply();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-48">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Filters
          <ChevronDown className="w-5 h-5" />
        </h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Distance Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Distance
        </label>
        <select
          value={localFilters.distance}
          onChange={handleDistanceChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
        >
          <option value={2}>Within 2 Km</option>
          <option value={5}>Within 5 Km</option>
          <option value={10}>Within 10 Km</option>
          <option value={20}>Within 20 Km</option>
          <option value={50}>Within 50 Km</option>
        </select>
      </div>

      {/* Safe Zone Type Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Safe Zone Type
        </label>
        <div className="space-y-2">
          {availableTypes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.types.includes(type)}
                onChange={() => handleTypeToggle(type)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Amenities
        </label>
        <div className="space-y-2">
          {availableAmenities.map((amenity) => (
            <label key={amenity.key} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.amenities.includes(amenity.key)}
                onChange={() => handleAmenityToggle(amenity.key)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filter Button */}
      <button
        onClick={handleApply}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default FilterPanel;
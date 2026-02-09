import React from 'react';
import { Filter, X } from 'lucide-react';

const UpdateFilters = ({ filters, filterOptions, onFilterChange, onClearFilters }) => {
  const handleSeverityToggle = (severity) => {
    const newSeverities = filters.severity.includes(severity)
      ? filters.severity.filter(s => s !== severity)
      : [...filters.severity, severity];
    
    onFilterChange({ ...filters, severity: newSeverities });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ 
      ...filters, 
      category: filters.category === category ? null : category 
    });
  };

  const handleProvinceChange = (province) => {
    onFilterChange({ 
      ...filters, 
      province: filters.province === province ? null : province,
      district: null // Reset district when province changes
    });
  };

  const handleVerifiedToggle = () => {
    onFilterChange({ ...filters, verified: !filters.verified });
  };

  const hasActiveFilters = 
    filters.severity.length > 0 || 
    filters.category || 
    filters.province || 
    filters.district ||
    filters.dateFrom ||
    filters.dateTo;

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-700 border-red-300',
      'High': 'bg-orange-100 text-orange-700 border-orange-300',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  const getSeveritySelectedColor = (severity) => {
    const colors = {
      'Critical': 'bg-red-600 text-white border-red-600',
      'High': 'bg-orange-600 text-white border-orange-600',
      'Medium': 'bg-yellow-600 text-white border-yellow-600',
      'Low': 'bg-blue-600 text-white border-blue-600'
    };
    return colors[severity] || 'bg-gray-600 text-white';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Severity Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Severity Level
        </label>
        <div className="space-y-2">
          {filterOptions.severities.map((severity) => (
            <button
              key={severity}
              onClick={() => handleSeverityToggle(severity)}
              className={`w-full px-4 py-2 rounded-lg border-2 font-medium transition-all text-left ${
                filters.severity.includes(severity)
                  ? getSeveritySelectedColor(severity)
                  : `${getSeverityColor(severity)} border-gray-200 hover:border-gray-300`
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Category
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full px-4 py-2 rounded-lg border-2 text-sm text-left transition-colors ${
                filters.category === category
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Province
        </label>
        <select
          value={filters.province || ''}
          onChange={(e) => handleProvinceChange(e.target.value || null)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">All Provinces</option>
          {filterOptions.provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Date Range
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value || null })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value || null })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Verified Only Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={handleVerifiedToggle}
            className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Show verified sources only
          </span>
        </label>
      </div>
    </div>
  );
};

export default UpdateFilters;
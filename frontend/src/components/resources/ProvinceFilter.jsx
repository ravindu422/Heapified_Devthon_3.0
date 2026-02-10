import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Static mapping of districts per province (can be moved to API later)
const districtsByProvince = {
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Sabaragamuwa Province': ['Kegalle', 'Ratnapura'],
  'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
  'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  'North Western Province': ['Kurunegala', 'Puttalam'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
  'Uva Province': ['Badulla', 'Monaragala'],
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara']
};

const ProvinceFilter = ({ provinces, selectedProvince, onProvinceSelect, selectedDistrict, onDistrictSelect }) => {
  const [expandedProvinces, setExpandedProvinces] = useState({});

  const toggleProvince = (province) => {
    setExpandedProvinces(prev => ({
      ...prev,
      [province]: !prev[province]
    }));
  };

  const handleProvinceClick = (province) => {
    if (selectedProvince === province) {
      // Deselect and collapse when clicking the selected province
      onProvinceSelect(null);
      if (onDistrictSelect) onDistrictSelect(null);
      setExpandedProvinces(prev => ({ ...prev, [province]: false }));
    } else {
      // Select and expand when clicking a new province
      onProvinceSelect(province);
      if (onDistrictSelect) onDistrictSelect(null);
      setExpandedProvinces(prev => ({ ...prev, [province]: true }));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
        Resource Locations
      </h2>

      <div className="space-y-1">
        {provinces.map((province) => (
          <div key={province}>
            <button
              onClick={() => handleProvinceClick(province)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedProvince === province
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {expandedProvinces[province] ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
              <span className="flex-1">{province}</span>
            </button>

            {expandedProvinces[province] && (
              <div className="ml-7 mt-1 mb-2 space-y-1">
                {(districtsByProvince[province] || []).map((d) => (
                  <button
                    key={d}
                    onClick={() => onDistrictSelect && onDistrictSelect(d)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                      selectedDistrict === d
                        ? 'bg-teal-100 text-teal-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedProvince && (
        <button
          onClick={() => { onProvinceSelect(null); if (onDistrictSelect) onDistrictSelect(null); }}
          className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};

export default ProvinceFilter;
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import locationService from '../../../services/locationService';

const LocationInput = ({ selectedLocations, onLocationsChange, error }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const debounceTimer = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchLocations = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const locations = await locationService.searchOnLocations(query);
            console.log('Location recieved', locations)
            setSuggestions(locations || []);
            setShowDropdown(true);
        } catch (error) {
            console.error('Seach error:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchLocations(value);
        }, 300);
    };

    const handleSelectLocation = (location) => {
        const newLocation = {
            id: `${location.placeId}-${Date.now()}`,
            name: location.name,
            displayName: location.displayName,
            geometry: location.geometry,
            coordinates: location.coordinates,
            boundingBox: location.boundingBox
        };

        onLocationsChange([...selectedLocations, newLocation]);
        setInputValue('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    const handleRemoveLocation = (locationId) => {
        onLocationsChange(selectedLocations.filter(loc => {
            return (loc.id || loc._id) !== locationId;
        }));
    };

    // Helper function to get unique ID
    const getLocationId = (location) => {
        return location.id || location._id || location.placeId;
    }


   return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">
                Affected Areas
            </label>

            <div className="relative" ref={dropdownRef}>
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
                        placeholder="Type to search locations (e.g., Hanwella, Colombo District)..."
                        className={`w-full px-4 py-3.5 rounded-lg text-sm border ${
                            error ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500`}
                    />
                    {loading && (
                        <div className="absolute right-3 top-3">
                            <svg className="animate-spin h-5 w-5 text-teal-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>

                {showDropdown && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((location) => (
                            <button
                                key={location.placeId}
                                type="button"
                                onClick={() => handleSelectLocation(location)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                                <div className="flex items-start">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{location.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{location.displayName}</p>
                                        {/* Show geometry type */}
                                        {/* <p className="text-xs text-teal-600 mt-1">
                                            {location.geometry.type === 'Polygon' || location.geometry.type === 'MultiPolygon' 
                                                ? 'Complete region available' 
                                                : 'Point location (approximate area)'}
                                        </p> */}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {showDropdown && suggestions.length === 0 && inputValue.length >= 2 && !loading && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                        No locations found
                    </div>
                )}
            </div>

            
           {selectedLocations.length > 0 && (
               <div className="space-y-2">
                   {selectedLocations.map((location) => {
                        const locationId = getLocationId(location);
                        return (
                           <div
                               key={locationId}
                               className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5"
                           >
                               <div className="flex items-center flex-1 min-w-0">
                                   <div className="min-w-0 flex-1">
                                       <div className="flex items-center gap-2">
                                           <p className="text-xs font-medium text-gray-900 truncate">{location.name}</p>
                                           {/*  Geometry type badge */}
                                           {/* {location.geometry && (location.geometry.type === 'Polygon' || location.geometry.type === 'MultiPolygon') && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                                                Region
                                            </span>
                                        )} */}
                                       </div>
                                       <p className="text-[10px] text-gray-500 truncate">{location.displayName}</p>
                                   </div>
                               </div>
                               <button
                                   type="button"
                                   onClick={() => handleRemoveLocation(locationId)}
                                   className="ml-3 text-teal-600 hover:text-teal-700 p-1 rounded transition-colors shrink-0 cursor-pointer"
                               >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                               </button>
                           </div>
                       );
                    })}
               </div>
            )}

            {error && (
                <p className="mt-1 ml-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default LocationInput;
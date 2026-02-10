import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, onUseLocation }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleUseLocation = () => {
    onUseLocation();
    setSearchValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 border-2 border-red-400 rounded-lg p-3 bg-white">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
        
        <button
          type="button"
          onClick={handleUseLocation}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium whitespace-nowrap px-3 py-1 hover:bg-red-50 rounded transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Use my Location</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
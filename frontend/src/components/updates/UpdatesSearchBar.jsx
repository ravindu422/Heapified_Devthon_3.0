import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, searchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search updates by keyword, location, or category..."
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
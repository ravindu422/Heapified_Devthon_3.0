import React from 'react';
import UpdateCard from './UpdateCard';
import { RefreshCw } from 'lucide-react';

const UpdatesFeed = ({ updates, onRefresh }) => {
  if (!updates || updates.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or check back later for new updates.
          </p>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {updates.length} update{updates.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 hidden md:block"></div>

        {/* Update Cards */}
        <div className="space-y-4">
          {updates.map((update, index) => (
            <UpdateCard key={update.id} update={update} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatesFeed;
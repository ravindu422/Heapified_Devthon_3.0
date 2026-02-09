import React from 'react';

const StockChart = ({ stockItems }) => {
  if (!stockItems || stockItems.length === 0) {
    return <p className="text-gray-500 text-center py-8">No stock data available</p>;
  }

  const getStockPercentage = (item) => {
    return Math.round((item.currentStock / item.maxStock) * 100);
  };

  const getBarColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-300';
    if (percentage <= 10) return 'bg-red-400';
    if (percentage <= 30) return 'bg-orange-400';
    if (percentage <= 60) return 'bg-yellow-300';
    return 'bg-green-400';
  };

  // Group items by category for display
  const groupedItems = stockItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Display top 3 categories or all items if less
  const displayItems = stockItems.slice(0, 5);

  return (
    <div className="bg-white border-2 border-teal-200 rounded-lg p-6">
      <div className="space-y-4">
        {displayItems.map((item, index) => {
          const percentage = getStockPercentage(item);
          const barColor = getBarColor(percentage);

          return (
            <div key={index} className="space-y-2">
              {/* Item Name */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">
                  {item.itemName}
                </span>
                <span className="text-gray-600">
                  {item.currentStock} / {item.maxStock} {item.unit}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(percentage, 3)}%` }}
                  >
                    <span className="text-xs font-bold text-gray-800 bg-white px-2 py-0.5 rounded-full shadow-sm">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-600">Good (&gt;60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
            <span className="text-gray-600">Fair (31-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-gray-600">Low (11-30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-gray-600">Critical (≤10%)</span>
          </div>
        </div>
      </div>

      {/* Show indicator if more items exist */}
      {stockItems.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing 5 of {stockItems.length} items
        </div>
      )}
    </div>
  );
};

export default StockChart;
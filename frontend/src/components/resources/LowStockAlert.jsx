import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LowStockAlert = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  // Get unique items that are critically low
  const criticalItems = [...new Set(alerts.map(alert => alert.itemName))];
  const affectedProvinces = [...new Set(alerts.map(alert => alert.location.province))];

  const getMessage = () => {
    const items = criticalItems.slice(0, 2).join(' and ');
    const provinces = affectedProvinces.slice(0, 2).join(', ');
    
    return `${items} ${criticalItems.length > 1 ? 'are' : 'is'} critically low in ${provinces}`;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-red-700 font-semibold">
          Low Stock Alert: {getMessage()}
        </p>
      </div>
    </div>
  );
};

export default LowStockAlert;
import React from 'react';
import { MapPin, Clock, Phone, Mail, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import StockChart from './StockChart';

const ResourceCenterCard = ({ center }) => {
  // Get category summary
  const getCategorySummary = () => {
    const categories = {
      Food: { items: [], icon: '🍽️' },
      Water: { items: [], icon: '💧' },
      Medical: { items: [], icon: '💊' }
    };

    center.stockItems?.forEach(item => {
      if (categories[item.category]) {
        categories[item.category].items.push(item);
      }
    });

    return categories;
  };

  const getStockStatus = (item) => {
    const percentage = Math.round((item.currentStock / item.maxStock) * 100);
    
    if (percentage === 0) return { status: 'Out of Stock', color: 'red', icon: XCircle };
    if (percentage <= 10) return { status: 'Critical', color: 'red', icon: AlertCircle };
    if (percentage <= item.lowStockThreshold) return { status: 'Low', color: 'orange', icon: AlertCircle };
    return { status: 'Available', color: 'green', icon: CheckCircle };
  };

  const getOperatingHours = () => {
    if (center.operatingHours?.open24x7) {
      return '24/7';
    }
    
    // Get today's schedule
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = center.operatingHours?.schedule?.find(s => s.day === today);
    
    if (todaySchedule) {
      if (todaySchedule.isClosed) return 'Closed Today';
      return `${todaySchedule.openTime} - ${todaySchedule.closeTime}`;
    }
    
    return 'See Schedule';
  };

  const categorySummary = getCategorySummary();

  return (
    <div className="bg-white rounded-lg border-2 border-teal-500 overflow-hidden">
      {/* Header */}
      <div className="bg-teal-50 border-b-2 border-teal-500 p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-teal-500">
              <MapPin className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-teal-600 mb-1">
              {center.name}
            </h2>
            <p className="text-gray-600">
              {center.location.province}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Available Supplies */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Available Supplies
            </h3>
            
            <div className="space-y-4">
              {Object.entries(categorySummary).map(([category, data]) => {
                if (data.items.length === 0) return null;
                
                // Check if any item in this category has stock
                const hasStock = data.items.some(item => item.currentStock > 0);
                const isLow = data.items.some(item => {
                  const percentage = (item.currentStock / item.maxStock) * 100;
                  return percentage > 0 && percentage <= item.lowStockThreshold;
                });
                
                const status = getStockStatus(data.items[0]);
                const StatusIcon = status.icon;
                
                return (
                  <div key={category} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{data.icon}</span>
                      <span className="font-semibold text-gray-900">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 text-${status.color}-500`} />
                      <span className={`font-semibold text-${status.color}-600`}>
                        {status.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Operating Hours */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Operating Hours:
            </h3>
            <div className="flex items-center gap-3 text-teal-600">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold">
                {getOperatingHours()}
              </span>
            </div>

            {/* Contact Information */}
            <div className="mt-6 space-y-3">
              {center.contact?.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${center.contact.phone}`} className="hover:text-teal-600">
                    {center.contact.phone}
                  </a>
                </div>
              )}
              
              {center.contact?.email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${center.contact.email}`} className="hover:text-teal-600">
                    {center.contact.email}
                  </a>
                </div>
              )}
              
              {center.contact?.coordinatorName && (
                <div className="text-sm text-gray-600 mt-2">
                  Coordinator: {center.contact.coordinatorName}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p>{center.location.address}</p>
                  <p>{center.location.city}, {center.location.district}</p>
                  {center.location.postalCode && <p>{center.location.postalCode}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Level Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Available Stock Level
          </h3>
          <StockChart stockItems={center.stockItems} />
        </div>

        {/* Services */}
        {center.services && (
          <div className="mt-6 flex flex-wrap gap-2">
            {center.services.distribution && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Distribution
              </span>
            )}
            {center.services.donations && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Accepts Donations
              </span>
            )}
            {center.services.delivery && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Delivery Available
              </span>
            )}
            {center.services.emergencyDispatch && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Emergency Dispatch
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCenterCard;
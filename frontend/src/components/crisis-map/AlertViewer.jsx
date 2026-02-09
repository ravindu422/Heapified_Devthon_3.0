import React from 'react';
import { MoreVertical } from 'lucide-react';

const AlertViewer = ({ alerts = [] }) => {
    const getSeverityColor = (severity) => {
        const colors = {
            Critical: 'bg-red-500 text-white',
            High: 'bg-orange-500 text-white',
            Medium: 'bg-yellow-500 text-white',
            Low: 'bg-green-500 text-white'
        };
        return colors[severity] || colors.Medium;
    };

    const getSeverityBorderColor = (severity) => {
        const colors = {
            Critical: 'border-l-red-500',
            High: 'border-l-orange-500',
            Medium: 'border-l-yellow-500',
            Low: 'border-l-green-500'
        };
        return colors[severity] || colors.Medium;
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">Real Time Updates</h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Active Alerts Count */}
            <div className="px-4 py-3 bg-linear-to-r from-red-50 to-orange-50 border-b border-red-100">
                <p className="text-red-600 font-bold text-sm">
                    {alerts.length} Active Live Crisis Alerts
                </p>
            </div>

            {/* Scrollable Alerts List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.map((alert, index) => (
                    <div 
                        key={alert._id || index}
                        className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 ${getSeverityBorderColor(alert.severityLevel)}`}
                    >
                        {/* Severity Badge */}
                        <div className="flex items-center justify-between mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getSeverityColor(alert.severityLevel)}`}>
                                {alert.severityLevel}
                            </span>
                        </div>

                        {/* Alert Title */}
                        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1.5">
                            {alert.title}
                        </h3>

                        {/* Alert Message */}
                        {alert.message && (
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {alert.message}
                            </p>
                        )}
                    </div>
                ))}

                {/* Empty State */}
                {alerts.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No active alerts at the moment</p>
                    </div>
                )}
            </div>

            {/* See All Button */}
            {/* <div className="p-4 border-t border-gray-200">
                <button className="w-full py-2.5 bg-white border-2 border-teal-500 text-teal-600 rounded-lg font-medium text-sm hover:bg-teal-50 transition-colors">
                    See All Updated
                </button>
            </div> */}
        </div>
    );
};

export default AlertViewer;
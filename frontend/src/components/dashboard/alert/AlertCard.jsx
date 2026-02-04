import React from 'react';
import { MapPin, Clock, Edit2, Trash2 } from 'lucide-react';

const AlertCard = ({ 
    alerts,
    onEdit,
    onDelete,
    className = ''
}) => {

    const getSeverityColors = (severityLevel) => {
        switch (severityLevel.toLowerCase()) {
            case 'critical':
                return {
                    borderColor: 'border-red-500',
                    bgColor: 'bg-red-500'
                };
            case 'high':
                return {
                    borderColor: 'border-amber-500',
                    bgColor: 'bg-amber-500'
                };
            case 'medium':
                return {
                    borderColor: 'border-amber-300',
                    bgColor: 'bg-amber-300'
                };
            case 'low':
                return {
                    borderColor: 'border-green-500',
                    bgColor: 'bg-green-500'
                };
            default:
                return {
                    borderColor: 'border-gray-500',
                    bgColor: 'bg-gray-500'
                };
        }
    };

    const colors = getSeverityColors(alerts.severityLevel);

    const formatAffectedAreas = (areas) => {
        if (!areas || areas.length === 0) return 'No areas specified';

        const areaNames = areas.map(area => area.name || area.displayName).filter(Boolean);

        if (areaNames.length === 0) return 'No areas specified';
        if (areaNames.length === 1) return areaNames[0];
        if (areaNames.length === 2) return areaNames.join(' and ');

        const remaining = areaNames.length - 2;
        return `${areaNames.slice(0, 2).join(', ')} and ${remaining} more`;
    };

    return (
        <div className={`bg-white border-2 ${colors.borderColor} rounded-xl p-6 relative ${className}`}>
            {/* Action Buttons - Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                    onClick={() => onEdit?.(alerts)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    aria-label="Edit alert"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onDelete?.(alerts)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    aria-label="Delete alert"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Severity Badge & Title */}
            <div className="mb-3 pr-20">
                <div className="flex items-center gap-3 mb-2">
                    <span className={`${colors.bgColor} text-white text-xs font-semibold px-3 py-1 rounded`}>
                        {alerts.severityLevel}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {alerts.title}
                    </h3>
                </div>
            </div>

            {/* Affected Areas */}
            <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Affected Areas: </span>
                    {formatAffectedAreas(alerts.affectedAreas)}
                </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {alerts.message}
            </p>

            {/* Updated Time */}
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mt-4">
                <span>Updated {alerts.timeAgo}</span>
                <Clock className="w-3.5 h-3.5" />
            </div>
        </div>
    );
};

export default AlertCard;
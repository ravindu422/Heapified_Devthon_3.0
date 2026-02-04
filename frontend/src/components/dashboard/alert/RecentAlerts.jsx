import React from 'react';
import { ArrowDown, ChevronDown, ClockFading, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentAlerts = ({ alerts, onRefresh }) => {
  const getSeverityColor = (level) => {
    const colors = {
      Critical: 'bg-red-500',
      High: 'bg-amber-500',
      Medium: 'bg-amber-300',
      Low: 'bg-green-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getSeverityDot = (level) => {
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${getSeverityColor(level)}`}></span>
    );
  };

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
    <div className='bg-white p-6 h-fit sticky top-12'>
      <div className='flex items-center justify-between mb-6 mt-2'>
        <h2 className='text-lg font-semibold text-gray-700'>Recent Alert</h2>
        <button
          onClick={onRefresh}
          className='p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200'
          title='Refresh alerts'
        >
          <RefreshCw className='w-4 h-4' />
        </button>
      </div>

      <div className='space-y-4'>
        {alerts.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <p className='text-sm'>No recent alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className='border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group'
            >
              <div className='flex items-start justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  {getSeverityDot(alert.severityLevel)}
                  <h3 className='text-sm font-semibold text-gray-900 '>
                    {alert.title}
                  </h3>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-[11px] text-gray-500'>{alert.timeAgo}</span>
                  <ClockFading className='w-3 h-3 text-gray-600'/>
                </div>
              </div>
              
              <p className='text-xs text-gray-600 mb-3 line-clamp-3 ml-4'>
                <span className='font-medium'>Affected Areas:</span> {formatAffectedAreas(alert.affectedAreas)}
              </p>

              <div className='flex justify-end'>
                <button className='flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200'>
                    view more
                    <ChevronDown className='w-3 h-3 font-medium mt-1'/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <div className='flex justify-end mt-6 text-center mr-2'>
          <Link to="/manage-alert"
            className='text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200'>
            View All
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
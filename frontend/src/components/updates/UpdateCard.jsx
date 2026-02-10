import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  Pin
} from 'lucide-react';
import { updateAPI } from '../../services/updateAPI';

const UpdateCard = ({ update, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [shareCount, setShareCount] = useState(update.statistics?.shares || 0);

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-700 border-red-300',
      'High': 'bg-orange-100 text-orange-700 border-orange-300',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'Critical' || severity === 'High') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return null;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return updateTime.toLocaleDateString();
  };

  const handleShare = async () => {
    try {
      await updateAPI.shareUpdate(update.id);
      setShareCount(prev => prev + 1);
      
      // Copy link to clipboard
      const url = `${window.location.origin}/updates/${update.id}`;
      await navigator.clipboard.writeText(url);
      
      // Show notification (you can replace with a toast library)
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing update:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Alert': '🚨',
      'Weather Update': '🌦️',
      'Road Closure': '🚧',
      'Evacuation Notice': '🏃',
      'Resource Update': '📦',
      'Safety Advisory': '⚠️',
      'All Clear': '✅',
      'General Information': 'ℹ️',
      'Emergency Response': '🚑',
      'Infrastructure Damage': '🏗️'
    };
    return icons[category] || '📢';
  };

  return (
    <div className="relative">
      {/* Timeline Dot */}
      <div className="absolute left-6 top-6 w-3 h-3 bg-teal-600 rounded-full border-4 border-white shadow-lg hidden md:block z-10"></div>

      {/* Card */}
      <div className={`md:ml-14 bg-white rounded-lg border-2 transition-all ${
        update.isPinned 
          ? 'border-yellow-400 shadow-lg' 
          : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
      }`}>
        {/* Pinned Badge */}
        {update.isPinned && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 flex items-center gap-2">
            <Pin className="w-4 h-4 text-yellow-900" />
            <span className="text-sm font-bold text-yellow-900">PINNED UPDATE</span>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              {/* Severity Badge & Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(update.severity)}`}>
                  {getSeverityIcon(update.severity)}
                  {update.severity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">
                  {getCategoryIcon(update.category)} {update.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {update.title}
              </h3>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {/* Time */}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeAgo(update.timestamp)}</span>
                </div>

                {/* Location */}
                {update.location?.province && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {update.location.city || update.location.district || update.location.province}
                    </span>
                  </div>
                )}

                {/* Verified Source */}
                {update.source?.verified && (
                  <div className="flex items-center gap-1 text-teal-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">{update.source.type}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Eye className="w-4 h-4" />
                <span>{update.statistics?.views || 0}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-gray-500 hover:text-teal-600 text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareCount}</span>
              </button>
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-4">
            <p className={`text-gray-700 leading-relaxed ${!expanded && 'line-clamp-3'}`}>
              {update.content}
            </p>
          </div>

          {/* Affected Areas */}
          {update.location?.affectedAreas && update.location.affectedAreas.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-semibold text-orange-900 mb-2">Affected Areas:</p>
              <div className="flex flex-wrap gap-2">
                {update.location.affectedAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {update.tags && update.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {update.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Source Contact */}
          {expanded && update.source?.contactInfo && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Contact Information:</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">
                  {update.source.name && `${update.source.name}: `}
                  <a 
                    href={`tel:${update.source.contactInfo}`}
                    className="font-semibold hover:underline"
                  >
                    {update.source.contactInfo}
                  </a>
                </span>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          {update.content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm mt-4"
            >
              <span>{expanded ? 'Show Less' : 'Read More'}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;
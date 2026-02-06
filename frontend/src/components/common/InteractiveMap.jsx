import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    Droplet, Mountain, Activity, 
    Plus, Minus, X, Crosshair, 
    Map as MapIcon, Layers,
    Layers2
} from 'lucide-react';

// Fix for default Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Helper Components inside Map Context ---
const MapController = ({ alerts, selectedType, setMapInstance }) => {
    const map = useMap();

    useEffect(() => {
        setMapInstance(map);
    }, [map, setMapInstance]);

    // Auto-fit bounds logic
    useEffect(() => {
        if (alerts && alerts.length > 0) {
            const bounds = [];
            alerts
                .filter(alert => selectedType === 'All' || alert.alertType === selectedType)
                .forEach(alert => {
                    alert.affectedAreas?.forEach(area => {
                        if (area.boundingBox && area.boundingBox.length === 4) {
                            const [minLat, maxLat, minLon, maxLon] = area.boundingBox;
                            bounds.push([minLat, minLon]);
                            bounds.push([maxLat, maxLon]);
                        } else if (area.geometry?.coordinates) {
                            // Fallback for points
                            const coords = area.geometry.coordinates;
                            // check if Point (lon, lat)
                            if (typeof coords[0] === 'number') {
                                bounds.push([coords[1], coords[0]]); 
                            }
                        }
                    });
                });

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [100, 100], maxZoom: 12, animate: true });
            }
        }
    }, [alerts, selectedType, map]);

    return null;
};

// --- Main Component ---
const InteractiveMap = ({ alerts = [], onClose }) => {
    const [selectedType, setSelectedType] = useState('All');
    const [selectedSeverity, setSelectedSeverity] = useState('All');
    const [mapInstance, setMapInstance] = useState(null);
    
    const [selectedLayer, setSelectedLayer] = useState(false);

    const defaultCenter = [7.8731, 80.7718];
    const defaultZoom = 8;

    const alertTypes = [
        { value: 'All', label: 'All', icon: Activity, color: '#6B7280' },
        { value: 'Flood', label: 'Flood', icon: Droplet, color: '#3B82F6' },
        { value: 'Landslide', label: 'Landslide', icon: Mountain, color: '#92400E' },
    ];

    const getSeverityColor = (severity) => {
        const colors = {
            Critical: '#DC2626',
            High: '#EA580C', 
            Medium: '#EAB308',
            Low: '#16A34A' 
        };
        return colors[severity] || colors.Medium;
    };

    // Filter Logic
    const filteredAlerts = alerts.filter(alert => {
        const typeMatch = selectedType === 'All' || alert.alertType === selectedType;
        const severityMatch = selectedSeverity === 'All' || alert.severityLevel === selectedSeverity;
        return typeMatch && severityMatch;
    });

    // Custom Zoom Handlers
    const handleZoomIn = () => mapInstance?.zoomIn();
    const handleZoomOut = () => mapInstance?.zoomOut();
    const handleFitBounds = () => {
        mapInstance?.flyTo(defaultCenter, defaultZoom);
    };

    // Data Processing for Stats
    const stats = {
        total: filteredAlerts.length,
        critical: filteredAlerts.filter(a => a.severityLevel === 'Critical').length,
        high: filteredAlerts.filter(a => a.severityLevel === 'High').length,
    };

    // Coordinate Conversion Helper
    const convertCoordinates = (geometry) => {
        if (!geometry || !geometry.coordinates) return null;
        switch (geometry.type) {
            case 'Polygon': return geometry.coordinates[0].map(c => [c[1], c[0]]);
            case 'MultiPolygon': return geometry.coordinates.map(p => p[0].map(c => [c[1], c[0]]));
            case 'Point': return [geometry.coordinates[1], geometry.coordinates[0]];
            default: return null;
        }
    };

    return (
        <div className="relative w-full h-full bg-gray-100 overflow-hidden flex">
            
            {/* --- SIDEBAR VIEW (Left) --- */}
            <div className="absolute left-6 top-6 bottom-6 w-80 z-1000 flex flex-col gap-4 pointer-events-none">
                {/* Panel Container (Pointer events auto-enabled for children) */}
                <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-5 flex flex-col gap-5 pointer-events-auto border border-white/20 h-auto max-h-full overflow-y-auto custom-scrollbar">
                    
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <MapIcon className="w-5 h-5 text-teal-700" />
                            Emergency Distribution
                        </h2>
                        <p className="text-xs text-gray-700 mt-1">
                            Real-time geographic monitoring of active emergency alerts.
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Type Filters */}
                    <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">Filter by Type</label>
                        <div className="grid grid-cols-1 gap-2">
                            {alertTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = selectedType === type.value;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedType(type.value)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                            isSelected 
                                                ? 'bg-teal-100/70 border-teal-600 text-teal-800 shadow-sm' 
                                                : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-50/70' : 'bg-white'}`}>
                                            <Icon className="w-4 h-4" style={{ color: isSelected ? '#0f766e' : type.color }} />
                                        </div>
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Severity Filters */}
                    <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">Severity Level</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                                <button
                                    key={sev}
                                    onClick={() => setSelectedSeverity(sev)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                        selectedSeverity === sev
                                            ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {sev}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAP CONTROLS (Right Side) --- */}
            
            {/* Close Button (Top Right) */}
            <div className="absolute top-6 right-6 z-1000">
                <button 
                    onClick={onClose}
                    className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
                    title="Close Map"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation Controls (Bottom Right) */}
            <div className="absolute bottom-10 right-6 z-1000 flex flex-col items-center gap-4">
                {/* Layer changer */}
                <button
                    onClick={() => setSelectedLayer(!selectedLayer)} 
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 mb-2 ${selectedLayer ? 'bg-teal-600 text-white' : 'bg-black text-white'
                        }`}
                    title="Toggle Map Style"
                >
                    <Layers2 className="w-6 h-6" />
                </button>
                
                {/* Locate / Fit Bounds Button */}
                <button 
                    onClick={handleFitBounds}
                    className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 mb-2"
                    title="Reset View"
                >
                    <Crosshair className="w-6 h-6" />
                </button>

                {/* Zoom Group */}
                <div className="flex flex-col bg-black rounded-2xl shadow-xl overflow-hidden">
                    <button 
                        onClick={handleZoomIn}
                        className="w-12 h-12 flex items-center justify-center text-white hover:bg-gray-800 active:bg-gray-700 transition-colors border-b border-gray-700"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={handleZoomOut}
                        className="w-12 h-12 flex items-center justify-center text-white hover:bg-gray-800 active:bg-gray-700 transition-colors"
                    >
                        <Minus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* --- MAP CONTAINER --- */}
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                className="w-full h-full outline-none"
                zoomControl={false} // Disable default controls
                scrollWheelZoom={true}
            >

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    className={selectedLayer ? "blue-map-tiles" : ""}
                    key={selectedLayer ? 'blue' : 'normal'}
                />

                <MapController 
                    alerts={filteredAlerts} 
                    selectedType={selectedType} 
                    setMapInstance={setMapInstance} 
                />

                {filteredAlerts.map((alert) => {
                    const color = getSeverityColor(alert.severityLevel);
                    
                    return alert.affectedAreas?.map((area, index) => {
                        const coords = convertCoordinates(area.geometry);
                        if (!coords) return null;
                        const key = `${alert._id}-${index}`;

                        const PopupContent = (
                            <Popup closeButton={false} className="custom-popup">
                                <div className="p-1 min-w-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: color }}>
                                            {alert.severityLevel}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{alert.timeAgo}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{alert.title}</h3>
                                    <p className="text-xs text-gray-600 line-clamp-2">{alert.message}</p>
                                </div>
                            </Popup>
                        );

                        if (area.geometry.type === 'Point') {
                            return (
                                <Circle 
                                    key={key} center={coords} radius={3000}
                                    pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 1, className: 'pulse-animation' }}
                                >
                                    {PopupContent}
                                </Circle>
                            );
                        } else if (area.geometry.type === 'Polygon' || area.geometry.type === 'MultiPolygon') {
                            return (
                                <Polygon 
                                    key={key} positions={coords}
                                    pathOptions={{ color, fillColor: color, fillOpacity: 0.2, weight: 1 }}
                                >
                                    {PopupContent}
                                </Polygon>
                            );
                        }
                        return null;
                    });
                })}
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
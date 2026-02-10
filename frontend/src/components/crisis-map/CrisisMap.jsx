import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair } from 'lucide-react';

// --- 1. Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- 2. Map Controls (Fit to Bounds only) ---
const MapControls = ({ onFitBounds }) => {
    return (
        <div className="absolute bottom-8 right-6 z-400">
            <button
                onClick={onFitBounds}
                className="w-12 h-12 bg-white text-gray-700 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform duration-200 border border-gray-200"
                title="Fit to Data"
            >
                <Crosshair className="w-6 h-6 text-teal-600" />
            </button>
        </div>
    );
};

// --- 3. Scroll Zoom Control Component ---
const ScrollZoomController = ({ enableScrollZoom }) => {
    const map = useMap();

    useEffect(() => {
        if (enableScrollZoom) {
            map.scrollWheelZoom.enable();

            const originalHandler = map.scrollWheelZoom._onWheelScroll;
            map.scrollWheelZoom._onWheelScroll = function (e) {
                if (e.ctrlKey || e.metaKey) {
                    originalHandler.call(this, e);
                } else {
                    const hint = document.querySelector('.scroll-zoom-hint');
                    if (hint) {
                        hint.classList.add('show');
                        setTimeout(() => hint.classList.remove('show'), 1500);
                    }
                }
            };
        } else {
            map.scrollWheelZoom.disable();
        }
    }, [map, enableScrollZoom]);

    return null;
};

// --- 4. Internal Map Logic (Events & FitBounds) ---
const MapLogic = ({ setMapInstance, bounds, enableScrollZoom }) => {
    const map = useMap();

    useEffect(() => {
        setMapInstance(map);
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map, setMapInstance]);

    useEffect(() => {
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [100, 100], maxZoom: 12, animate: true, duration: 1.5 });
        }
    }, [bounds, map]);

    return <ScrollZoomController enableScrollZoom={enableScrollZoom} />;
};

// --- 5. Main Component ---
const CrisisMap = ({ 
    alerts = [], 
    enableScrollZoom = false, 
    selectedAlertType = 'All',
    isEmbedded = false,
    intialZoom = 8,
    tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
 }) => {
    const [map, setMap] = useState(null);

    // -- Utilities --
    const getSeverityColor = (severity) => {
        const colors = {
            Critical: '#DC2626',
            High: '#EA580C',
            Medium: '#EAB308',
            Low: '#16A34A'
        };
        return colors[severity] || colors.Medium;
    };

    const convertCoordinates = (geometry) => {
        if (!geometry || !geometry.coordinates) return null;
        switch (geometry.type) {
            case 'Polygon':
                return geometry.coordinates[0].map(c => [c[1], c[0]]);
            case 'MultiPolygon':
                return geometry.coordinates.map(p => p[0].map(c => [c[1], c[0]]));
            case 'Point':
                return [geometry.coordinates[1], geometry.coordinates[0]];
            default:
                return null;
        }
    };

    // -- Memoized Data Processing --
    const filteredAlerts = useMemo(() => {
        return alerts.filter(a => selectedAlertType === 'All' || a.alertType === selectedAlertType);
    }, [alerts, selectedAlertType]);

    // Calculate bounds from bounding boxes or coordinates
    const activeBounds = useMemo(() => {
        const bounds = [];
        filteredAlerts.forEach(alert => {
            alert.affectedAreas?.forEach(area => {
                if (area.boundingBox && area.boundingBox.length === 4) {
                    const [minLat, maxLat, minLon, maxLon] = area.boundingBox;
                    bounds.push([minLat, minLon]);
                    bounds.push([maxLat, maxLon]);
                } else {
                    const coords = convertCoordinates(area.geometry);
                    if (!coords) return;

                    if (area.geometry.type === 'Point') {
                        bounds.push(coords);
                    } else if (Array.isArray(coords[0])) {
                        coords.forEach(pt => bounds.push(pt));
                    } else if (Array.isArray(coords[0][0])) {
                        coords.flat().forEach(pt => bounds.push(pt));
                    }
                }
            });
        });
        return bounds;
    }, [filteredAlerts]);

    // -- Handlers --
    const handleFitBounds = () => {
        if (activeBounds.length > 0) {
            map?.fitBounds(activeBounds, { padding: [100, 100], maxZoom: 12, animate: true });
        } else {
            map?.setView([7.8731, 80.7718], 8);
        }
    };

    return (
        <div className="relative w-full h-full bg-gray-100 overflow-hidden">
            {/* Scroll Zoom Hint Message */}
            {enableScrollZoom && (
                <div className="scroll-zoom-hint">
                    Use Ctrl + Scroll to zoom
                </div>
            )}

            <MapContainer
                center={[7.8731, 80.7718]}
                zoom={8}
                minZoom={8}
                maxZoom={18}
                maxBounds={[[5.5, 79.0], [10.0, 82.5]]}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={false}
                className="w-full h-full outline-none"
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={tileUrl}
                    subdomains="abcd"
                    className="blue-map-tiles"
                />

                <MapLogic
                    setMapInstance={setMap}
                    bounds={activeBounds}
                    enableScrollZoom={enableScrollZoom}
                />

                {/* Data Layer */}
                {filteredAlerts.map((alert) => {
                    const color = getSeverityColor(alert.severityLevel);

                    return alert.affectedAreas?.map((area, idx) => {
                        const coords = convertCoordinates(area.geometry);
                        if (!coords) return null;
                        const key = `${alert._id}-${idx}`;

                        

                        if (area.geometry.type === 'Point') {
                            return (
                                <React.Fragment key={key}>
                                    <Circle
                                        center={coords}
                                        radius={3000}
                                        pathOptions={{
                                            color,
                                            fillColor: color,
                                            fillOpacity: 0.6,
                                            weight: 1,
                                            className: 'pulse-animation'
                                        }}
                                    />
                                    <Circle
                                        center={coords}
                                        radius={200}
                                        pathOptions={{
                                            color: '#fff',
                                            fillColor: color,
                                            fillOpacity: 1,
                                            weight: 1
                                        }}
                                    />
                                    
                                </React.Fragment>
                            );
                        }

                        return (
                            <Polygon
                                key={key}
                                positions={coords}
                                pathOptions={{
                                    color,
                                    fillColor: color,
                                    fillOpacity: 0.2,
                                    weight: 2
                                }}
                            >
                                {PopupContent}
                            </Polygon>
                        );
                    });
                })}
            </MapContainer>

            {/* Controls Layer */}
            {!isEmbedded && <MapControls onFitBounds={handleFitBounds} />}
        </div>
    );
};

export default CrisisMap;
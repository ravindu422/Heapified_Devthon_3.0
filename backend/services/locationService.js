import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// in-memory cache for location search
const cache = new Map();
const CACHE_DURATION = 100 * 60 * 60; // 1 hour

export const searchLocations = async (query) => {
    try {
        const cacheKey = `search:${query.toLowerCase()}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('Cache hit for:', query);
            return cached.data;
        }

        await delay(1000);

        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 5,
                polygon_geojson: 1,
                countrycodes: 'lk'
            },
            headers: {
                'User-Agent': 'SafeLanka/1.0'
            }
        });

        const data =  response.data.map(location => ({
            placeId: location.place_id,
            displayName: location.display_name,
            name: location.name,
            coordinates: {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
            },
            boundingBox: location.boundingbox?.map(coord => parseFloat(coord)),
            geometry: location.geojson || {
                type: 'Point',
                coordinates: [parseFloat(location.lon), parseFloat(location.lat)]
            },
            type: location.type,
            importance: location.importance
        }));

        cache.set(cacheKey, { data, timestamp: Date.now() });

        if (cache.size > 1000) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        return data;
    } catch (error) {
        console.error('Location search error:', error);
        throw new Error('Failed to search locations');
    }
};
import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const searchLocations = async (query) => {
    try {
        await delay(1000);

        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 5,
                polygon_geoson: 1,
                countrycodes: 'lk'
            },
            headers: {
                'User-Agent': 'SafeLanka/1.0'
            }
        });

        return response.data.map(location => ({
            placeId: location.place_id,
            displayName: location.display_name,
            coordinates: {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
            },
            boudingBox: location.boudingbox?.map(coord => parseFloat(coord)),
            geometry: location.geojson || {
                type: 'Point',
                coordinates: [parseFloat(location.lon), parseFloat(location.lat)]
            },
            type: location.type,
            importance: location.importance
        }))
    } catch (error) {
        console.error('Location search error:', error);
        throw new Error('Failed to search locations');
    }
};

export const getLocationDetails = async (placeId) => {
    try {
        await delay(1000);

        const response = await axios.get(`${NOMINATIM_BASE_URL}/details`, {
            params: {
                place_id: placeId,
                format: 'json',
                polygon_geoson: 1
            },
            headers: {
                'User-Agent': 'SafeLanka/1.0'
            }
        });

        return {
            geometry: response.data.geometry,
            boundingBox: response.data.boudingbox
        }
    } catch (error) {
        console.error('Location details error:', error);
        return null;
    }
}
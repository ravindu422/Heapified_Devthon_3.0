// Temporary in-memory mock data. Replace with Mongo models later.
const centers = [
  {
    id: 'wpc-001',
    name: 'Colombo Central Distribution Center',
    province: 'Western',
    district: 'Colombo',
    location: { lat: 6.9271, lng: 79.8612, address: 'No 12, Galle Rd, Colombo', city: 'Colombo', district: 'Colombo', province: 'Western' },
    contact: { phone: '+94 11 234 5678', person: 'Coordinator - Nimal' },
    hours: '06:00 - 22:00',
    supplies: {
      food: { current: 1200, capacity: 2000 },
      water: { current: 800, capacity: 1500 },
      medical: { current: 260, capacity: 600 }
    },
    amenities: ['power', 'cold_storage', 'parking'],
    updatedAt: new Date()
  },
  {
    id: 'sp-014',
    name: 'Galle Relief Hub',
    province: 'Southern',
    district: 'Galle',
    location: { lat: 6.0535, lng: 80.2210, address: 'Matara Rd, Galle', city: 'Galle', district: 'Galle', province: 'Southern' },
    contact: { phone: '+94 91 445 8899', person: 'Coordinator - Sashini' },
    hours: '24/7',
    supplies: {
      food: { current: 420, capacity: 800 },
      water: { current: 220, capacity: 700 },
      medical: { current: 90, capacity: 300 }
    },
    amenities: ['generator', 'medical_staff'],
    updatedAt: new Date()
  },
  {
    id: 'cp-008',
    name: 'Kandy Supply Depot',
    province: 'Central',
    district: 'Kandy',
    location: { lat: 7.2906, lng: 80.6337, address: 'Peradeniya Rd, Kandy', city: 'Kandy', district: 'Kandy', province: 'Central' },
    contact: { phone: '+94 81 223 1122', person: 'Coordinator - Chathura' },
    hours: '08:00 - 20:00',
    supplies: {
      food: { current: 1600, capacity: 1600 },
      water: { current: 1550, capacity: 1600 },
      medical: { current: 520, capacity: 800 }
    },
    amenities: ['power', 'loading_dock'],
    updatedAt: new Date()
  }
];

const kmBetween = (a, b) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const withDistance = (list, latitude, longitude) => {
  if (latitude == null || longitude == null) return list.map(c => ({ ...c }));
  const user = { lat: Number(latitude), lng: Number(longitude) };
  return list.map(c => ({
    ...c,
    distanceKm: Math.round(kmBetween(user, c.location) * 10) / 10
  }));
};

const normalizeProvince = (p) => String(p || '').toLowerCase().replace(/\s*province$/, '').trim();

const applyFilters = (list, { province, district, amenities, minFood, minWater, minMedical, maxDistance, latitude, longitude }) => {
  let r = [...list];
  if (province) r = r.filter(c => normalizeProvince(c.province) === normalizeProvince(province));
  if (district) r = r.filter(c => c.district && c.district.toLowerCase() === String(district).toLowerCase());
  if (amenities) {
    const req = String(amenities).split(',').map(a => a.trim().toLowerCase());
    r = r.filter(c => req.every(a => c.amenities.map(x => x.toLowerCase()).includes(a)));
  }
  if (minFood) r = r.filter(c => c.supplies.food.current >= Number(minFood));
  if (minWater) r = r.filter(c => c.supplies.water.current >= Number(minWater));
  if (minMedical) r = r.filter(c => c.supplies.medical.current >= Number(minMedical));

  r = withDistance(r, latitude, longitude);
  if (maxDistance && latitude && longitude) r = r.filter(c => c.distanceKm <= Number(maxDistance));
  return r;
};

const getCapacityRatio = (s) => ({
  food: +(s.food.current / s.food.capacity).toFixed(2),
  water: +(s.water.current / s.water.capacity).toFixed(2),
  medical: +(s.medical.current / s.medical.capacity).toFixed(2)
});

const toCard = (c) => ({
  id: c.id,
  name: c.name,
  province: c.province,
  address: c.location.address,
  distanceKm: c.distanceKm,
  supplies: c.supplies,
  hours: c.hours,
  contact: c.contact,
  amenities: c.amenities,
  updatedAt: c.updatedAt
});

// GET /api/resources
export const getResources = (req, res) => {
  const filtered = applyFilters(centers, req.query || {});
  const sorted = (req.query?.sortBy === 'distance')
    ? filtered.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    : filtered;
  res.json({ success: true, data: sorted.map(toCard) });
};

// GET /api/resources/:id
export const getResourceById = (req, res) => {
  const c = centers.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Center not found' });
  const withDist = withDistance([c], req.query.latitude, req.query.longitude)[0];
  res.json({ success: true, data: { ...withDist, utilization: getCapacityRatio(c.supplies) } });
};

// GET /api/resources/search/item
export const searchItem = (req, res) => {
  const { itemName = '', minStock = 1 } = req.query;
  const term = String(itemName).toLowerCase();
  const result = centers
    .map(c => ({ c, matches: ['food', 'water', 'medical'].filter(k => k.includes(term) && c.supplies[k]?.current >= Number(minStock)) }))
    .filter(x => x.matches.length > 0)
    .map(x => ({ ...toCard(x.c), items: x.matches }));
  res.json({ success: true, data: result });
};

// GET /api/resources/alerts
export const getAlerts = (req, res) => {
  const alerts = centers.flatMap(c => {
    const items = [];
    if (c.supplies.food.current / c.supplies.food.capacity < 0.25) items.push('food');
    if (c.supplies.water.current / c.supplies.water.capacity < 0.25) items.push('water');
    if (c.supplies.medical.current / c.supplies.medical.capacity < 0.25) items.push('medical');
    return items.map(name => ({ id: `${c.id}-${name}`, centerId: c.id, centerName: c.name, item: name, severity: 'low', updatedAt: c.updatedAt }));
  });
  res.json({ success: true, data: alerts });
};

// GET /api/resources/stats
export const getStats = (req, res) => {
  const total = centers.reduce((acc, c) => {
    acc.food.current += c.supplies.food.current; acc.food.capacity += c.supplies.food.capacity;
    acc.water.current += c.supplies.water.current; acc.water.capacity += c.supplies.water.capacity;
    acc.medical.current += c.supplies.medical.current; acc.medical.capacity += c.supplies.medical.capacity;
    return acc;
  }, { food: { current: 0, capacity: 0 }, water: { current: 0, capacity: 0 }, medical: { current: 0, capacity: 0 } });

  res.json({ success: true, data: {
    totals: total,
    centers: centers.length,
    provinces: [...new Set(centers.map(c => c.province))],
    updatedAt: new Date()
  }});
};

export default { getResources, getResourceById, searchItem, getAlerts, getStats };

import mongoose from 'mongoose';
import Update from '../models/Update.model.js';

const isDbConnected = () => mongoose.connection?.readyState === 1;

const shouldFallbackDbError = (error) => {
  const msg = String(error?.message || '');
  const name = String(error?.name || '');
  return (
    name === 'MongoServerSelectionError' ||
    name === 'MongoNetworkError' ||
    msg.includes('MongoServerSelectionError') ||
    msg.includes('MongoNetworkError') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('ReplicaSetNoPrimary')
  );
};

const mockUpdates = [
  {
    id: 'upd-001',
    title: 'Critical Flood Warning - Immediate Evacuation Required',
    content: 'Water levels in Kelani River have reached critical levels. All residents in low-lying areas of Colombo, Kaduwela, and Kelaniya are advised to evacuate immediately. Emergency shelters have been opened at Nalanda College and Royal College.',
    severity: 'Critical',
    category: 'Evacuation Notice',
    location: {
      province: 'Western Province',
      district: 'Colombo',
      city: 'Colombo',
      affectedAreas: ['Kaduwela', 'Kelaniya', 'Kolonnawa', 'Peliyagoda']
    },
    source: { type: 'DMC', name: 'Disaster Management Centre', verified: true, contactInfo: '117' },
    timestamp: new Date(Date.now() - 15 * 60000),
    isPinned: true,
    tags: ['flood', 'evacuation', 'critical', 'kelani river'],
    media: [],
    statistics: { views: 0, shares: 0 }
  },
  {
    id: 'upd-002',
    title: 'Landslide Alert Issued for Central Province',
    content: 'Heavy rainfall has destabilized slopes in Nuwara Eliya and Badulla districts. Residents in hilly areas should remain vigilant and be prepared to evacuate if necessary. Avoid traveling on hill country roads during heavy rain.',
    severity: 'High',
    category: 'Alert',
    location: {
      province: 'Central Province',
      district: 'Nuwara Eliya',
      city: 'Nuwara Eliya',
      affectedAreas: ['Nuwara Eliya', 'Badulla', 'Hatton', 'Bandarawela']
    },
    source: { type: 'Weather Bureau', name: 'Department of Meteorology', verified: true },
    timestamp: new Date(Date.now() - 45 * 60000),
    isPinned: true,
    tags: ['landslide', 'rainfall', 'central province'],
    media: [],
    statistics: { views: 0, shares: 0 }
  },
  {
    id: 'upd-003',
    title: 'Galle Road Partially Closed Due to Flooding',
    content: 'Galle Road between Bambalapitiya and Wellawatte is experiencing severe flooding. Motorists are advised to use alternative routes. Traffic is being diverted through Duplication Road.',
    severity: 'High',
    category: 'Road Closure',
    location: {
      province: 'Western Province',
      district: 'Colombo',
      city: 'Colombo',
      affectedAreas: ['Bambalapitiya', 'Wellawatte', 'Kollupitiya']
    },
    source: { type: 'Police', name: 'Traffic Police Colombo', verified: true, contactInfo: '119' },
    timestamp: new Date(Date.now() - 2 * 3600000),
    isPinned: false,
    tags: ['road closure', 'traffic', 'flooding', 'galle road'],
    media: [],
    statistics: { views: 0, shares: 0 }
  },
  {
    id: 'upd-004',
    title: 'Temporary Shelter Opened at Gampaha',
    content: 'A temporary shelter has been opened at Gampaha Bandaranayake College to accommodate displaced families. Shelter provides food, water, and basic medical facilities. Contact coordinator for registration.',
    severity: 'Medium',
    category: 'General Information',
    location: {
      province: 'Western Province',
      district: 'Gampaha',
      city: 'Gampaha',
      affectedAreas: ['Gampaha']
    },
    source: { type: 'Coordinator', name: 'Mrs. Kumari Silva', verified: true },
    timestamp: new Date(Date.now() - 6 * 3600000),
    isPinned: false,
    tags: ['shelter', 'accommodation', 'gampaha'],
    media: [],
    statistics: { views: 0, shares: 0 }
  }
];

const toBool = (v) => String(v).toLowerCase() === 'true';

const applyMockFilters = (list, query) => {
  let r = [...list];

  if (query.severity) {
    const severities = String(query.severity).split(',').map(s => s.trim()).filter(Boolean);
    if (severities.length) r = r.filter(u => severities.includes(u.severity));
  }

  if (query.category) r = r.filter(u => u.category === query.category);
  if (query.province) r = r.filter(u => u.location?.province === query.province);
  if (query.district) r = r.filter(u => u.location?.district === query.district);

  if (query.dateFrom) {
    const from = new Date(query.dateFrom);
    if (!Number.isNaN(from.getTime())) r = r.filter(u => new Date(u.timestamp) >= from);
  }
  if (query.dateTo) {
    const to = new Date(query.dateTo);
    if (!Number.isNaN(to.getTime())) r = r.filter(u => new Date(u.timestamp) <= to);
  }

  if (query.tags) {
    const tags = String(query.tags).split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    if (tags.length) r = r.filter(u => (u.tags || []).some(t => tags.includes(String(t).toLowerCase())));
  }

  if (query.verified === 'true') r = r.filter(u => u.source?.verified === true);
  if (query.isPinned === 'true') r = r.filter(u => u.isPinned === true);

  if (query.search) {
    const s = String(query.search).toLowerCase();
    r = r.filter(u =>
      String(u.title || '').toLowerCase().includes(s) ||
      String(u.content || '').toLowerCase().includes(s) ||
      (u.tags || []).some(t => String(t).toLowerCase().includes(s))
    );
  }

  const sortBy = query.sortBy || 'timestamp';
  const sortOrder = (query.sortOrder || 'desc').toLowerCase();
  const sortDir = sortOrder === 'asc' ? 1 : -1;

  r.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    const av = a[sortBy] ?? a.timestamp;
    const bv = b[sortBy] ?? b.timestamp;
    const ad = av instanceof Date ? av.getTime() : new Date(av).getTime();
    const bd = bv instanceof Date ? bv.getTime() : new Date(bv).getTime();
    return (ad - bd) * sortDir;
  });

  return r;
};

/**
 * @desc    Get all updates with filters
 * @route   GET /api/updates
 * @access  Public
 */
export const getUpdates = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const page = Math.max(1, parseInt(req.query.page || '1', 10));
      const limit = Math.max(1, parseInt(req.query.limit || '20', 10));

      const filtered = applyMockFilters(mockUpdates, req.query);
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return res.status(200).json({
        success: true,
        count: data.length,
        total,
        page,
        totalPages,
        data
      });
    }

    const {
      severity,
      category,
      province,
      district,
      dateFrom,
      dateTo,
      tags,
      verified,
      isPinned,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Filter by severity
    if (severity) {
      const severities = severity.split(',');
      query.severity = { $in: severities };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (province) {
      query['location.province'] = province;
    }
    if (district) {
      query['location.district'] = district;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(',');
      query.tags = { $in: tagList };
    }

    // Filter by verified source
    if (verified === 'true') {
      query['source.verified'] = true;
    }

    // Filter by pinned
    if (isPinned === 'true') {
      query.isPinned = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Check for expired updates
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ];

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Always prioritize pinned items
    const finalSort = { isPinned: -1, ...sortOptions };

    // Pagination
    const skip = (page - 1) * limit;

    let updates;
    let total;

    try {
      // Execute query
      updates = await Update.find(query)
        .sort(finalSort)
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      // Get total count for pagination
      total = await Update.countDocuments(query);
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const pageNum = Math.max(1, parseInt(req.query.page || '1', 10));
        const limitNum = Math.max(1, parseInt(req.query.limit || '20', 10));

        const filtered = applyMockFilters(mockUpdates, req.query);
        const totalFallback = filtered.length;
        const totalPagesFallback = Math.max(1, Math.ceil(totalFallback / limitNum));
        const start = (pageNum - 1) * limitNum;
        const data = filtered.slice(start, start + limitNum);

        return res.status(200).json({
          success: true,
          count: data.length,
          total: totalFallback,
          page: pageNum,
          totalPages: totalPagesFallback,
          data
        });
      }

      throw dbError;
    }

    // Format for timeline
    const formattedUpdates = updates.map(update => ({
      id: update._id,
      title: update.title,
      content: update.content,
      severity: update.severity,
      category: update.category,
      location: update.location,
      source: update.source,
      timestamp: update.createdAt,
      isPinned: update.isPinned,
      tags: update.tags,
      media: update.media,
      statistics: update.statistics
    }));

    res.status(200).json({
      success: true,
      count: formattedUpdates.length,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: formattedUpdates
    });

  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching updates',
      error: error.message
    });
  }
};

/**
 * @desc    Get updates by location
 * @route   GET /api/updates/location/:province
 * @access  Public
 */
export const getUpdatesByLocation = async (req, res) => {
  try {
    const { province } = req.params;
    const { district } = req.query;

    if (!isDbConnected()) {
      const filtered = applyMockFilters(mockUpdates, { ...req.query, province, district });
      return res.status(200).json({
        success: true,
        count: filtered.length,
        province,
        district: district || 'All',
        data: filtered
      });
    }

    let updates;
    try {
      updates = await Update.getByLocation(province, district);
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const filtered = applyMockFilters(mockUpdates, { ...req.query, province, district });
        return res.status(200).json({
          success: true,
          count: filtered.length,
          province,
          district: district || 'All',
          data: filtered
        });
      }
      throw dbError;
    }

    res.status(200).json({
      success: true,
      count: updates.length,
      province: province,
      district: district || 'All',
      data: updates
    });

  } catch (error) {
    console.error('Error fetching updates by location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching updates by location',
      error: error.message
    });
  }
};

/**
 * @desc    Get recent critical updates
 * @route   GET /api/updates/critical/recent
 * @access  Public
 */
export const getRecentCritical = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    if (!isDbConnected()) {
      const critical = mockUpdates
        .filter(u => u.severity === 'Critical' || u.severity === 'High')
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        })
        .slice(0, parseInt(limit));

      return res.status(200).json({
        success: true,
        count: critical.length,
        data: critical
      });
    }

    let updates;
    try {
      updates = await Update.getRecentCritical(parseInt(limit));
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const critical = mockUpdates
          .filter(u => u.severity === 'Critical' || u.severity === 'High')
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          })
          .slice(0, parseInt(limit));

        return res.status(200).json({
          success: true,
          count: critical.length,
          data: critical
        });
      }
      throw dbError;
    }

    res.status(200).json({
      success: true,
      count: updates.length,
      data: updates
    });

  } catch (error) {
    console.error('Error fetching recent critical updates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent critical updates',
      error: error.message
    });
  }
};

/**
 * @desc    Get update by ID
 * @route   GET /api/updates/:id
 * @access  Public
 */
export const getUpdateById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const update = mockUpdates.find(u => String(u.id) === String(req.params.id));

      if (!update) {
        return res.status(404).json({
          success: false,
          message: 'Update not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: update
      });
    }

    let update;
    try {
      update = await Update.findById(req.params.id);
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const fallbackUpdate = mockUpdates.find(u => String(u.id) === String(req.params.id));
        if (!fallbackUpdate) {
          return res.status(404).json({
            success: false,
            message: 'Update not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: fallbackUpdate
        });
      }

      throw dbError;
    }

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    await update.incrementViews();

    res.status(200).json({
      success: true,
      data: update
    });

  } catch (error) {
    console.error('Error fetching update:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching update',
      error: error.message
    });
  }
};

/**
 * @desc    Search updates
 * @route   GET /api/updates/search
 * @access  Public
 */
export const searchUpdates = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    if (!isDbConnected()) {
      const updates = applyMockFilters(mockUpdates, { search: q, verified: req.query.verified });
      return res.status(200).json({
        success: true,
        count: updates.length,
        query: q,
        data: updates
      });
    }

    let updates;
    try {
      updates = await Update.searchUpdates(q);
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const fallback = applyMockFilters(mockUpdates, { search: q, verified: req.query.verified });
        return res.status(200).json({
          success: true,
          count: fallback.length,
          query: q,
          data: fallback
        });
      }
      throw dbError;
    }

    res.status(200).json({
      success: true,
      count: updates.length,
      query: q,
      data: updates
    });
  } catch (error) {
    console.error('Error searching updates:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching updates',
      error: error.message
    });
  }
};

/**
 * @desc    Get updates statistics
 * @route   GET /api/updates/stats
 * @access  Public
 */
export const getUpdateStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const totalUpdates = mockUpdates.length;
      const criticalUpdates = mockUpdates.filter(u => u.severity === 'Critical').length;
      const highUpdates = mockUpdates.filter(u => u.severity === 'High').length;
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentUpdates = mockUpdates.filter(u => new Date(u.timestamp) >= dayAgo).length;

      const byCategory = Object.entries(
        mockUpdates.reduce((acc, u) => {
          acc[u.category] = (acc[u.category] || 0) + 1;
          return acc;
        }, {})
      ).map(([k, v]) => ({ _id: k, count: v }));

      const bySeverity = Object.entries(
        mockUpdates.reduce((acc, u) => {
          acc[u.severity] = (acc[u.severity] || 0) + 1;
          return acc;
        }, {})
      ).map(([k, v]) => ({ _id: k, count: v }));

      return res.status(200).json({
        success: true,
        data: {
          total: totalUpdates,
          critical: criticalUpdates,
          high: highUpdates,
          last24Hours: recentUpdates,
          byCategory,
          bySeverity
        }
      });
    }

    let totalUpdates;
    let criticalUpdates;
    let highUpdates;
    let recentUpdates;
    let byCategory;
    let bySeverity;

    try {
      totalUpdates = await Update.countDocuments({ isActive: true });
      criticalUpdates = await Update.countDocuments({ isActive: true, severity: 'Critical' });
      highUpdates = await Update.countDocuments({ isActive: true, severity: 'High' });
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      recentUpdates = await Update.countDocuments({ isActive: true, createdAt: { $gte: dayAgo } });

      byCategory = await Update.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      bySeverity = await Update.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const totalFallback = mockUpdates.length;
        const criticalFallback = mockUpdates.filter(u => u.severity === 'Critical').length;
        const highFallback = mockUpdates.filter(u => u.severity === 'High').length;
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentFallback = mockUpdates.filter(u => new Date(u.timestamp) >= dayAgo).length;

        const byCategoryFallback = Object.entries(
          mockUpdates.reduce((acc, u) => {
            acc[u.category] = (acc[u.category] || 0) + 1;
            return acc;
          }, {})
        ).map(([k, v]) => ({ _id: k, count: v }));

        const bySeverityFallback = Object.entries(
          mockUpdates.reduce((acc, u) => {
            acc[u.severity] = (acc[u.severity] || 0) + 1;
            return acc;
          }, {})
        ).map(([k, v]) => ({ _id: k, count: v }));

        return res.status(200).json({
          success: true,
          data: {
            total: totalFallback,
            critical: criticalFallback,
            high: highFallback,
            last24Hours: recentFallback,
            byCategory: byCategoryFallback,
            bySeverity: bySeverityFallback
          }
        });
      }

      throw dbError;
    }

    res.status(200).json({
      success: true,
      data: {
        total: totalUpdates,
        critical: criticalUpdates,
        high: highUpdates,
        last24Hours: recentUpdates,
        byCategory,
        bySeverity
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get available filter options
 * @route   GET /api/updates/filters/options
 * @access  Public
 */
export const getFilterOptions = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const provinces = [...new Set(mockUpdates.map(u => u.location?.province).filter(Boolean))].sort();
      const districts = [...new Set(mockUpdates.map(u => u.location?.district).filter(Boolean))].sort();
      const categories = [...new Set(mockUpdates.map(u => u.category).filter(Boolean))].sort();
      const severities = ['Critical', 'High', 'Medium', 'Low'];

      return res.status(200).json({
        success: true,
        data: { provinces, districts, categories, severities }
      });
    }

    let provinces;
    let districts;
    let categories;
    const severities = ['Critical', 'High', 'Medium', 'Low'];

    try {
      provinces = await Update.distinct('location.province', { isActive: true });
      districts = await Update.distinct('location.district', { isActive: true });
      categories = await Update.distinct('category', { isActive: true });
    } catch (dbError) {
      if (shouldFallbackDbError(dbError)) {
        const provincesFallback = [...new Set(mockUpdates.map(u => u.location?.province).filter(Boolean))].sort();
        const districtsFallback = [...new Set(mockUpdates.map(u => u.location?.district).filter(Boolean))].sort();
        const categoriesFallback = [...new Set(mockUpdates.map(u => u.category).filter(Boolean))].sort();

        return res.status(200).json({
          success: true,
          data: {
            provinces: provincesFallback,
            districts: districtsFallback,
            categories: categoriesFallback,
            severities
          }
        });
      }

      throw dbError;
    }

    res.status(200).json({
      success: true,
      data: {
        provinces: provinces.filter(Boolean).sort(),
        districts: districts.filter(Boolean).sort(),
        categories: categories.filter(Boolean).sort(),
        severities
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

/**
 * @desc    Create new update
 * @route   POST /api/updates
 * @access  Private
 */
export const createUpdate = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }

    const update = await Update.create(req.body);
    res.status(201).json({ success: true, data: update });
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(400).json({ success: false, message: 'Error creating update', error: error.message });
  }
};

/**
 * @desc    Update an update
 * @route   PUT /api/updates/:id
 * @access  Private
 */
export const updateUpdate = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }

    const update = await Update.findByIdAndUpdate(
      req.params.id,
      { ...req.body, 'metadata.lastEditedAt': new Date() },
      { new: true, runValidators: true }
    );

    if (!update) {
      return res.status(404).json({ success: false, message: 'Update not found' });
    }

    res.status(200).json({ success: true, data: update });
  } catch (error) {
    console.error('Error updating update:', error);
    res.status(400).json({ success: false, message: 'Error updating update', error: error.message });
  }
};

/**
 * @desc    Delete update (soft delete)
 * @route   DELETE /api/updates/:id
 * @access  Private
 */
export const deleteUpdate = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }

    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ success: false, message: 'Update not found' });
    }

    update.isActive = false;
    await update.save();

    res.status(200).json({ success: true, message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ success: false, message: 'Error deleting update', error: error.message });
  }
};

/**
 * @desc    Increment share count
 * @route   POST /api/updates/:id/share
 * @access  Public
 */
export const shareUpdate = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    await update.incrementShares();

    res.status(200).json({
      success: true,
      message: 'Share count updated',
      shares: update.statistics.shares
    });

  } catch (error) {
    console.error('Error sharing update:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing update',
      error: error.message
    });
  }
};
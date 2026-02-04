const SafeZone = require('../models/SafeZone.model');

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * @desc    Get all safe zones with filters
 * @route   GET /api/safe-zones
 * @access  Public
 */
exports.getSafeZones = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      maxDistance,
      type,
      status,
      amenities,
      district,
      province,
      minCapacity,
      sortBy,
      page = 1,
      limit = 50
    } = req.query;

    let query = { isActive: true };
    let safeZones;

    // If coordinates provided, use geospatial query
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const distance = maxDistance ? parseInt(maxDistance) * 1000 : 50000; // Convert km to meters

      safeZones = await SafeZone.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            },
            $maxDistance: distance
          }
        },
        isActive: true
      });

      // Calculate distance for each safe zone
      safeZones = safeZones.map(zone => {
        const dist = calculateDistance(
          lat,
          lon,
          zone.location.coordinates[1],
          zone.location.coordinates[0]
        );
        return {
          ...zone.toObject(),
          distance: parseFloat(dist.toFixed(2))
        };
      });

    } else {
      // Regular query without geospatial search
      safeZones = await SafeZone.find(query);
      safeZones = safeZones.map(zone => zone.toObject());
    }

    // Apply filters
    if (type) {
      safeZones = safeZones.filter(zone => zone.type === type);
    }

    if (status) {
      safeZones = safeZones.filter(zone => zone.status === status);
    }

    if (district) {
      safeZones = safeZones.filter(zone => 
        zone.location.district.toLowerCase() === district.toLowerCase()
      );
    }

    if (province) {
      safeZones = safeZones.filter(zone => 
        zone.location.province.toLowerCase() === province.toLowerCase()
      );
    }

    if (minCapacity) {
      const minCap = parseInt(minCapacity);
      safeZones = safeZones.filter(zone => zone.availableSpots >= minCap);
    }

    // Filter by amenities
    if (amenities) {
      const amenityList = amenities.split(',');
      safeZones = safeZones.filter(zone => {
        return amenityList.every(amenity => zone.amenities[amenity.trim()] === true);
      });
    }

    // Sort results
    if (sortBy) {
      switch (sortBy) {
        case 'distance':
          safeZones.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case 'capacity':
          safeZones.sort((a, b) => b.availableSpots - a.availableSpots);
          break;
        case 'name':
          safeZones.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          safeZones.sort((a, b) => b.rating.average - a.rating.average);
          break;
        default:
          // Default sort by distance if available, otherwise by name
          if (latitude && longitude) {
            safeZones.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          }
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = safeZones.slice(startIndex, endIndex);

    // Format response
    const response = {
      success: true,
      count: paginatedResults.length,
      total: safeZones.length,
      page: parseInt(page),
      totalPages: Math.ceil(safeZones.length / limit),
      data: paginatedResults
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching safe zones:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching safe zones',
      error: error.message
    });
  }
};

/**
 * @desc    Get single safe zone by ID
 * @route   GET /api/safe-zones/:id
 * @access  Public
 */
exports.getSafeZoneById = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const safeZone = await SafeZone.findById(req.params.id);

    if (!safeZone) {
      return res.status(404).json({
        success: false,
        message: 'Safe zone not found'
      });
    }

    let result = safeZone.toObject();

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const distance = calculateDistance(
        lat,
        lon,
        safeZone.location.coordinates[1],
        safeZone.location.coordinates[0]
      );
      result.distance = parseFloat(distance.toFixed(2));
    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching safe zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching safe zone',
      error: error.message
    });
  }
};

/**
 * @desc    Find nearest safe zones
 * @route   GET /api/safe-zones/nearest
 * @access  Public
 */
exports.getNearestSafeZones = async (req, res) => {
  try {
    const { latitude, longitude, limit = 5, maxDistance = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const distance = parseInt(maxDistance) * 1000; // Convert km to meters

    const safeZones = await SafeZone.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: distance
        }
      },
      isActive: true,
      status: { $ne: 'Closed' }
    }).limit(parseInt(limit));

    // Add distance to each safe zone
    const results = safeZones.map(zone => {
      const dist = calculateDistance(
        lat,
        lon,
        zone.location.coordinates[1],
        zone.location.coordinates[0]
      );
      return {
        ...zone.toObject(),
        distance: parseFloat(dist.toFixed(2))
      };
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Error fetching nearest safe zones:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearest safe zones',
      error: error.message
    });
  }
};

/**
 * @desc    Get available amenities (for filter options)
 * @route   GET /api/safe-zones/amenities/list
 * @access  Public
 */
exports.getAvailableAmenities = async (req, res) => {
  try {
    const amenities = [
      { key: 'water', label: 'Water' },
      { key: 'food', label: 'Food' },
      { key: 'medical', label: 'Medical' },
      { key: 'power', label: 'Power' },
      { key: 'shelter', label: 'Shelter' },
      { key: 'sanitation', label: 'Sanitation' },
      { key: 'communication', label: 'Communication' },
      { key: 'blankets', label: 'Blankets' },
      { key: 'firstAid', label: 'First Aid' }
    ];

    res.status(200).json({
      success: true,
      data: amenities
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching amenities',
      error: error.message
    });
  }
};

/**
 * @desc    Get safe zone types (for filter options)
 * @route   GET /api/safe-zones/types/list
 * @access  Public
 */
exports.getSafeZoneTypes = async (req, res) => {
  try {
    const types = [
      'Shelter',
      'Hospital',
      'Community Center',
      'School',
      'Religious Center',
      'Government Building',
      'Stadium',
      'Other'
    ];

    res.status(200).json({
      success: true,
      data: types
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching types',
      error: error.message
    });
  }
};

/**
 * @desc    Get safe zone statistics
 * @route   GET /api/safe-zones/stats
 * @access  Public
 */
exports.getSafeZoneStats = async (req, res) => {
  try {
    const totalSafeZones = await SafeZone.countDocuments({ isActive: true });
    const activeSafeZones = await SafeZone.countDocuments({ isActive: true, status: 'Active' });
    const fullSafeZones = await SafeZone.countDocuments({ isActive: true, status: 'Full' });
    
    const capacityStats = await SafeZone.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity.max' },
          totalOccupied: { $sum: '$capacity.current' }
        }
      }
    ]);

    const stats = {
      total: totalSafeZones,
      active: activeSafeZones,
      full: fullSafeZones,
      capacity: capacityStats.length > 0 ? {
        total: capacityStats[0].totalCapacity,
        occupied: capacityStats[0].totalOccupied,
        available: capacityStats[0].totalCapacity - capacityStats[0].totalOccupied
      } : {
        total: 0,
        occupied: 0,
        available: 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
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
 * @desc    Create new safe zone (Admin only - will add auth later)
 * @route   POST /api/safe-zones
 * @access  Private/Admin
 */
exports.createSafeZone = async (req, res) => {
  try {
    const safeZone = await SafeZone.create(req.body);

    res.status(201).json({
      success: true,
      data: safeZone
    });

  } catch (error) {
    console.error('Error creating safe zone:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating safe zone',
      error: error.message
    });
  }
};

/**
 * @desc    Update safe zone
 * @route   PUT /api/safe-zones/:id
 * @access  Private/Admin
 */
exports.updateSafeZone = async (req, res) => {
  try {
    const safeZone = await SafeZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!safeZone) {
      return res.status(404).json({
        success: false,
        message: 'Safe zone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: safeZone
    });

  } catch (error) {
    console.error('Error updating safe zone:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating safe zone',
      error: error.message
    });
  }
};

/**
 * @desc    Update safe zone capacity
 * @route   PATCH /api/safe-zones/:id/capacity
 * @access  Private/Coordinator
 */
exports.updateCapacity = async (req, res) => {
  try {
    const { current } = req.body;

    if (current === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current capacity'
      });
    }

    const safeZone = await SafeZone.findById(req.params.id);

    if (!safeZone) {
      return res.status(404).json({
        success: false,
        message: 'Safe zone not found'
      });
    }

    await safeZone.updateCapacity(current);

    res.status(200).json({
      success: true,
      data: safeZone
    });

  } catch (error) {
    console.error('Error updating capacity:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating capacity',
      error: error.message
    });
  }
};

/**
 * @desc    Delete safe zone
 * @route   DELETE /api/safe-zones/:id
 * @access  Private/Admin
 */
exports.deleteSafeZone = async (req, res) => {
  try {
    const safeZone = await SafeZone.findById(req.params.id);

    if (!safeZone) {
      return res.status(404).json({
        success: false,
        message: 'Safe zone not found'
      });
    }

    // Soft delete - just mark as inactive
    safeZone.isActive = false;
    await safeZone.save();

    res.status(200).json({
      success: true,
      message: 'Safe zone deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting safe zone:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting safe zone',
      error: error.message
    });
  }
};

module.exports = exports;
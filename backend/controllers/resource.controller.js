import DistributionCenter from '../models/DistributionCenter.model.js';

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
 * @desc    Get all distribution centers with filters
 * @route   GET /api/resources
 * @access  Public
 */
export async function getDistributionCenters(req, res) {
  try {
    const {
      latitude,
      longitude,
      maxDistance,
      type,
      status,
      category, // food, water, medical
      district,
      province,
      hasStock,
      sortBy,
      page = 1,
      limit = 50
    } = req.query;

    let query = { isActive: true };
    let centers;

    // If coordinates provided, use geospatial query
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const distance = maxDistance ? parseInt(maxDistance) * 1000 : 50000;

      centers = await DistributionCenter.find({
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

      // Calculate distance for each center
      centers = centers.map(center => {
        const dist = calculateDistance(
          lat,
          lon,
          center.location.coordinates[1],
          center.location.coordinates[0]
        );
        return {
          ...center.toObject(),
          distance: parseFloat(dist.toFixed(2))
        };
      });

    } else {
      centers = await DistributionCenter.find(query);
      centers = centers.map(center => center.toObject());
    }

    // Apply filters
    if (type) {
      centers = centers.filter(center => center.type === type);
    }

    if (status) {
      centers = centers.filter(center => center.status === status);
    }

    if (district) {
      centers = centers.filter(center => 
        center.location.district.toLowerCase() === district.toLowerCase()
      );
    }

    if (province) {
      centers = centers.filter(center => 
        center.location.province.toLowerCase() === province.toLowerCase()
      );
    }

    // Filter by category (has items in stock from that category)
    if (category) {
      centers = centers.filter(center => {
        return center.stockItems.some(item => 
          item.category.toLowerCase() === category.toLowerCase() && 
          item.currentStock > 0
        );
      });
    }

    // Filter by stock availability
    if (hasStock === 'true') {
      centers = centers.filter(center => 
        center.stockItems.some(item => item.currentStock > 0)
      );
    }

    // Sort results
    if (sortBy) {
      switch (sortBy) {
        case 'distance':
          centers.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case 'stock':
          centers.sort((a, b) => {
            const aStock = a.stockItems.reduce((sum, item) => sum + item.currentStock, 0);
            const bStock = b.stockItems.reduce((sum, item) => sum + item.currentStock, 0);
            return bStock - aStock;
          });
          break;
        case 'name':
          centers.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Default sort by name
          centers.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = centers.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedResults.length,
      total: centers.length,
      page: parseInt(page),
      totalPages: Math.ceil(centers.length / limit),
      data: paginatedResults
    });

  } catch (error) {
    console.error('Error fetching distribution centers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching distribution centers',
      error: error.message
    });
  }
}

/**
 * @desc    Get single distribution center by ID
 * @route   GET /api/resources/:id
 * @access  Public
 */
export async function getDistributionCenterById(req, res) {
  try {
    const { latitude, longitude } = req.query;

    const center = await DistributionCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Distribution center not found'
      });
    }

    let result = center.toObject();

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const distance = calculateDistance(
        lat,
        lon,
        center.location.coordinates[1],
        center.location.coordinates[0]
      );
      result.distance = parseFloat(distance.toFixed(2));
    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching distribution center:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching distribution center',
      error: error.message
    });
  }
}

/**
 * @desc    Search for specific item across all centers
 * @route   GET /api/resources/search/item
 * @access  Public
 */
export async function searchItem(req, res) {
  try {
    const { itemName, minStock = 1, latitude, longitude } = req.query;

    if (!itemName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item name'
      });
    }

    const centers = await findCentersWithItem(itemName, parseInt(minStock));

    let results = centers.map(center => {
      const stockItem = center.getStockItem(itemName);
      return {
        centerId: center._id,
        centerName: center.name,
        location: center.location,
        contact: center.contact,
        stockItem: stockItem,
        stockPercentage: center.getStockPercentage(stockItem),
        isLowStock: center.isLowStock(stockItem)
      };
    });

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      results = results.map(result => {
        const distance = calculateDistance(
          lat,
          lon,
          result.location.coordinates[1],
          result.location.coordinates[0]
        );
        return {
          ...result,
          distance: parseFloat(distance.toFixed(2))
        };
      });

      // Sort by distance
      results.sort((a, b) => a.distance - b.distance);
    }

    res.status(200).json({
      success: true,
      count: results.length,
      itemName: itemName,
      data: results
    });

  } catch (error) {
    console.error('Error searching for item:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching for item',
      error: error.message
    });
  }
}

/**
 * @desc    Get all low stock alerts
 * @route   GET /api/resources/alerts
 * @access  Public
 */
export async function getLowStockAlerts(req, res) {
  try {
    const { severity, isActive = true } = req.query;

    let query = { isActive: true };
    
    const centers = await DistributionCenter.find(query);

    let alerts = [];
    centers.forEach(center => {
      center.alerts.forEach(alert => {
        if (isActive === 'true' && !alert.isActive) return;
        if (severity && alert.severity !== severity) return;

        alerts.push({
          alertId: alert._id,
          centerId: center._id,
          centerName: center.name,
          location: center.location,
          type: alert.type,
          itemName: alert.itemName,
          message: alert.message,
          severity: alert.severity,
          createdAt: alert.createdAt,
          isActive: alert.isActive
        });
      });
    });

    // Sort by severity (Critical > High > Medium > Low) and then by date
    const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    alerts.sort((a, b) => {
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
}

/**
 * @desc    Get statistics
 * @route   GET /api/resources/stats
 * @access  Public
 */
export async function getResourceStats(req, res) {
  try {
    const totalCenters = await DistributionCenter.countDocuments({ isActive: true });
    const activeCenters = await DistributionCenter.countDocuments({ isActive: true, status: 'Active' });
    const lowStockCenters = await DistributionCenter.countDocuments({ isActive: true, status: 'Limited Supply' });
    
    // Get all active alerts
    const centersWithAlerts = await find({
      isActive: true,
      'alerts.isActive': true
    });

    const totalActiveAlerts = centersWithAlerts.reduce((sum, center) => {
      return sum + center.alerts.filter(a => a.isActive).length;
    }, 0);

    // Count critical alerts
    const criticalAlerts = centersWithAlerts.reduce((sum, center) => {
      return sum + center.alerts.filter(a => a.isActive && a.severity === 'Critical').length;
    }, 0);

    // Get total stock items
    const allCenters = await DistributionCenter.find({ isActive: true });
    const stockStats = {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0
    };

    allCenters.forEach(center => {
      center.stockItems.forEach(item => {
        stockStats.totalItems++;
        if (item.currentStock === 0) {
          stockStats.outOfStockItems++;
        } else if (center.isLowStock(item)) {
          stockStats.lowStockItems++;
        }
      });
    });

    res.status(200).json({
      success: true,
      data: {
        centers: {
          total: totalCenters,
          active: activeCenters,
          lowStock: lowStockCenters
        },
        alerts: {
          total: totalActiveAlerts,
          critical: criticalAlerts
        },
        stock: stockStats
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
}

/**
 * @desc    Create new distribution center (Admin)
 * @route   POST /api/resources
 * @access  Private/Admin
 */
export async function createDistributionCenter(req, res) {
  try {
    const center = await DistributionCenter.create(req.body);

    res.status(201).json({
      success: true,
      data: center
    });

  } catch (error) {
    console.error('Error creating distribution center:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating distribution center',
      error: error.message
    });
  }
}

/**
 * @desc    Update distribution center
 * @route   PUT /api/resources/:id
 * @access  Private/Admin
 */
export async function updateDistributionCenter(req, res) {
  try {
    const center = await DistributionCenter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Distribution center not found'
      });
    }

    res.status(200).json({
      success: true,
      data: center
    });

  } catch (error) {
    console.error('Error updating distribution center:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating distribution center',
      error: error.message
    });
  }
}

/**
 * @desc    Update stock item
 * @route   PATCH /api/resources/:id/stock
 * @access  Private/Coordinator
 */
export async function updateStock(req, res) {
  try {
    const { itemName, currentStock } = req.body;

    if (!itemName || currentStock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item name and current stock'
      });
    }

    const center = await DistributionCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Distribution center not found'
      });
    }

    await center.updateStock(itemName, currentStock);

    res.status(200).json({
      success: true,
      data: center
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating stock',
      error: error.message
    });
  }
}

/**
 * @desc    Delete distribution center
 * @route   DELETE /api/resources/:id
 * @access  Private/Admin
 */
export async function deleteDistributionCenter(req, res) {
  try {
    const center = await DistributionCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Distribution center not found'
      });
    }

    // Soft delete
    center.isActive = false;
    await center.save();

    res.status(200).json({
      success: true,
      message: 'Distribution center deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting distribution center:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting distribution center',
      error: error.message
    });
  }
}


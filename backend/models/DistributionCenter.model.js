import { Schema, model } from 'mongoose';

// Stock Item Schema
const stockItemSchema = new Schema({
  itemName: {
    type: String,
    required: true,
    enum: [
      'Water',
      'Food',
      'Medical Supplies',
      'Blankets',
      'Clothing',
      'Hygiene Kits',
      'Baby Supplies',
      'First Aid Kits',
      'Canned Food',
      'Dry Food',
      'Medicines',
      'Tents',
      'Sleeping Bags',
      'Flashlights',
      'Batteries',
      'Sanitation Supplies'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Water', 'Medical', 'Shelter', 'Hygiene', 'Other']
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maxStock: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    enum: ['bottles', 'packets', 'boxes', 'kits', 'pieces', 'liters', 'kg', 'units']
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 20 // percentage
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false // Stock items don't need separate IDs
});

// Distribution Center Schema
const distributionCenterSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a distribution center name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  
  type: {
    type: String,
    required: true,
    enum: ['Main Distribution Center', 'Community Center', 'Mobile Unit', 'Emergency Depot', 'Field Station'],
    default: 'Distribution Center'
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Please provide coordinates'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address']
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    postalCode: String
  },
  
  stockItems: [stockItemSchema],
  
  operatingHours: {
    open24x7: {
      type: Boolean,
      default: false
    },
    schedule: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      openTime: String,
      closeTime: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  contact: {
    phone: {
      type: String,
      required: [true, 'Please provide a contact number']
    },
    email: String,
    coordinatorName: String,
    alternatePhone: String
  },
  
  status: {
    type: String,
    enum: ['Active', 'Temporarily Closed', 'Out of Stock', 'Limited Supply'],
    default: 'Active'
  },
  
  capacity: {
    totalStorageSpace: Number, // in square meters
    currentUtilization: Number, // percentage
  },
  
  services: {
    distribution: {
      type: Boolean,
      default: true
    },
    donations: {
      type: Boolean,
      default: true
    },
    delivery: {
      type: Boolean,
      default: false
    },
    emergencyDispatch: {
      type: Boolean,
      default: false
    }
  },
  
  alerts: [{
    type: {
      type: String,
      enum: ['Low Stock', 'Critical Stock', 'Out of Stock', 'Restocked']
    },
    itemName: String,
    message: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  statistics: {
    totalDistributions: {
      type: Number,
      default: 0
    },
    totalDonationsReceived: {
      type: Number,
      default: 0
    },
    peopleServed: {
      type: Number,
      default: 0
    }
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
distributionCenterSchema.index({ 'location.coordinates': '2dsphere' });
distributionCenterSchema.index({ status: 1, isActive: 1 });
distributionCenterSchema.index({ 'location.district': 1 });
distributionCenterSchema.index({ 'location.province': 1 });

// Virtual for stock summary by category
distributionCenterSchema.virtual('stockSummary').get(function() {
  const summary = {
    food: { count: 0, low: 0 },
    water: { count: 0, low: 0 },
    medical: { count: 0, low: 0 },
    other: { count: 0, low: 0 }
  };

  this.stockItems.forEach(item => {
    const cat = item.category.toLowerCase();
    if (summary[cat]) {
      summary[cat].count++;
      if (this.isLowStock(item)) {
        summary[cat].low++;
      }
    } else {
      summary.other.count++;
      if (this.isLowStock(item)) {
        summary.other.low++;
      }
    }
  });

  return summary;
});

// Virtual for overall stock status
distributionCenterSchema.virtual('overallStockStatus').get(function() {
  if (this.stockItems.length === 0) return 'Unknown';
  
  const criticalItems = this.stockItems.filter(item => 
    this.getStockPercentage(item) < 10
  );
  const lowItems = this.stockItems.filter(item => 
    this.getStockPercentage(item) < item.lowStockThreshold
  );

  if (criticalItems.length > 0) return 'Critical';
  if (lowItems.length > this.stockItems.length / 2) return 'Low';
  if (lowItems.length > 0) return 'Fair';
  return 'Good';
});

// Virtual for active low stock alerts
distributionCenterSchema.virtual('activeAlerts').get(function() {
  return this.alerts.filter(alert => alert.isActive).length;
});

// Method to check if item is low stock
distributionCenterSchema.methods.isLowStock = function(stockItem) {
  const percentage = (stockItem.currentStock / stockItem.maxStock) * 100;
  return percentage <= stockItem.lowStockThreshold;
};

// Method to get stock percentage
distributionCenterSchema.methods.getStockPercentage = function(stockItem) {
  return Math.round((stockItem.currentStock / stockItem.maxStock) * 100);
};

// Method to update stock item
distributionCenterSchema.methods.updateStock = async function(itemName, newStock) {
  const item = this.stockItems.find(i => i.itemName === itemName);
  
  if (!item) {
    throw new Error('Stock item not found');
  }

  const oldStock = item.currentStock;
  item.currentStock = newStock;
  item.lastRestocked = Date.now();

  // Generate alert if needed
  const percentage = this.getStockPercentage(item);
  
  if (percentage === 0 && oldStock > 0) {
    // Out of stock
    this.alerts.push({
      type: 'Out of Stock',
      itemName: item.itemName,
      message: `${item.itemName} is now out of stock`,
      severity: 'Critical',
      isActive: true
    });
  } else if (percentage <= 10 && percentage > 0) {
    // Critical stock
    this.alerts.push({
      type: 'Critical Stock',
      itemName: item.itemName,
      message: `${item.itemName} is critically low (${percentage}%)`,
      severity: 'Critical',
      isActive: true
    });
  } else if (this.isLowStock(item)) {
    // Low stock
    this.alerts.push({
      type: 'Low Stock',
      itemName: item.itemName,
      message: `${item.itemName} is running low (${percentage}%)`,
      severity: 'Medium',
      isActive: true
    });
  } else if (newStock > oldStock && oldStock < item.maxStock * 0.2) {
    // Restocked from low
    this.alerts.push({
      type: 'Restocked',
      itemName: item.itemName,
      message: `${item.itemName} has been restocked to ${percentage}%`,
      severity: 'Low',
      isActive: true
    });
  }

  // Update status
  this.updateStatus();
  this.lastUpdated = Date.now();
  
  return await this.save();
};

// Method to update overall status
distributionCenterSchema.methods.updateStatus = function() {
  const outOfStock = this.stockItems.every(item => item.currentStock === 0);
  const criticalStock = this.stockItems.filter(item => 
    this.getStockPercentage(item) < 10
  ).length > this.stockItems.length / 2;
  
  if (outOfStock) {
    this.status = 'Out of Stock';
  } else if (criticalStock) {
    this.status = 'Limited Supply';
  } else {
    this.status = 'Active';
  }
};

// Method to get item by name
distributionCenterSchema.methods.getStockItem = function(itemName) {
  return this.stockItems.find(item => item.itemName === itemName);
};

// Static method to find centers with specific item in stock
distributionCenterSchema.statics.findCentersWithItem = function(itemName, minStock = 1) {
  return this.find({
    'stockItems': {
      $elemMatch: {
        itemName: itemName,
        currentStock: { $gte: minStock }
      }
    },
    isActive: true
  });
};

// Static method to find centers with low stock
distributionCenterSchema.statics.findLowStockCenters = function() {
  return this.find({
    isActive: true,
    'alerts.isActive': true,
    'alerts.severity': { $in: ['High', 'Critical'] }
  });
};

// Pre-save middleware
distributionCenterSchema.pre('save', async function() {
  this.lastUpdated = Date.now();
});

const DistributionCenter = model('DistributionCenter', distributionCenterSchema);

export default DistributionCenter;
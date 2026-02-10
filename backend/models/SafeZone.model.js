import { Schema, model } from 'mongoose';

const safeZoneSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a safe zone name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Please specify the type of safe zone'],
    enum: ['Shelter', 'Hospital', 'Community Center', 'School', 'Religious Center', 'Government Building', 'Stadium', 'Other']
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
  
  capacity: {
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum capacity'],
      min: 1
    }
  },
  
  amenities: {
    water: {
      type: Boolean,
      default: false
    },
    food: {
      type: Boolean,
      default: false
    },
    medical: {
      type: Boolean,
      default: false
    },
    power: {
      type: Boolean,
      default: false
    },
    shelter: {
      type: Boolean,
      default: false
    },
    sanitation: {
      type: Boolean,
      default: false
    },
    communication: {
      type: Boolean,
      default: false
    },
    blankets: {
      type: Boolean,
      default: false
    },
    firstAid: {
      type: Boolean,
      default: false
    }
  },
  
  contact: {
    phone: {
      type: String,
      required: [true, 'Please provide a contact number']
    },
    email: String,
    coordinatorName: String
  },
  
  status: {
    type: String,
    enum: ['Active', 'Full', 'Closed', 'Temporarily Unavailable'],
    default: 'Active'
  },
  
  operatingHours: {
    open24x7: {
      type: Boolean,
      default: true
    },
    openTime: String,
    closeTime: String
  },
  
  accessibility: {
    wheelchairAccessible: {
      type: Boolean,
      default: false
    },
    parkingAvailable: {
      type: Boolean,
      default: false
    },
    publicTransport: {
      type: Boolean,
      default: false
    }
  },
  
  safetyFeatures: {
    fireExtinguisher: Boolean,
    emergencyExit: Boolean,
    securityPersonnel: Boolean,
    cctv: Boolean
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  images: [{
    url: String,
    description: String
  }],
  
  lastVerified: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create geospatial index for location-based queries
safeZoneSchema.index({ 'location.coordinates': '2dsphere' });

// Create indexes for common queries
safeZoneSchema.index({ status: 1, isActive: 1 });
safeZoneSchema.index({ type: 1 });
safeZoneSchema.index({ 'location.district': 1 });
safeZoneSchema.index({ 'location.province': 1 });

// Virtual for occupancy percentage
safeZoneSchema.virtual('occupancyPercentage').get(function() {
  return Math.round((this.capacity.current / this.capacity.max) * 100);
});

// Virtual for available spots
safeZoneSchema.virtual('availableSpots').get(function() {
  return this.capacity.max - this.capacity.current;
});

// Virtual for capacity status
safeZoneSchema.virtual('capacityStatus').get(function() {
  const percentage = this.occupancyPercentage;
  if (percentage >= 100) return 'Full';
  if (percentage >= 90) return 'Almost Full';
  if (percentage >= 70) return 'Filling Up';
  return 'Available';
});

// Method to check if safe zone has specific amenity
safeZoneSchema.methods.hasAmenity = function(amenity) {
  return this.amenities[amenity] === true;
};

// Method to update capacity
safeZoneSchema.methods.updateCapacity = async function(newCurrent) {
  this.capacity.current = newCurrent;
  
  // Auto-update status based on capacity
  if (newCurrent >= this.capacity.max) {
    this.status = 'Full';
  } else if (this.status === 'Full' && newCurrent < this.capacity.max) {
    this.status = 'Active';
  }
  
  return await this.save();
};

// Static method to find nearby safe zones
safeZoneSchema.statics.findNearby = function(longitude, latitude, maxDistance = 50000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    isActive: true
  });
};

// Pre-save middleware
safeZoneSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

const SafeZone = model('SafeZone', safeZoneSchema);

export default SafeZone;
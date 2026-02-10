import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an update title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Please provide update content'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  
  severity: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  
  category: {
    type: String,
    required: true,
    enum: [
      'Alert',
      'Weather Update',
      'Road Closure',
      'Evacuation Notice',
      'Resource Update',
      'Safety Advisory',
      'All Clear',
      'General Information',
      'Emergency Response',
      'Infrastructure Damage'
    ]
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
    address: String,
    city: String,
    district: String,
    province: String,
    affectedAreas: [String] // Array of affected area names
  },
  
  source: {
    type: {
      type: String,
      required: true,
      enum: ['DMC', 'Coordinator', 'Field Officer', 'System', 'Volunteer', 'Weather Bureau', 'Police', 'Fire Department']
    },
    name: String,
    verified: {
      type: Boolean,
      default: false
    },
    contactInfo: String
  },
  
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    url: String,
    description: String
  }],
  
  tags: [String],
  
  relatedIncidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident'
  },
  
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isPinned: {
    type: Boolean,
    default: false
  },
  
  expiresAt: {
    type: Date
  },
  
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    publishedAt: Date,
    lastEditedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for efficient queries
updateSchema.index({ createdAt: -1 });
updateSchema.index({ severity: 1, createdAt: -1 });
updateSchema.index({ 'location.province': 1, createdAt: -1 });
updateSchema.index({ 'location.district': 1, createdAt: -1 });
updateSchema.index({ 'location.coordinates': '2dsphere' });
updateSchema.index({ category: 1, createdAt: -1 });
updateSchema.index({ isActive: 1, isPinned: -1, createdAt: -1 });
updateSchema.index({ tags: 1 });

// Virtual for time ago
updateSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Virtual for severity color
updateSchema.virtual('severityColor').get(function() {
  const colors = {
    'Critical': 'red',
    'High': 'orange',
    'Medium': 'yellow',
    'Low': 'blue'
  };
  return colors[this.severity] || 'gray';
});

// Virtual for is recent (within last 24 hours)
updateSchema.virtual('isRecent').get(function() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > dayAgo;
});

// Virtual for is expired
updateSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return this.expiresAt < new Date();
});

// Method to increment view count
updateSchema.methods.incrementViews = async function() {
  this.statistics.views += 1;
  return await this.save();
};

// Method to increment share count
updateSchema.methods.incrementShares = async function() {
  this.statistics.shares += 1;
  return await this.save();
};

// Method to check if update is still relevant
updateSchema.methods.isRelevant = function() {
  if (!this.isActive) return false;
  if (this.isExpired) return false;
  return true;
};

// Static method to get recent critical updates
updateSchema.statics.getRecentCritical = function(limit = 5) {
  return this.find({
    severity: { $in: ['Critical', 'High'] },
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ isPinned: -1, createdAt: -1 })
  .limit(limit);
};

// Static method to get updates by location
updateSchema.statics.getByLocation = function(province, district = null) {
  const query = {
    'location.province': province,
    isActive: true
  };
  
  if (district) {
    query['location.district'] = district;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to search updates
updateSchema.statics.searchUpdates = function(searchTerm) {
  return this.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ],
    isActive: true
  }).sort({ createdAt: -1 });
};

// Pre-save middleware
updateSchema.pre('save', async function() {
  // Set published date if not set
  if (!this.metadata) {
    this.metadata = {};
  }
  
  if (!this.metadata.publishedAt && this.isActive) {
    this.metadata.publishedAt = new Date();
  }
  
  // Deactivate if expired
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isActive = false;
  }
});

// Method to format for timeline
updateSchema.methods.toTimeline = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    severity: this.severity,
    severityColor: this.severityColor,
    category: this.category,
    location: {
      province: this.location.province,
      district: this.location.district,
      city: this.location.city,
      affectedAreas: this.location.affectedAreas
    },
    source: this.source,
    timestamp: this.createdAt,
    timeAgo: this.timeAgo,
    isRecent: this.isRecent,
    isPinned: this.isPinned,
    tags: this.tags,
    media: this.media,
    statistics: this.statistics
  };
};

const Update = mongoose.model('Update', updateSchema);

export default Update;
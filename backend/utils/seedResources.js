const mongoose = require('mongoose');
const DistributionCenter = require('../models/DistributionCenter.model');

// Sample distribution centers data
const sampleDistributionCenters = [
  {
    name: 'Colombo Central Distribution Center',
    type: 'Main Distribution Center',
    location: {
      type: 'Point',
      coordinates: [79.8612, 6.9271],
      address: 'Reid Avenue, Colombo 00700',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western Province',
      postalCode: '00700'
    },
    stockItems: [
      {
        itemName: 'Water',
        category: 'Water',
        currentStock: 450,
        maxStock: 1000,
        unit: 'bottles',
        lowStockThreshold: 30
      },
      {
        itemName: 'Canned Food',
        category: 'Food',
        currentStock: 850,
        maxStock: 1500,
        unit: 'units',
        lowStockThreshold: 25
      },
      {
        itemName: 'Medical Supplies',
        category: 'Medical',
        currentStock: 320,
        maxStock: 500,
        unit: 'kits',
        lowStockThreshold: 20
      },
      {
        itemName: 'Blankets',
        category: 'Shelter',
        currentStock: 180,
        maxStock: 400,
        unit: 'pieces',
        lowStockThreshold: 25
      },
      {
        itemName: 'Hygiene Kits',
        category: 'Hygiene',
        currentStock: 95,
        maxStock: 300,
        unit: 'kits',
        lowStockThreshold: 30
      }
    ],
    operatingHours: {
      open24x7: true
    },
    contact: {
      phone: '+94112696677',
      email: 'colombo.center@safelanka.lk',
      coordinatorName: 'Mr. Saman Perera'
    },
    status: 'Active',
    services: {
      distribution: true,
      donations: true,
      delivery: true,
      emergencyDispatch: true
    },
    description: 'Main distribution center serving Colombo and surrounding areas with 24/7 operations.'
  },
  {
    name: 'Gampaha Community Resource Center',
    type: 'Community Center',
    location: {
      type: 'Point',
      coordinates: [80.0117, 7.0873],
      address: 'Main Street, Gampaha',
      city: 'Gampaha',
      district: 'Gampaha',
      province: 'Western Province',
      postalCode: '11000'
    },
    stockItems: [
      {
        itemName: 'Water',
        category: 'Water',
        currentStock: 120,
        maxStock: 500,
        unit: 'bottles',
        lowStockThreshold: 30
      },
      {
        itemName: 'Dry Food',
        category: 'Food',
        currentStock: 65,
        maxStock: 300,
        unit: 'packets',
        lowStockThreshold: 25
      },
      {
        itemName: 'First Aid Kits',
        category: 'Medical',
        currentStock: 25,
        maxStock: 100,
        unit: 'kits',
        lowStockThreshold: 30
      },
      {
        itemName: 'Clothing',
        category: 'Other',
        currentStock: 90,
        maxStock: 200,
        unit: 'pieces',
        lowStockThreshold: 20
      }
    ],
    operatingHours: {
      open24x7: false,
      schedule: [
        { day: 'Monday', openTime: '08:00', closeTime: '18:00', isClosed: false },
        { day: 'Tuesday', openTime: '08:00', closeTime: '18:00', isClosed: false },
        { day: 'Wednesday', openTime: '08:00', closeTime: '18:00', isClosed: false },
        { day: 'Thursday', openTime: '08:00', closeTime: '18:00', isClosed: false },
        { day: 'Friday', openTime: '08:00', closeTime: '18:00', isClosed: false },
        { day: 'Saturday', openTime: '08:00', closeTime: '14:00', isClosed: false },
        { day: 'Sunday', openTime: '08:00', closeTime: '14:00', isClosed: false }
      ]
    },
    contact: {
      phone: '+94332229988',
      email: 'gampaha.resources@safelanka.lk',
      coordinatorName: 'Mrs. Kumari Silva'
    },
    status: 'Limited Supply',
    services: {
      distribution: true,
      donations: true,
      delivery: false,
      emergencyDispatch: false
    }
  },
  {
    name: 'Kalutara Emergency Depot',
    type: 'Emergency Depot',
    location: {
      type: 'Point',
      coordinates: [79.9597, 6.5854],
      address: 'Hospital Road, Kalutara',
      city: 'Kalutara',
      district: 'Kalutara',
      province: 'Western Province',
      postalCode: '12000'
    },
    stockItems: [
      {
        itemName: 'Water',
        category: 'Water',
        currentStock: 5,
        maxStock: 600,
        unit: 'bottles',
        lowStockThreshold: 25
      },
      {
        itemName: 'Food',
        category: 'Food',
        currentStock: 12,
        maxStock: 400,
        unit: 'packets',
        lowStockThreshold: 20
      },
      {
        itemName: 'Medicines',
        category: 'Medical',
        currentStock: 45,
        maxStock: 200,
        unit: 'units',
        lowStockThreshold: 30
      },
      {
        itemName: 'Tents',
        category: 'Shelter',
        currentStock: 8,
        maxStock: 50,
        unit: 'units',
        lowStockThreshold: 20
      }
    ],
    operatingHours: {
      open24x7: true
    },
    contact: {
      phone: '+94342227788',
      email: 'kalutara.depot@safelanka.lk',
      coordinatorName: 'Mr. Nimal Fernando'
    },
    status: 'Limited Supply',
    services: {
      distribution: true,
      donations: true,
      delivery: true,
      emergencyDispatch: true
    },
    description: 'Emergency depot with critical stock shortages. Urgent restocking needed.'
  },
  {
    name: 'Negombo Field Station',
    type: 'Field Station',
    location: {
      type: 'Point',
      coordinates: [79.8358, 7.2008],
      address: 'Beach Road, Negombo',
      city: 'Negombo',
      district: 'Gampaha',
      province: 'Western Province',
      postalCode: '11500'
    },
    stockItems: [
      {
        itemName: 'Water',
        category: 'Water',
        currentStock: 380,
        maxStock: 600,
        unit: 'bottles',
        lowStockThreshold: 25
      },
      {
        itemName: 'Canned Food',
        category: 'Food',
        currentStock: 240,
        maxStock: 400,
        unit: 'units',
        lowStockThreshold: 25
      },
      {
        itemName: 'Medical Supplies',
        category: 'Medical',
        currentStock: 95,
        maxStock: 150,
        unit: 'kits',
        lowStockThreshold: 30
      },
      {
        itemName: 'Baby Supplies',
        category: 'Other',
        currentStock: 42,
        maxStock: 100,
        unit: 'kits',
        lowStockThreshold: 35
      }
    ],
    operatingHours: {
      open24x7: false,
      schedule: [
        { day: 'Monday', openTime: '07:00', closeTime: '20:00', isClosed: false },
        { day: 'Tuesday', openTime: '07:00', closeTime: '20:00', isClosed: false },
        { day: 'Wednesday', openTime: '07:00', closeTime: '20:00', isClosed: false },
        { day: 'Thursday', openTime: '07:00', closeTime: '20:00', isClosed: false },
        { day: 'Friday', openTime: '07:00', closeTime: '20:00', isClosed: false },
        { day: 'Saturday', openTime: '07:00', closeTime: '20:00', isClosed: false },
        { day: 'Sunday', openTime: '07:00', closeTime: '20:00', isClosed: false }
      ]
    },
    contact: {
      phone: '+94312228899',
      email: 'negombo.station@safelanka.lk',
      coordinatorName: 'Mrs. Anoma Jayasinghe'
    },
    status: 'Active',
    services: {
      distribution: true,
      donations: true,
      delivery: false,
      emergencyDispatch: false
    }
  },
  {
    name: 'Dehiwala Mobile Distribution Unit',
    type: 'Mobile Unit',
    location: {
      type: 'Point',
      coordinates: [79.8653, 6.8411],
      address: 'Galle Road, Dehiwala',
      city: 'Dehiwala-Mount Lavinia',
      district: 'Colombo',
      province: 'Western Province',
      postalCode: '10350'
    },
    stockItems: [
      {
        itemName: 'Water',
        category: 'Water',
        currentStock: 180,
        maxStock: 300,
        unit: 'bottles',
        lowStockThreshold: 30
      },
      {
        itemName: 'Food',
        category: 'Food',
        currentStock: 140,
        maxStock: 250,
        unit: 'packets',
        lowStockThreshold: 25
      },
      {
        itemName: 'First Aid Kits',
        category: 'Medical',
        currentStock: 58,
        maxStock: 100,
        unit: 'kits',
        lowStockThreshold: 30
      },
      {
        itemName: 'Flashlights',
        category: 'Other',
        currentStock: 35,
        maxStock: 80,
        unit: 'units',
        lowStockThreshold: 25
      }
    ],
    operatingHours: {
      open24x7: true
    },
    contact: {
      phone: '+94112736655',
      email: 'dehiwala.mobile@safelanka.lk',
      coordinatorName: 'Mr. Ruwan Wickramasinghe'
    },
    status: 'Active',
    services: {
      distribution: true,
      donations: false,
      delivery: true,
      emergencyDispatch: true
    },
    description: 'Mobile unit providing on-site distribution and emergency response.'
  }
];

// Seed function
const seedDistributionCenters = async () => {
  try {
    console.log('🌱 Starting to seed distribution centers...');

    // Clear existing centers
    await DistributionCenter.deleteMany({});
    console.log('✅ Cleared existing distribution centers');

    // Insert sample data
    const centers = await DistributionCenter.insertMany(sampleDistributionCenters);
    console.log(`✅ Created ${centers.length} distribution centers`);

    // Generate low stock alerts
    for (const center of centers) {
      const updatedCenter = await DistributionCenter.findById(center._id);
      
      updatedCenter.stockItems.forEach(item => {
        const percentage = updatedCenter.getStockPercentage(item);
        
        if (percentage === 0) {
          updatedCenter.alerts.push({
            type: 'Out of Stock',
            itemName: item.itemName,
            message: `${item.itemName} is out of stock`,
            severity: 'Critical',
            isActive: true
          });
        } else if (percentage <= 10) {
          updatedCenter.alerts.push({
            type: 'Critical Stock',
            itemName: item.itemName,
            message: `${item.itemName} is critically low (${percentage}%)`,
            severity: 'Critical',
            isActive: true
          });
        } else if (updatedCenter.isLowStock(item)) {
          updatedCenter.alerts.push({
            type: 'Low Stock',
            itemName: item.itemName,
            message: `${item.itemName} is running low (${percentage}%)`,
            severity: 'Medium',
            isActive: true
          });
        }
      });

      updatedCenter.updateStatus();
      await updatedCenter.save();
    }

    console.log('✅ Generated stock alerts');

    console.log('🎉 Distribution centers seed data created successfully!');
    console.log('📊 Summary:');
    console.log(`   - Total Centers: ${centers.length}`);
    
    const activeCount = centers.filter(c => c.status === 'Active').length;
    const limitedCount = centers.filter(c => c.status === 'Limited Supply').length;
    
    console.log(`   - Active: ${activeCount}`);
    console.log(`   - Limited Supply: ${limitedCount}`);
    
    const totalItems = centers.reduce((sum, c) => sum + c.stockItems.length, 0);
    console.log(`   - Total Stock Items: ${totalItems}`);

  } catch (error) {
    console.error('❌ Error seeding distribution centers:', error);
    throw error;
  }
};

// Run seed function
const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safelanka', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    await seedDistributionCenters();

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

module.exports = { seedDistributionCenters, runSeed };

if (require.main === module) {
  runSeed();
}
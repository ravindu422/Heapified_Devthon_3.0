const mongoose = require('mongoose');
const Update = require('../models/Update.model');

// Sample updates data
const sampleUpdates = [
  {
    title: 'Critical Flood Warning - Immediate Evacuation Required',
    content: 'Water levels in Kelani River have reached critical levels. All residents in low-lying areas of Colombo, Kaduwela, and Kelaniya are advised to evacuate immediately. Emergency shelters have been opened at Nalanda College and Royal College.',
    severity: 'Critical',
    category: 'Evacuation Notice',
    location: {
      type: 'Point',
      coordinates: [79.8612, 6.9271],
      address: 'Kelani River Basin',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western Province',
      affectedAreas: ['Kaduwela', 'Kelaniya', 'Kolonnawa', 'Peliyagoda']
    },
    source: {
      type: 'DMC',
      name: 'Disaster Management Centre',
      verified: true,
      contactInfo: '117'
    },
    tags: ['flood', 'evacuation', 'critical', 'kelani river'],
    isPinned: true,
    createdAt: new Date(Date.now() - 15 * 60000) // 15 minutes ago
  },
  {
    title: 'Landslide Alert Issued for Central Province',
    content: 'Heavy rainfall has destabilized slopes in Nuwara Eliya and Badulla districts. Residents in hilly areas should remain vigilant and be prepared to evacuate if necessary. Avoid traveling on hill country roads during heavy rain.',
    severity: 'High',
    category: 'Alert',
    location: {
      type: 'Point',
      coordinates: [80.7891, 6.9497],
      city: 'Nuwara Eliya',
      district: 'Nuwara Eliya',
      province: 'Central Province',
      affectedAreas: ['Nuwara Eliya', 'Badulla', 'Hatton', 'Bandarawela']
    },
    source: {
      type: 'Weather Bureau',
      name: 'Department of Meteorology',
      verified: true,
      contactInfo: '+94112686685'
    },
    tags: ['landslide', 'rainfall', 'central province'],
    isPinned: true,
    createdAt: new Date(Date.now() - 45 * 60000) // 45 minutes ago
  },
  {
    title: 'Galle Road Partially Closed Due to Flooding',
    content: 'Galle Road between Bambalapitiya and Wellawatte is experiencing severe flooding. Motorists are advised to use alternative routes. Traffic is being diverted through Duplication Road.',
    severity: 'High',
    category: 'Road Closure',
    location: {
      type: 'Point',
      coordinates: [79.8553, 6.8849],
      address: 'Galle Road, Bambalapitiya',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western Province',
      affectedAreas: ['Bambalapitiya', 'Wellawatte', 'Kollupitiya']
    },
    source: {
      type: 'Police',
      name: 'Traffic Police Colombo',
      verified: true,
      contactInfo: '119'
    },
    tags: ['road closure', 'traffic', 'flooding', 'galle road'],
    createdAt: new Date(Date.now() - 2 * 3600000) // 2 hours ago
  },
  {
    title: 'Distribution Center Update - Medical Supplies Available',
    content: 'Colombo Central Distribution Center has received fresh medical supplies and drinking water. Available for distribution from 8 AM to 6 PM. Priority given to families with children and elderly.',
    severity: 'Medium',
    category: 'Resource Update',
    location: {
      type: 'Point',
      coordinates: [79.8612, 6.9271],
      address: 'Reid Avenue, Colombo 00700',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western Province'
    },
    source: {
      type: 'Coordinator',
      name: 'Mr. Saman Perera',
      verified: true,
      contactInfo: '+94112696677'
    },
    tags: ['resources', 'medical supplies', 'distribution'],
    createdAt: new Date(Date.now() - 3 * 3600000) // 3 hours ago
  },
  {
    title: 'Weather Advisory - Heavy Rainfall Expected',
    content: 'Met Department forecasts heavy rainfall (over 150mm) in Western, Sabaragamuwa, and Central provinces for the next 48 hours. Strong winds and rough seas also expected along the coast. Fishermen advised not to venture out.',
    severity: 'Medium',
    category: 'Weather Update',
    location: {
      province: 'Western Province',
      affectedAreas: ['Western Province', 'Sabaragamuwa Province', 'Central Province']
    },
    source: {
      type: 'Weather Bureau',
      name: 'Department of Meteorology',
      verified: true,
      contactInfo: '+94112686685'
    },
    tags: ['weather', 'rainfall', 'forecast', 'advisory'],
    createdAt: new Date(Date.now() - 5 * 3600000) // 5 hours ago
  },
  {
    title: 'Temporary Shelter Opened at Gampaha',
    content: 'A temporary shelter has been opened at Gampaha Bandaranayake College to accommodate displaced families. Shelter provides food, water, and basic medical facilities. Contact coordinator for registration.',
    severity: 'Medium',
    category: 'General Information',
    location: {
      type: 'Point',
      coordinates: [80.0117, 7.0873],
      address: 'Gampaha',
      city: 'Gampaha',
      district: 'Gampaha',
      province: 'Western Province'
    },
    source: {
      type: 'Coordinator',
      name: 'Mrs. Kumari Silva',
      verified: true,
      contactInfo: '+94332229988'
    },
    tags: ['shelter', 'accommodation', 'gampaha'],
    createdAt: new Date(Date.now() - 6 * 3600000) // 6 hours ago
  },
  {
    title: 'Power Restored in Dehiwala Area',
    content: 'Ceylon Electricity Board announces power has been fully restored in Dehiwala, Mount Lavinia, and surrounding areas after emergency repairs. All residents can now resume normal activities.',
    severity: 'Low',
    category: 'General Information',
    location: {
      type: 'Point',
      coordinates: [79.8653, 6.8411],
      city: 'Dehiwala',
      district: 'Colombo',
      province: 'Western Province',
      affectedAreas: ['Dehiwala', 'Mount Lavinia', 'Ratmalana']
    },
    source: {
      type: 'System',
      name: 'Ceylon Electricity Board',
      verified: true,
      contactInfo: '1987'
    },
    tags: ['power', 'electricity', 'restored'],
    createdAt: new Date(Date.now() - 8 * 3600000) // 8 hours ago
  },
  {
    title: 'Emergency Response Team Deployed to Kalutara',
    content: 'Fire and rescue teams have been deployed to Kalutara district to assist with flood relief operations. Teams are equipped with boats and rescue equipment. Emergency hotline: 110.',
    severity: 'High',
    category: 'Emergency Response',
    location: {
      type: 'Point',
      coordinates: [79.9597, 6.5854],
      city: 'Kalutara',
      district: 'Kalutara',
      province: 'Western Province'
    },
    source: {
      type: 'Fire Department',
      name: 'Fire & Rescue Services',
      verified: true,
      contactInfo: '110'
    },
    tags: ['emergency', 'rescue', 'kalutara'],
    createdAt: new Date(Date.now() - 10 * 3600000) // 10 hours ago
  },
  {
    title: 'Schools Closed in Western Province',
    content: 'Ministry of Education announces all schools in Colombo, Gampaha, and Kalutara districts will remain closed tomorrow (Feb 9) due to adverse weather conditions. Parents are advised to keep children at home.',
    severity: 'Medium',
    category: 'Safety Advisory',
    location: {
      province: 'Western Province',
      affectedAreas: ['Colombo', 'Gampaha', 'Kalutara']
    },
    source: {
      type: 'System',
      name: 'Ministry of Education',
      verified: true
    },
    tags: ['schools', 'closure', 'education'],
    createdAt: new Date(Date.now() - 12 * 3600000) // 12 hours ago
  },
  {
    title: 'All Clear - Negombo Area Safe',
    content: 'Flood waters have receded in Negombo area. Residents who evacuated can now return to their homes. Please check your property for damage and report any issues to local authorities.',
    severity: 'Low',
    category: 'All Clear',
    location: {
      type: 'Point',
      coordinates: [79.8358, 7.2008],
      city: 'Negombo',
      district: 'Gampaha',
      province: 'Western Province'
    },
    source: {
      type: 'DMC',
      name: 'Disaster Management Centre',
      verified: true,
      contactInfo: '117'
    },
    tags: ['all clear', 'negombo', 'safe'],
    createdAt: new Date(Date.now() - 18 * 3600000) // 18 hours ago
  }
];

// Seed function
const seedUpdates = async () => {
  try {
    console.log('🌱 Starting to seed updates...');

    // Clear existing updates
    await Update.deleteMany({});
    console.log('✅ Cleared existing updates');

    // Insert sample data
    const updates = await Update.insertMany(sampleUpdates);
    console.log(`✅ Created ${updates.length} updates`);

    console.log('🎉 Updates seed data created successfully!');
    console.log('📊 Summary:');
    
    const criticalCount = updates.filter(u => u.severity === 'Critical').length;
    const highCount = updates.filter(u => u.severity === 'High').length;
    const mediumCount = updates.filter(u => u.severity === 'Medium').length;
    const lowCount = updates.filter(u => u.severity === 'Low').length;
    
    console.log(`   - Total Updates: ${updates.length}`);
    console.log(`   - Critical: ${criticalCount}`);
    console.log(`   - High: ${highCount}`);
    console.log(`   - Medium: ${mediumCount}`);
    console.log(`   - Low: ${lowCount}`);
    console.log(`   - Pinned: ${updates.filter(u => u.isPinned).length}`);

  } catch (error) {
    console.error('❌ Error seeding updates:', error);
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

    await seedUpdates();

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

module.exports = { seedUpdates, runSeed };

if (require.main === module) {
  runSeed();
}
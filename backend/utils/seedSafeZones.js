const mongoose = require('mongoose');
const SafeZone = require('../models/SafeZone.model');

// Sample safe zones data for Sri Lanka (Colombo area)
const sampleSafeZones = [
  {
    name: 'Colombo National Hospital Emergency Shelter',
    type: 'Hospital',
    location: {
      type: 'Point',
      coordinates: [79.8612, 6.9271], // [longitude, latitude] - Colombo
      address: 'Regent Street, Colombo 00800',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western Province',
      postalCode: '00800'
    },
    capacity: {
      current: 120,
      max: 500
    },
    amenities: {
      water: true,
      food: true,
      medical: true,
      power: true,
      shelter: true,
      sanitation: true,
      communication: true,
      blankets: true,
      firstAid: true
    },
    contact: {
      phone: '+94112691111',
      email: 'emergency@nhsl.lk',
      coordinatorName: 'Dr. Kumara Silva'
    },
    status: 'Active',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: true,
      cctv: true
    },
    description: 'Main emergency shelter with full medical facilities and 24/7 operation.',
    isActive: true
  },
  {
    name: 'Gampaha Community Center',
    type: 'Community Center',
    location: {
      type: 'Point',
      coordinates: [80.0117, 7.0873], // Gampaha
      address: 'Main Street, Gampaha',
      city: 'Gampaha',
      district: 'Gampaha',
      province: 'Western Province',
      postalCode: '11000'
    },
    capacity: {
      current: 45,
      max: 200
    },
    amenities: {
      water: true,
      food: true,
      medical: false,
      power: true,
      shelter: true,
      sanitation: true,
      communication: true,
      blankets: true,
      firstAid: true
    },
    contact: {
      phone: '+94332222333',
      email: 'gampaha.center@gmail.com',
      coordinatorName: 'Nimal Perera'
    },
    status: 'Active',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: false,
      cctv: false
    },
    description: 'Large community center with basic amenities and food distribution.',
    isActive: true
  },
  {
    name: 'Dehiwala Mount Lavinia Stadium',
    type: 'Stadium',
    location: {
      type: 'Point',
      coordinates: [79.8653, 6.8411], // Mount Lavinia
      address: 'Galle Road, Mount Lavinia',
      city: 'Dehiwala-Mount Lavinia',
      district: 'Colombo',
      province: 'Western Province',
      postalCode: '10370'
    },
    capacity: {
      current: 350,
      max: 1000
    },
    amenities: {
      water: true,
      food: true,
      medical: true,
      power: true,
      shelter: true,
      sanitation: true,
      communication: false,
      blankets: false,
      firstAid: true
    },
    contact: {
      phone: '+94112736789',
      email: 'stadium.emergency@dehiwala.lk',
      coordinatorName: 'Ruwan Fernando'
    },
    status: 'Active',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: true,
      cctv: true
    },
    description: 'Large capacity stadium converted to emergency shelter with medical support.',
    isActive: true
  },
  {
    name: 'Negombo St. Mary\'s Church Relief Center',
    type: 'Religious Center',
    location: {
      type: 'Point',
      coordinates: [79.8358, 7.2008], // Negombo
      address: 'Church Road, Negombo',
      city: 'Negombo',
      district: 'Gampaha',
      province: 'Western Province',
      postalCode: '11500'
    },
    capacity: {
      current: 80,
      max: 150
    },
    amenities: {
      water: true,
      food: true,
      medical: false,
      power: false,
      shelter: true,
      sanitation: true,
      communication: false,
      blankets: true,
      firstAid: true
    },
    contact: {
      phone: '+94312227890',
      email: 'stmarys.relief@negombo.lk',
      coordinatorName: 'Father Anthony'
    },
    status: 'Active',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: false,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: false,
      cctv: false
    },
    description: 'Church-based relief center providing shelter and food to affected families.',
    isActive: true
  },
  {
    name: 'Kalutara District Secretariat Emergency Center',
    type: 'Government Building',
    location: {
      type: 'Point',
      coordinates: [79.9597, 6.5854], // Kalutara
      address: 'Main Street, Kalutara',
      city: 'Kalutara',
      district: 'Kalutara',
      province: 'Western Province',
      postalCode: '12000'
    },
    capacity: {
      current: 200,
      max: 200
    },
    amenities: {
      water: true,
      food: true,
      medical: true,
      power: true,
      shelter: true,
      sanitation: true,
      communication: true,
      blankets: true,
      firstAid: true
    },
    contact: {
      phone: '+94342227654',
      email: 'disaster@kalutara.gov.lk',
      coordinatorName: 'Mrs. Chandrika Wickramasinghe'
    },
    status: 'Full',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: true,
      cctv: true
    },
    description: 'Government-run emergency center with full facilities - currently at capacity.',
    isActive: true
  },
  {
    name: 'Ragama Railway Station Shelter',
    type: 'Other',
    location: {
      type: 'Point',
      coordinates: [79.9242, 7.0267], // Ragama
      address: 'Station Road, Ragama',
      city: 'Ragama',
      district: 'Gampaha',
      province: 'Western Province',
      postalCode: '11010'
    },
    capacity: {
      current: 30,
      max: 100
    },
    amenities: {
      water: true,
      food: false,
      medical: false,
      power: true,
      shelter: true,
      sanitation: true,
      communication: true,
      blankets: false,
      firstAid: false
    },
    contact: {
      phone: '+94332228901',
      email: 'ragama.station@railway.lk',
      coordinatorName: 'Station Master Bandara'
    },
    status: 'Active',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: false,
      parkingAvailable: false,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: true,
      cctv: true
    },
    description: 'Temporary shelter at railway station with basic facilities.',
    isActive: true
  },
  {
    name: 'Colombo Royal College Emergency Shelter',
    type: 'School',
    location: {
      type: 'Point',
      coordinates: [79.8618, 6.9044], // Colombo 7
      address: 'Rajakeeya Mawatha, Colombo 07',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western Province',
      postalCode: '00700'
    },
    capacity: {
      current: 150,
      max: 400
    },
    amenities: {
      water: true,
      food: true,
      medical: true,
      power: true,
      shelter: true,
      sanitation: true,
      communication: true,
      blankets: true,
      firstAid: true
    },
    contact: {
      phone: '+94112695281',
      email: 'emergency@royalcollege.lk',
      coordinatorName: 'Principal Gunawardena'
    },
    status: 'Active',
    operatingHours: {
      open24x7: true
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: true,
      cctv: true
    },
    description: 'School converted to emergency shelter with medical support and food distribution.',
    isActive: true
  },
  {
    name: 'Moratuwa Technical College Safe Zone',
    type: 'School',
    location: {
      type: 'Point',
      coordinates: [79.8816, 6.7731], // Moratuwa
      address: 'Katubedda Road, Moratuwa',
      city: 'Moratuwa',
      district: 'Colombo',
      province: 'Western Province',
      postalCode: '10400'
    },
    capacity: {
      current: 90,
      max: 250
    },
    amenities: {
      water: true,
      food: true,
      medical: false,
      power: true,
      shelter: true,
      sanitation: true,
      communication: true,
      blankets: true,
      firstAid: true
    },
    contact: {
      phone: '+94112645123',
      email: 'emergency@moratechcollege.lk',
      coordinatorName: 'Mr. Jayasinghe'
    },
    status: 'Active',
    operatingHours: {
      open24x7: false,
      openTime: '06:00',
      closeTime: '22:00'
    },
    accessibility: {
      wheelchairAccessible: true,
      parkingAvailable: true,
      publicTransport: true
    },
    safetyFeatures: {
      fireExtinguisher: true,
      emergencyExit: true,
      securityPersonnel: false,
      cctv: false
    },
    description: 'Technical college providing daytime shelter with food and basic amenities.',
    isActive: true
  }
];

// Seed function
const seedSafeZones = async () => {
  try {
    console.log('🌱 Starting to seed safe zones data...');

    // Clear existing safe zones
    await SafeZone.deleteMany({});
    console.log('✅ Cleared existing safe zones');

    // Insert sample data
    const safeZones = await SafeZone.insertMany(sampleSafeZones);
    console.log(`✅ Created ${safeZones.length} safe zones`);

    console.log('🎉 Safe zones seed data created successfully!');
    console.log('📊 Summary:');
    console.log(`   - Total Safe Zones: ${safeZones.length}`);
    
    const activeCount = safeZones.filter(z => z.status === 'Active').length;
    const fullCount = safeZones.filter(z => z.status === 'Full').length;
    
    console.log(`   - Active: ${activeCount}`);
    console.log(`   - Full: ${fullCount}`);
    
    const totalCapacity = safeZones.reduce((sum, z) => sum + z.capacity.max, 0);
    const totalOccupied = safeZones.reduce((sum, z) => sum + z.capacity.current, 0);
    
    console.log(`   - Total Capacity: ${totalCapacity}`);
    console.log(`   - Currently Occupied: ${totalOccupied}`);
    console.log(`   - Available Spots: ${totalCapacity - totalOccupied}`);

  } catch (error) {
    console.error('❌ Error seeding safe zones:', error);
    throw error;
  }
};

// Run seed function
const runSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safelanka', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    await seedSafeZones();

    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Export for use in other files
module.exports = { seedSafeZones, runSeed };

// Run if called directly
if (require.main === module) {
  runSeed();
}
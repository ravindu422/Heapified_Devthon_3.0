const mongoose = require('mongoose');
const {
  ActiveAlert,
  CurrentSituation,
  IntelligenceMetrics,
  RiskProbability,
  PopulationTrendPoint,
  GeographicRisk,
  Recommendation
} = require('../models/Crisis.model');

// Sample data for testing
const seedData = async () => {
  try {
    console.log('🌱 Starting to seed crisis data...');

    // Clear existing data
    await ActiveAlert.deleteMany({});
    await CurrentSituation.deleteMany({});
    await IntelligenceMetrics.deleteMany({});
    await RiskProbability.deleteMany({});
    await PopulationTrendPoint.deleteMany({});
    await GeographicRisk.deleteMany({});
    await Recommendation.deleteMany({});

    console.log('✅ Cleared existing data');

    // Seed Active Alert
    const activeAlert = await ActiveAlert.create({
      type: 'FLOOD ALERT',
      province: 'WESTERN PROVINCE',
      message: 'Evacuation ongoing in Colombo, Gampaha',
      isActive: true,
      updatedAt: new Date(Date.now() - 8 * 60000) // 8 minutes ago
    });
    console.log('✅ Created active alert');

    // Seed Current Situations
    const situations = await CurrentSituation.insertMany([
      {
        type: 'Floods',
        severity: 'High',
        affectedDistricts: 5,
        riskLevel: 'High Risk',
        color: 'red',
        isActive: true,
        updatedAt: new Date(Date.now() - 2 * 60000) // 2 minutes ago
      },
      {
        type: 'Landslides',
        severity: 'Warning',
        affectedAreas: '2 Areas reported',
        riskLevel: 'Medium Risk',
        color: 'orange',
        isActive: true,
        updatedAt: new Date(Date.now() - 2 * 60000)
      },
      {
        type: 'Strong Winds',
        severity: 'Low',
        affectedAreas: 'Coastal areas',
        riskLevel: 'Low Risk',
        color: 'yellow',
        isActive: true,
        updatedAt: new Date(Date.now() - 2 * 60000)
      }
    ]);
    console.log('✅ Created current situations');

    // Seed Intelligence Metrics
    const intelligence = await IntelligenceMetrics.create({
      peopleAffected: 12450,
      peopleAffectedTrend: 'Increasing',
      homesDamaged: 3120,
      homesDamagedImpact: 'High Impact',
      safeZonesActive: 28,
      safeZonesStatus: 'Stable',
      riskEscalation: 62,
      riskEscalationTime: 'Next 24 Hours',
      updatedAt: new Date()
    });
    console.log('✅ Created intelligence metrics');

    // Seed Risk Probabilities
    const riskProbabilities = await RiskProbability.insertMany([
      { type: 'Flood', probability: 85 },
      { type: 'Landslides', probability: 65 },
      { type: 'Strong Winds', probability: 45 }
    ]);
    console.log('✅ Created risk probabilities');

    // Seed Population Trend Data
    const now = Date.now();
    const populationTrend = await PopulationTrendPoint.insertMany([
      { time: '6h ago', count: 8000, timestamp: new Date(now - 6 * 3600000) },
      { time: '5h ago', count: 8500, timestamp: new Date(now - 5 * 3600000) },
      { time: '4h ago', count: 9200, timestamp: new Date(now - 4 * 3600000) },
      { time: '3h ago', count: 10100, timestamp: new Date(now - 3 * 3600000) },
      { time: '2h ago', count: 11200, timestamp: new Date(now - 2 * 3600000) },
      { time: '1h ago', count: 11800, timestamp: new Date(now - 1 * 3600000) },
      { time: 'Now', count: 12450, timestamp: new Date(now) }
    ]);
    console.log('✅ Created population trend data');

    // Seed Geographic Risk Distribution
    const geographicRisks = await GeographicRisk.insertMany([
      { district: 'Western Province', percentage: 35 },
      { district: 'Sabaragamuwa Province', percentage: 25 },
      { district: 'Central Province', percentage: 20 },
      { district: 'Southern Province', percentage: 12 },
      { district: 'Other Areas', percentage: 8 }
    ]);
    console.log('✅ Created geographic risk data');

    // Seed Recommendation
    const recommendation = await Recommendation.create({
      message: 'Residents in Western Province should prepare for possible evacuation within the next 6-12 hours.',
      isActive: true
    });
    console.log('✅ Created recommendation');

    console.log('🎉 Seed data created successfully!');
    console.log('📊 Summary:');
    console.log(`   - Active Alerts: 1`);
    console.log(`   - Current Situations: ${situations.length}`);
    console.log(`   - Intelligence Metrics: 1`);
    console.log(`   - Risk Probabilities: ${riskProbabilities.length}`);
    console.log(`   - Population Trend Points: ${populationTrend.length}`);
    console.log(`   - Geographic Risks: ${geographicRisks.length}`);
    console.log(`   - Recommendations: 1`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
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

    await seedData();

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
module.exports = { seedData, runSeed };

// Run if called directly
if (require.main === module) {
  runSeed();
}
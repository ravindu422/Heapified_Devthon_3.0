import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  ActiveAlert,
  CurrentSituation,
  IntelligenceMetrics,
  RiskProbability,
  PopulationTrendPoint,
  GeographicRisk,
  Recommendation
} from '../models/Crisis.model.js';

dotenv.config();

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
      province: 'Western Province',
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
        affectedAreas: '5 Districts in Western Province',
        riskLevel: 'High Risk',
        color: 'red',
        isActive: true,
        updatedAt: new Date(Date.now() - 2 * 60000) // 2 minutes ago
      },
      {
        type: 'Landslides',
        severity: 'Warning',
        affectedDistricts: 2,
        affectedAreas: '2 Areas reported',
        riskLevel: 'Medium Risk',
        color: 'orange',
        isActive: true,
        updatedAt: new Date(Date.now() - 2 * 60000)
      },
      {
        type: 'Strong Winds',
        severity: 'Low',
        affectedDistricts: 1,
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
      homesDamagedImpact: 'Concentrated in flood zones',
      safeZonesActive: 28,
      safeZonesStatus: 'Stable',
      riskEscalation: 62,
      riskEscalationTime: 'Within next 12-24 hours',
      updatedAt: new Date()
    });
    console.log('✅ Created intelligence metrics');

    // Seed Risk Probabilities
    const riskProbabilities = await RiskProbability.insertMany([
      { type: 'Floods', probability: 85, updatedAt: new Date() },
      { type: 'Landslides', probability: 65, updatedAt: new Date() },
      { type: 'Strong Winds', probability: 45, updatedAt: new Date() },
      { type: 'Drought', probability: 20, updatedAt: new Date() }
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
      { district: 'Colombo', percentage: 35, updatedAt: new Date() },
      { district: 'Gampaha', percentage: 25, updatedAt: new Date() },
      { district: 'Kalutara', percentage: 20, updatedAt: new Date() },
      { district: 'Ratnapura', percentage: 12, updatedAt: new Date() },
      { district: 'Kegalle', percentage: 8, updatedAt: new Date() }
    ]);
    console.log('✅ Created geographic risk data');

    // Seed Recommendation
    const recommendation = await Recommendation.create({
      message: '⚠️ Residents in Western Province should prepare for possible evacuation within the next 6-12 hours. Monitor updates regularly.',
      isActive: true
    });
    console.log('✅ Created recommendation');

    console.log('\n🎉 Seed data created successfully!');
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
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
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

// Run the seed
runSeed();